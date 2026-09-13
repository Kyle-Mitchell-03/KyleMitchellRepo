const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});
 
const app = express();
 
// Parse JSON bodies
app.use(express.json());
 
// CORS
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    if (req.method === 'OPTIONS') {
        return res.sendStatus(204);
    }
    next();
});
 
// Serve static files (index.html/css/js) from ./public
const PUBLIC_DIR = path.join(__dirname, 'public');
app.use(express.static(PUBLIC_DIR));
 
// Small helper to cut down on repetition for simple SELECT * endpoints
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
 
// ---------- GET ----------
app.get('/api/Hiragana', makeListHandler('Hiragana'));
app.get('/api/Katakana', makeListHandler('Katakana'));
app.get('/api/Kanji', makeListHandler('Kanji'));
app.get('/api/Sentences', makeListHandler('Sentences'));
app.get('/api/Glossary', makeListHandler('Glossary'));
 
// ---------- POST ----------
app.post('/api/Kanji', async (req, res, next) => {
    try {
        const { Word, Romanji, Def } = req.body;
 
        console.log('Received body:', req.body);
        console.log('Word:', Word);
        console.log('Romanji:', Romanji);
        console.log('Def:', Def);
 
        const [result] = await pool.query(
            'INSERT INTO Kanji (Word, Romanji, Def) VALUES (?, ?, ?)',
            [Word, JSON.stringify(Romanji), JSON.stringify(Def)]
        );
 
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        next(err);
    }
});
 
app.post('/api/Sentences', async (req, res, next) => {
    try {
        const { Sentence, Def } = req.body;
 
        console.log('Received body:', req.body);
        console.log('Sentence:', Sentence);
        console.log('Def:', Def);
 
        const [result] = await pool.query(
            'INSERT INTO Sentences (Sentence, Def) VALUES (?, ?)',
            [Sentence, Def]
        );
 
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        next(err);
    }
});
 
app.post('/api/Glossary', async (req, res, next) => {
    try {
        const { Word, Romanji, Def } = req.body;
 
        console.log('Received body:', req.body);
        console.log('Word:', Word);
        console.log('Romanji:', Romanji);
        console.log('Def:', Def);
 
        const [result] = await pool.query(
            'INSERT INTO Glossary (Word, Romanji, Def) VALUES (?, ?, ?)',
            [Word, JSON.stringify(Romanji), JSON.stringify(Def)]
        );
 
        res.status(201).json({ id: result.insertId });
    } catch (err) {
        next(err);
    }
});
 
// ---------- DELETE ----------
app.delete('/api/Kanji/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Kanji WHERE id = ?', [id]);
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Kanji not found' });
        }
 
        res.json({ message: 'Kanji deleted', id });
    } catch (err) {
        next(err);
    }
});
 
app.delete('/api/Sentences/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Sentences WHERE id = ?', [id]);
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Sentence not found' });
        }
 
        res.json({ message: 'Sentence deleted', id });
    } catch (err) {
        next(err);
    }
});
 
app.delete('/api/Glossary/:id', async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('DELETE FROM Glossary WHERE id = ?', [id]);
 
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Word not found' });
        }
 
        res.json({ message: 'Word deleted', id });
    } catch (err) {
        next(err);
    }
});
 
// ---------- PUT ----------
app.put('/api/Kanji/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Word, Romanji, Def } = req.body;
 
        await pool.query(
            `UPDATE Kanji SET WORD = ?, Romanji = ?, Def = ? WHERE id = ?`,
            [Word, JSON.stringify(Romanji), JSON.stringify(Def), id]
        );
 
        res.json({ message: 'Updated' });
    } catch (err) {
        console.error('PUT Kanji error:', err);
        res.status(500).json({ error: 'Failed to update Kanji' });
    }
});
 
app.put('/api/Sentences/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Sentence, Def } = req.body;
 
        await pool.query(
            `UPDATE Sentences SET Sentence = ?, Def = ? WHERE id = ?`,
            [Sentence, Def, id]
        );
 
        res.json({ message: 'Updated' });
    } catch (err) {
        console.error('PUT Sentence error:', err);
        res.status(500).json({ error: 'Failed to update Sentence' });
    }
});
 
app.put('/api/Glossary/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { Word, Romanji, Def } = req.body;
 
        await pool.query(
            `UPDATE Glossary SET WORD = ?, Romanji = ?, Def = ? WHERE id = ?`,
            [Word, JSON.stringify(Romanji), JSON.stringify(Def), id]
        );
 
        res.json({ message: 'Updated' });
    } catch (err) {
        console.error('PUT Vocab error:', err);
        res.status(500).json({ error: 'Failed to update Vocab' });
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