const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');
 
//require('dotenv').config();
const pool = mysql.createPool({
    host: 'localhost', //process.env.DB_HOST,
    user: 'root',//process.env.DB_USER,
    password: '',//process.env.DB_PASSWORD,
    database: 'Travel', //process.env.DB_NAME
    dateStrings: true
});
 
const app = express();
 
app.use(express.json());
 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
 
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));
 
// ---------- Link resolving / geocoding config ----------
const CONTACT = "your-real-email@gmail.com";   // <-- put your actual email here (used for Nominatim)
const SHORT_HOSTS = ["maps.app.goo.gl", "goo.gl", "share.google"];
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/124 Safari/537.36";
 
function safeDecode(s) {
    try { return decodeURIComponent(s); } catch { return s; }
}
 
// Pulls coordinates straight out of a Google Maps URL. Returns null if none are present.
function parseGoogleMapsLink(rawUrl) {
    const decoded = safeDecode(rawUrl);
 
    // 1. exact place pin: !3d<lat>!4d<lng>
    let m = decoded.match(/!3d(-?\d+\.\d+)!4d(-?\d+\.\d+)/);
    if (m) return { lat: parseFloat(m[1]), lng: parseFloat(m[2]) };
 
    // 2. query params holding "lat,lng" (use the raw URL so values aren't double-decoded)
    try {
        const u = new URL(rawUrl);
        for (const key of ["destination", "query", "q", "ll", "daddr"]) {
            const v = u.searchParams.get(key);
            const c = v && v.match(/^\s*(-?\d+\.\d+)\s*,\s*(-?\d+\.\d+)\s*$/);
            if (c) return { lat: parseFloat(c[1]), lng: parseFloat(c[2]) };
        }
    } catch { /* not a valid URL */ }
 
    // 3. directions waypoints: !1d<lng>!2d<lat>, last pair = destination (note: lng first)
    const wp = [...decoded.matchAll(/!1d(-?\d+\.\d+)!2d(-?\d+\.\d+)/g)];
    if (wp.length) {
        const last = wp[wp.length - 1];
        return { lat: parseFloat(last[2]), lng: parseFloat(last[1]) };
    }
 
    return null;
}
 
// Place or destination name from /maps/place/<name>/ or /maps/dir/<origin>/<dest>/
function nameFromLink(rawUrl) {
    try {
        const parts = new URL(safeDecode(rawUrl)).pathname.split("/").filter(Boolean);
        const i = parts.findIndex(p => p === "place" || p === "dir");
        if (i === -1) return null;
        const segs = parts.slice(i + 1).filter(p => !p.startsWith("@") && !p.startsWith("data="));
        const name = segs[segs.length - 1];
        return name ? name.replace(/\+/g, " ") : null;
    } catch { return null; }
}
 
// Text address / place name from query params (daddr on directions links, q on search links)
function addressFromLink(rawUrl) {
    try {
        const u = new URL(rawUrl);
        for (const key of ["daddr", "destination", "q", "query"]) {
            const v = u.searchParams.get(key);
            // skip values that are already "lat,lng"
            if (v && !/^\s*-?\d+\.\d+\s*,\s*-?\d+\.\d+\s*$/.test(v)) return v;
        }
    } catch {}
    return null;
}
 
// ---------- Geocoders ----------
async function geocodeNominatim(q) {
    const r = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&email=${encodeURIComponent(CONTACT)}&q=${encodeURIComponent(q)}`,
        {
            headers: { "User-Agent": `TripApp/1.0 (${CONTACT})`, "Accept-Language": "en" },
            signal: AbortSignal.timeout(10000)
        }
    );
    if (!r.ok) { console.log("nominatim failed:", r.status); return null; }
    const data = await r.json();
    return data[0] ? { lat: +data[0].lat, lng: +data[0].lon } : null;
}
 
async function geocodePhoton(q) {
    const r = await fetch(
        `https://photon.komoot.io/api/?limit=1&q=${encodeURIComponent(q)}`,
        { signal: AbortSignal.timeout(10000) }
    );
    if (!r.ok) { console.log("photon failed:", r.status); return null; }
    const data = await r.json();
    const f = data.features && data.features[0];
    return f ? { lat: f.geometry.coordinates[1], lng: f.geometry.coordinates[0] } : null;
}
 
// Tries Photon first, then Nominatim. Never throws; returns null on failure.
async function geocode(q) {
    try {
        const hit = await geocodePhoton(q);
        if (hit) return hit;
    } catch (err) {
        console.log("photon error:", err.message);
    }
    try {
        return await geocodeNominatim(q);
    } catch (err) {
        console.log("nominatim error:", err.message);
        return null;
    }
}
 
// Geocodes a full address, trimming trailing words (building names, floors) if it misses
async function geocodeAddress(addr) {
    const cleaned = addr
        .replace(/[−‐‑–]/g, "-")        // Google uses a Unicode minus in addresses
        .replace(/〒\s*[\d-]+/g, "")     // drop the postal-code mark
        .trim();
    const tokens = cleaned.split(/\s+/).filter(Boolean);
    if (!tokens.length) return null;
 
    const minWords = Math.min(2, tokens.length);
    let tries = 0;
    for (let n = tokens.length; n >= minWords && tries < 4; n--, tries++) {
        const hit = await geocode(tokens.slice(0, n).join(" "));
        if (hit) return hit;
        await new Promise(r => setTimeout(r, 1100));   // be polite to the free geocoders
    }
    return null;
}
 
function makeListHandler(table) {
    return async (req, res, next) => {
        try {
            const [rows] = await pool.query(`SELECT * FROM ${table}`);
            res.json(rows);
        } catch (err) {
            next(err);
        }
    };
}
 
app.get('/api/Trips', makeListHandler('Trips'));
app.get('/api/days', makeListHandler('days'));
app.get('/api/activities', makeListHandler('activities'));
 
app.get('/api/resolve-link', async (req, res) => {
    try {
        let { url } = req.query;
        console.log("incoming url:", url);
        const u = new URL(url);
 
        // follow short links to their final URL
        if (SHORT_HOSTS.includes(u.hostname)) {
            const response = await fetch(url, {
                redirect: "follow",
                headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" },
                signal: AbortSignal.timeout(10000)
            });
            url = response.url;
            console.log("resolved to:", url, response.status);
            // unwrap a consent-page redirect if Google sent one
            const cont = new URL(url).searchParams.get("continue");
            if (cont) url = cont;
        }
 
        // 1. coordinates directly in the URL
        let coords = parseGoogleMapsLink(url);
 
        // 2. text address / place name in the query string (daddr, q, ...)
        if (!coords) {
            const addr = addressFromLink(url);
            if (addr) coords = await geocodeAddress(addr);
        }
 
        // 3. place name in the path (/maps/place/<name>/)
        if (!coords) {
            const name = nameFromLink(url);
            if (name) coords = await geocode(name);
        }
 
        // 4. last resort: map viewport center
        if (!coords) {
            const m = safeDecode(url).match(/@(-?\d+\.\d+),(-?\d+\.\d+)/);
            if (m) coords = { lat: +m[1], lng: +m[2] };
        }
 
        if (!coords) {
            return res.status(422).json({ error: "No coordinates found in that link" });
        }
        res.json(coords);
    } catch (err) {
        console.error("resolve-link failed:", err);
        res.status(500).json({ error: "Could not resolve link" });
    }
});
 
app.get('/api/Trips/:id', async (req, res) => {
    try {
        const { id } = req.params;
 
        const [rows] = await pool.query('SELECT * FROM Trips WHERE id = ?', [id]);
 
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
 
        res.json(rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
 
//GET ROUTE FOR DAYS WITH GIVEN TRIP ID
app.get('/api/days/:id', async (req, res) => {
    try {
        const { id } = req.params;
 
        const [rows] = await pool.query('SELECT * FROM days WHERE tripID = ? ORDER BY dayDate ASC', [id]);
        res.json(rows);
 
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});
 
app.get("/api/activities/:id", async (req, res) => {
    try {
        const tripId = Number(req.params.id);
        const [rows] = await pool.query(
            "SELECT * FROM activities WHERE tripId = ? ORDER BY startTime ASC",
            [tripId]
        );
        res.json(rows);
    } catch (err) {
        console.error("GET /api/activities failed:", err);
        res.status(500).json({ error: err.message });
    }
});
 
app.get(`/api/Trips/:tripId/days/:dayNumber`, async (req, res) => {
    try {
        const { tripId, dayNumber } = req.params;
        const [rows] = await pool.query(`SELECT * FROM days WHERE tripId = ? AND dayNumber = ?`, [tripId, dayNumber]);
        if (rows.length === 0) {
            return res.status(404).json({ error: 'Day not found' });
        }
        res.json(rows[0]);
    }
    catch (err) {
        console.log(err);
        res.status(500).json({ error: err.message });
    }
})
 
app.get(`/api/restaurants/:tripId`, async (req, res) => {
    try {
        const { tripId } = req.params;
        const [rows] = await pool.query(`SELECT * FROM restaurants WHERE tripId = ?`, [tripId]);
        res.json(rows);
    }
    catch (err) {
        console.error("GET /api/restaurants failed: ", err);
        res.status(500).json({ error: err.message });
    }
})
 
function getDateRange(startDate, endDate) {
    const dates = [];
    const current = new Date(`${startDate}T00:00:00Z`);
    const end = new Date(`${endDate}T00:00:00Z`);
 
    while (current <= end) {
        dates.push(current.toISOString().slice(0, 10));
        current.setUTCDate(current.getUTCDate() + 1);
    }
    return dates;
}
 
app.put('/api/Trips/:tripId/days/:dayNumber', async (req, res, next) => {
    try {
        const { tripId, dayNumber } = req.params;
        const { notes } = req.body;
 
        if (typeof notes !== 'string') {
            return res.status(400).json({ error: 'Notes are required' });
        }
 
        const [result] = await pool.query(
            'UPDATE days SET notes = ? WHERE tripID = ? AND dayNumber = ?',
            [notes, tripId, dayNumber]
        );
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Day not found' });
        }
 
        res.json({ message: 'Notes saved' });
    } catch (err) {
        next(err);
    }
});
 
app.put('/api/activities/:activityId', async (req, res, next) => {
    const { activityId } = req.params;
    const { activityName, notes, location, cost, startTime, endTime, lat, lng} = req.body;
 
    if (!activityName) {
        return res.status(400).json({ error: 'activityName is required' });
    }
 
    try {
        const [result] = await pool.query(
            `UPDATE activities
             SET activityName = ?, notes = ?, location = ?, cost = ?, startTime = ?, endTime = ?, lat = ?, lng = ?
             WHERE id = ?`,
            [
                activityName,
                notes || null,
                location || null,
                cost === '' || cost == null ? 0 : cost,
                startTime || null,
                endTime || null,
                lat,
                lng,
                activityId
            ]
        );
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
});
 
app.post(`/api/restaurants`, async(req,res,next) => {
    const {tripId, restName, notes, location, webpage, lat, lng} = req.body;
 
    if(!tripId || !restName || !location)
    {
        return res.status(400).json({ error: 'tripId, restName, and location are required'});
    }
 
    try{
        const[result] = await pool.query(
            `INSERT INTO restaurants (tripId, restName, notes, location, webpage, lat, lng) VALUES (?,?,?,?,?,?,?)`, 
                [tripId,restName,notes,location, webpage,lat,lng]
        );
        res.status(201).json({ id: result.insertId, restName });
    } catch (err) {
        next(err);
    }
});
 
app.post('/api/activities', async (req, res, next) => {
    const { tripId, dayID, activityName, notes, location, cost, startTime, endTime, lat, lng } = req.body;
 
    if (!tripId || !dayID || !activityName) {
        return res.status(400).json({ error: 'tripId, dayID, and activityName are required' });
    }
 
    try {
        const [result] = await pool.query(
            `INSERT INTO activities (tripId, dayID, activityName, notes, location, cost, startTime, endTime, lat, lng)
             VALUES (?,?,?,?,?,?,?,?,?,?)`,
            [
                tripId,
                dayID,
                activityName,
                notes || null,
                location || null,
                cost === '' || cost == null ? 0 : cost,
                startTime || null,
                endTime || null,
                lat,
                lng
            ]
        );
        res.status(201).json({ id: result.insertId, activityName });
    } catch (err) {
        next(err);
    }
});
 
app.post('/api/Trips', async (req, res, next) => {
    const { Title, startDate, endDate } = req.body;
 
    if (!Title || !startDate || !endDate) {
        return res.status(400).json({ error: 'Title, startDate, and endDate are required' });
    }
    const dates = getDateRange(startDate, endDate);
    if (dates.length === 0) {
        return res.status(400).json({ error: 'End date must be on or after start date' });
    }
    if (dates.length > 366) {
        return res.status(400).json({ error: 'Trips are limited to 366 days' });
    }
    const conn = await pool.getConnection();
    try {
        await conn.beginTransaction();
        const [result] = await conn.query(
            `INSERT INTO Trips (Title, startDate, endDate) VALUES (?,?,?)`, [Title, startDate, endDate]
        );
        const tripId = result.insertId;
        const dayRows = dates.map((date, i) => [tripId, i + 1, date]);
        await conn.query(
            `INSERT INTO days (tripID, dayNumber, dayDate) VALUES ?`, [dayRows]
        );
        await conn.commit();
        res.status(201).json({ id: tripId, daysCreated: dates.length });
    }
    catch (err) {
        await conn.rollback();
        next(err);
    }
    finally {
        conn.release();
    }
});
 
app.delete('/api/Trips/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Trips WHERE id = ?', [id]);
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Trip not found' });
        }
 
        res.json({ message: 'Trip deleted', id });
    }
    catch (err) {
        next(err);
    }
})
 
app.delete('/api/activities/:activityId', async (req, res, next) => {
    try {
        const { activityId } = req.params;
        const [result] = await pool.query('DELETE FROM activities WHERE id = ?', [activityId]);
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Activity not found' });
        }
 
        res.json({ message: 'Activity deleted', id: activityId });
    } catch (err) {
        next(err);
    }
});
 
// ---------- 404 for unmatched /api routes ----------
app.use('/api', (req, res) => {
    res.status(404).json({ error: 'Not found' });
});
 
// ---------- Central error handler ----------
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
});
 
app.listen(3000, () => console.log('Server running on http://localhost:3000'));