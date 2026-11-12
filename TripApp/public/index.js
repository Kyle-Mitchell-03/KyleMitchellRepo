const wraps = document.getElementById("wrapper");
const errors = document.getElementById("error");
const tripDiv = document.getElementById("trips");
let tripList = [];



async function tripPage() {
    wraps.innerHTML = `
        <main>
            <div id="error" class="error"></div>
            <div class="card">
                <input type="search" name="q" placeholder="Search Trips">
            </div>
            <div id="trips" class="card"></div>
            <div class="card">
                <button onclick="setParams()">Create Trip</button>
            </div>
            <div class="card">
                <button onclick="home()">Home</button>
            </div>
        </main>
    `;

    const tripDiv = document.getElementById("trips");
    const errorDiv = document.getElementById("error");

    try {
        const response = await fetch("/api/Trips");
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        const tripList = await response.json();
        tripDiv.innerHTML = tripList.map(t => `<div class = "card button-card">
                                                    <button id = "tripButton" onclick = "loadTripPage(${t.id})">${t.Title}</button>
                                                    <button class = "delete" id = "delTrip" onclick = "deleteTrip(${t.id})">Delete</button>
                                                </div>`).join("");
    } catch (err) {
        console.log("Failed to load Trips:", err);
        errorDiv.innerHTML = `<h2>Failed to load Trips</h2>`;
    }
}

async function home() {
    wraps.innerHTML = `
    <header>
            <h1>TripApp</h1>
        </header>
        <main>
            <div class = "card">
                <button onclick = "tripPage()">
                    View Trips
                </button>
            </div>
            <div class = "dashboard">
                <h2>Another Section</h2>
                <p>add another option here</p>
            </div>
        </main>
    `;
}

async function setParams() {
    wraps.innerHTML = `
        <main>
            <header>
                <h1>Create Trip</h1>
            </header>
            <div class = "card">
                <input type = "param" id = "name" placeholder = "Trip Name">
            </div>
            <div class = "card">
                <input type = "date" id = "Startdate" placeholder = "StartDate">
            </div>
            <div class = "card">
                <input type = "date" id = "Enddate" placeholder = "EndDate">
            </div>
            <button onclick = "createTrip()">
                Create Trip
            </button>
        </main>
    `;
}

async function createTrip() {
    const name = document.getElementById("name").value;
    const startdate = document.getElementById("Startdate").value;
    const enddate = document.getElementById("Enddate").value;

    if (!name || !startdate || !enddate) {
        document.getElementById("error").innerHTML = '<h2>Please fill in all fields</h2>';
        return;
    }
    try {
        const response = await (fetch("/api/Trips", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                Title: name,
                startDate: startdate,
                endDate: enddate
                //createdAt: timestamp made
            })
        }));
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Creation Failed");
        }
        tripPage();
    }
    catch (err) {
        console.error("Failed to add trip:", err);
        wraps.innerHTML = `
        <main>
            <header>
                <h1>Create Trip</h1>
            </header>
            <div id = "error" class = "error">
                <header>
                    <h2>Failed to add trip</h2>
                </header>
            </div>
            <div class = "card">
                <input type = "param" id = "name" placeholder = "Trip Name">
            </div>
            <div class = "card">
                <input type = "date" id = "Startdate" placeholder = "StartDate">
            </div>
            <div class = "card">
                <input type = "date" id = "Enddate" placeholder = "EndDate">
            </div>
            <button onclick = "createTrip()">
                Create Trip
            </button>
        </main>
        `;
    }
}

async function saveNotes(tripId, dayNumber){
    const notesInp = document.getElementById("note").value;
    const errorDiv = document.getElementById("error");

    try {
        const response = await fetch(`/api/Trips/${tripId}/days/${dayNumber}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ notes: notesInp })
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Note save failed");
        }
        loadTripPage(tripId);
    } catch (err) {
        console.error("Failed to save notes:", err);
        errorDiv.innerHTML = `<header><h2>Failed to save notes</h2></header>`;
    }
}

async function pullDay(tripId,dayNumber){
    let day;
    try{
        const response = await fetch(`/api/Trips/${tripId}/days/${dayNumber}`);
        if(!response.ok){
            throw new Error(`Server returned ${response.status}`);
        }
        day = await response.json();
    }
    catch(err){
        console.log("Failed to load single day: ",err);
    }
    return day;
}

async function fetchDays(id){
    let dayList = [];
    try {
        const response = await fetch(`/api/days/${id}`);
        if (!response.ok) {
            throw new Error(`Server returned ${response.status}`);
        }
        dayList = await response.json();
        console.log(dayList);
    } catch (err) {
        console.log("Failed to load Days:", err);
    }
    return dayList;
}

async function fetchTrip(id){
    let trip = "";
    try{
        const response = await fetch(`/api/Trips/${id}`);
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        trip = await response.json();
    }
    catch(err)
    {
        console.log("Failed to load Trip: ",err);
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = `<h2> Failed to load Trip </h2>`
    }
    return trip;
}

async function fetchActivities(id){
    let activ = [];
    try{
        const response = await fetch(`/api/activities/${id}`);
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        activ = await response.json();
    }
    catch(err){
        console.log("Failed to load Activities: ", err);
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = `<h2>Failed to load activities</h2>`
    }
    return activ;
}

async function fetchRestaurants(id){
    let rests = [];
    try{
        const response = await fetch(`/api/restaurants/${id}`);
        if(!response.ok)
        {
            throw new Error(`Server returned ${response.status}`);
        }
        rests = await response.json();
    }
    catch(err)
    {
        console.log("Failed to load restuarants: ", err);
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = `<h2>Failed to load activities</h2>`
    }
    return rests;
}

async function getCurrentLocation() {
    return new Promise((resolve, reject) => {
        if (!navigator.geolocation) {
            reject(new Error("Geolocation is not supported by this browser"));
            return;
        }
        navigator.geolocation.getCurrentPosition(
            (position) => resolve({
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }),
            (err) => reject(err),
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 60000
            }
        );
    });
}

async function loadFoodPage(id) {
    wraps.innerHTML = `<div id = "error" class = "error"></div>
        <header>
            <h1> Restaurants </h1>
        </header>
        <div class = "card">
            <button onclick = "createRestaurant(${id})">Add Restaurant</button>
        </div>
        <div class = "card" id = "rests"></div>
        <div class="card">
            <button onclick="loadTripPage(${id})">Back</button>
        </div>`;

    const errorDiv = document.getElementById("error");
    try {
        const rests = await fetchRestaurants(id);
        const me = await getCurrentLocation();
        const sorted = sortByCloseness(me.lat, me.lng, rests);

        document.getElementById("rests").innerHTML = sorted.map(r => `
            <div class="card">
                <h3>${r.restName}</h3>
                <p>${r.distance.toFixed(1)} mi away</p>
                <p>${r.notes ?? ""}</p>
            </div>
        `).join("");
    } catch (err) {
        if (err.code === 1) {
            errorDiv.innerHTML = "<h2>Location permission denied</h2>";
        } else {
            errorDiv.innerHTML = "<h2>Could not get your location</h2>";
        }
    }
}

async function activityRestMap(id) {
    wraps.innerHTML = `
        <div id="map"></div>
        <button class="mapBack" onclick="loadTripPage(${id})">Back</button>
        <div id="error" class="error mapError"></div>
        `;

    const map = L.map('map', { zoomControl: false }).setView([34.05, -118.25], 10);
    L.control.zoom({ position: 'bottomright' }).addTo(map);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);

    const [activities,restaurants] = await Promise.all([fetchActivities(id),fetchRestaurants(id)]);

    const markers = [];
    
    activities
    .filter(a => a.lat != null && a.lng != null)
    .forEach(a => {
        markers.push(
            L.marker([a.lat, a.lng])
                .addTo(map)
                .bindPopup(`<b>${a.activityName}</b><br>${a.notes ?? ""}</br><button onclick = "window.location.href ='${a.location}'" class = "linkBtn">Directions</button>`)
        );
    });

    restaurants
    .filter(r => r.lat != null && r.lng != null)
    .forEach(r => {
        markers.push(
            L.circleMarker([r.lat, r.lng], {color: "red"})
                .addTo(map)
                .bindPopup(`<b>${r.restName}</b><br>${r.notes ?? ""}</br><button onclick = "window.location.href ='${r.location}'" class = "linkBtn">Direction</button>`)
        );
    });

    if(markers.length){
        map.fitBounds(L.featureGroup(markers).getBounds().pad(0.2));
    }
    else{
        document.getElementById("error").innerHTML = "<h2>No locations with coordinates yet!</h2>"
    }
}

async function loadTripPage(id){
    const trip = await fetchTrip(id);
    wraps.innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1> ${trip.Title} </h1>
        </header>
        <p> ${trip.destination ?? ""} </p>
        <div class="card">
            <button onclick="home()">Home</button>
        </div>
        <div class = "card">
            <button onclick = "loadFoodPage(${id})">Food Near Me</button>
        </div>
        <div class = "card">
            <button onclick = "activityRestMap(${id})">Activity Map</button>
        </div>
        <div class = "card" id = "days"></div>
    `;
    

    const dayDiv = document.getElementById("days");
    const days = await fetchDays(id);
    const activities = await fetchActivities(id);
    currentTrip = id;
    currentActivities = activities;

    if(!days || days.length == 0)
    {
        dayDiv.innerHTML = `<p>No days for this trip yet</p>`;
    }
    else
    {
        dayDiv.innerHTML = days.map(d => {
            const dayActivities = activities.filter(a=> a.dayID === d.dayNumber);
            const activitiesHTML = dayActivities.map(a=> `
                    <div class = "activity" data-id="${a.id}">
                    <div class = "headerDiv">
                    <span class = "dragHandle">⠿</span>
                        <h3>${a.activityName}</h3>
                        <p>${a.cost}</p>
                        <p>${formatTimeString(a.startTime)} - ${formatTimeString(a.endTime)}</p>
                        <p>${a.notes}</p> 
                        <button onclick = "window.location.href ='${a.location}'" class = "linkBtn">Directions</button> 
                    </div>
                    </div>
                `).join("");

            return `
                <div class = "dayDiv" data-day = "${d.dayNumber}">
                    <div class = "dayHeaderDiv">
                        <h1>${d.dayDate}</h1>
                        <button class = "editBtn" onclick="editDay(${id},${d.dayNumber})">edit</button>
                    </div>
                    <p>${d.notes || "Add a description!"}</p>
                    <div class = "activeDiv">${activitiesHTML}</div>
                </div>
            `;
        }).join("");
    }
}

async function deleteTrip(id) {
    try {
        const response = await fetch(`/api/Trips/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            throw new Error(`Delete Failed: ${response.status}`)
        }
    }
    catch (err) {
        console.error("Failed to delete Trip:", err);
    }
    tripPage();
}

async function editDay(tripId,dayNumber){
    const day = await pullDay(tripId,dayNumber);
    wraps.innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1> ${day.dayDate} </h1>
        </header>
        <div class="card">
            <button onclick = "createActivity(${tripId},${dayNumber})">Add Activity</button>
            <button onclick = "saveNotes(${tripId},${dayNumber})">Save Changes</button>
            <button onclick="loadTripPage(${tripId})">Back</button>
        </div>
        <div class = "card">
                <input type = "param" id = "note" placeholder = "${day.notes ?? ''}">
        </div>
        <div class = "card" id = "activs"></div>
    `;
    const activities = await fetchActivities(tripId);
    const dayActivities = activities.filter(a=> a.dayID === dayNumber);
            const activitiesHTML = dayActivities.map(a=> `
                    <div class = "activity">
                    <div class = "headerDiv">
                        <h3>${a.activityName}</h3>
                        <p>${a.cost}</p>
                        <p>${a.startTime}-${a.endTime}</p>
                        <button onclick = "window.location.href ='${a.location}'" class = "linkBtn">Directions</button> 
                        <p>${a.notes}</p> 
                        <button onclick = "editActivity(${tripId},${dayNumber},${a.id})">Edit Activity</button>
                    </div>
                    </div>
                `).join("");

    document.getElementById("activs").innerHTML = `${activitiesHTML}`;
    
}

async function editActivity(tripId, dayNumber, activityId){
    const activs = await fetchActivities(tripId);
    const day = await pullDay(tripId,dayNumber);
    const a = activs.find(a=> a.id === activityId && a.dayID === dayNumber);
    console.log(a);
    wraps.innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1>${a.activityName}</h1>
        </header>
        <div class = "card">
            <input type = "param" id = "title" placeholder = "${a?.activityName}">
            <input type = "param" id = "desc" placeholder = "${a?.notes}">
            <input type = "param" id = "direction" placeholder = "${a?.location}">
            <input type = "param" id = "cost" placeholder = "${a?.cost}">
            <input type = "time" id = "startTime" placeholder = "${a?.startTime || ""}">
            <input type = "time" id = "endTime" placeholder = "${a?.endTime || ""}">
        </div>
        <div>
            <button onclick = "saveEditActivity(${tripId},${dayNumber},${activityId})">Save Changes</button>
            <button class = "delete" onclick = "deleteActivity(${tripId},${dayNumber},${activityId})">Delete</button>
        </div>
    `;
}

async function saveEditActivity(tripId, dayNumber, activityId){
    const activTitle = document.getElementById("title").value;
    const activDesc = document.getElementById("desc").value;
    const activDir = document.getElementById("direction").value;
    const activCost = document.getElementById("cost").value;
    const activST = document.getElementById("startTime").value;
    const activET = document.getElementById("endTime").value;
    const {lat, lng} = await coordsFromLink(activDir);
    if (!activTitle || !activDesc || !activDir || !activCost || !activST || !activET || !lat || !lng) {
        document.getElementById("error").innerHTML = '<h2>Please fill in all fields</h2>';
        return;
    }
    try {
        const response = await (fetch(`/api/activities/${activityId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tripId: tripId,
                dayID: dayNumber,
                activityName: activTitle,
                notes: activDesc,
                location: activDir,
                cost: activCost,
                startTime: activST,
                endTime: activET,
                lat: lat,
                lng: lng

            })
        }));
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Activity Save Failed");
        }
        loadTripPage(tripId);
    }
    catch (err) {
        console.error("Failed to save activity:", err);
        document.getElementById("error").innerHTML = '<h2>Failed to save Activity</h2>';
    }

}

async function deleteActivity(tripId, dayNumber, activityId){
    if (!confirm("Delete this activity?")) return;

    try {
        const response = await fetch(`/api/activities/${activityId}`, {
            method: "DELETE"
        });
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Activity delete failed");
        }
        editDay(tripId, dayNumber);
    } catch (err) {
        console.error("Failed to delete activity:", err);
        document.getElementById("error").innerHTML = '<h2>Failed to delete Activity</h2>';
    }
}

async function createActivity(tripId,dayNumber){
    const day = await pullDay(tripId,dayNumber);
    const activs = await fetchActivities(tripId);
    const a = activs.filter(a=> a.dayID === dayNumber);
    wraps.innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1>${day.dayDate}</h1>
        </header>
        <div class = "card">
            <input type = "param" id = "title" placeholder = "title">
            <input type = "param" id = "desc" placeholder = "desc">
            <input type = "param" id = "direction" placeholder = "dir">
            <input type = "param" id = "cost" placeholder = "cost">
            <input type = "time" id = "startTime" placeholder = "st">
            <input type = "time" id = "endTime" placeholder = "et">
        </div>
        <div>
            <button onclick = saveActivity(${tripId},${dayNumber})>Create Activity</button>
        </div>
    `;
}

async function saveActivity(tripId, dayNumber){
    const activTitle = document.getElementById("title").value;
    const activDesc = document.getElementById("desc").value;
    const activDir = document.getElementById("direction").value;
    const activCost = document.getElementById("cost").value;
    const activST = document.getElementById("startTime").value;
    const activET = document.getElementById("endTime").value;
    if (!activTitle || !activDesc || !activDir || !activCost || !activST || !activET) {
        document.getElementById("error").innerHTML = '<h2>Please fill in all fields</h2>';
        return;
    }
    try {
        const {lat,lng} = await coordsFromLink(activDir);
        const response = await (fetch("/api/activities", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tripId: tripId,
                dayID: dayNumber,
                activityName: activTitle,
                notes: activDesc,
                location: activDir,
                cost: activCost,
                startTime: activST,
                endTime: activET,
                lat: lat,
                lng: lng

            })
        }));
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Activity Creation Failed");
        }
        tripPage();
    }
    catch (err) {
        console.error("Failed to create activity:", err);
        document.getElementById("error").innerHTML = '<h2>Failed to create Activity</h2>';
    }
}

async function createRestaurant(id){
    wraps .innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1>Add Resturant</h1>
        </header>
        <div class = "card">
            <input type = "param" id = "name" placeholder = "name">
            <input type = "param" id = "desc" placeholder = "desc">
            <input type = "param" id = "direction" placeholder = "dir">
            <input type = "param" id = "webpage" placeholder = "wbpg">
        </div>
        <div>
            <button onclick = "saveRestaurant(${id})">Save Restaurant</button>
        </div>
    `;
}

async function coordsFromLink(link) {
    const r = await fetch(`/api/resolve-link?url=${encodeURIComponent(link)}`);
    const data = await r.json();
    if (!r.ok) throw new Error(data.error);
    return data;   // { lat, lng }
}

async function saveRestaurant(id){
    const name = document.getElementById("name").value;
    const desc = document.getElementById("desc").value;
    const dir = document.getElementById("direction").value;
    const wbpg = document.getElementById("webpage").value;
    //Put helper function to convert lat lng here, pass on with save Rest
    //Put helper function to get your lat long here
    //Call helper, sort by closeness here
    //const lat = ?, const lng = ?
    if (!name || !dir ) {
        document.getElementById("error").innerHTML = '<h2>Please fill in name and address</h2>';
        return;
    }
    try {
        const {lat,lng} = await coordsFromLink(dir);
        const response = await (fetch("/api/restaurants", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                tripId: id,
                restName: name,
                notes: desc,
                location: dir,
                webpage: wbpg,
                lat,
                lng
            })
        }));
        const result = await response.json();
        if (!response.ok) {
            throw new Error(result.error || "Restaurant Creation Failed");
        }
        tripPage();
    }
    catch (err) {
        console.error("Failed to create restaurant:", err);
        document.getElementById("error").innerHTML = '<h2>Failed to create Restaurant</h2>';
    }
}

function sortByCloseness(myLat, myLng, rests, unit = "mi") {
  const R = unit === "km" ? 6371.0088 : 3958.7613; // Earth radius
  const rad = (d) => (d * Math.PI) / 180;

  return rests
    .map((r) => {
      const dLat = rad(r.lat - myLat);
      const dLng = rad(r.lng - myLng);
      const a =
        Math.sin(dLat / 2) ** 2 +
        Math.cos(rad(myLat)) * Math.cos(rad(r.lat)) * Math.sin(dLng / 2) ** 2;
      return { ...r, distance: 2 * R * Math.asin(Math.sqrt(a)) };
    })
    .sort((a, b) => a.distance - b.distance); // nearest first
}

function formatTimeString(timeString) {
  let [hours, minutes] = timeString.split(':');
  hours = parseInt(hours, 10);
  const period = hours >= 12 ? 'PM' : 'AM';
  hours = hours % 12 || 12; 
  return `${hours}:${minutes} ${period}`;
}

let currentTripId = null;
let currentActivities = [];
let drag = null;

function zoneAt(x, y) {
    return document.elementsFromPoint(x, y).find(n => n.classList.contains('dayDiv')) ?? null;
}

wraps.addEventListener('pointerdown', (e) => {
    const handle = e.target.closest('.dragHandle');
    if (!handle) return;
    const el = handle.closest('.activity');
    drag = { el, startX: e.clientX, startY: e.clientY, zone: null };
    handle.setPointerCapture(e.pointerId);
    el.classList.add('dragging');
});

wraps.addEventListener('pointermove', (e) => {
    if (!drag) return;
    drag.el.style.transform = `translate(${e.clientX - drag.startX}px, ${e.clientY - drag.startY}px)`;

    const zone = zoneAt(e.clientX, e.clientY);
    if (zone !== drag.zone) {
        drag.zone?.classList.remove('over');
        zone?.classList.add('over');
        drag.zone = zone;
    }
});

wraps.addEventListener('pointerup', async () => {
    if (!drag) return;
    const { el, zone } = drag;
    drag = null;

    el.classList.remove('dragging');
    el.style.transform = '';
    zone?.classList.remove('over');
    if (!zone) return;

    const newDay = Number(zone.dataset.day);
    const oldDay = Number(el.closest('.dayDiv').dataset.day);
    if (newDay === oldDay) return;

    zone.querySelector('.activeDiv').appendChild(el);
    await moveActivity(Number(el.dataset.id), newDay);
});

wraps.addEventListener('pointercancel', () => {
    if (!drag) return;
    drag.el.classList.remove('dragging');
    drag.el.style.transform = '';
    drag.zone?.classList.remove('over');
    drag = null;
});

async function moveActivity(activityId, newDay) {
    const a = currentActivities.find(x => x.id === activityId);
    try {
        const response = await fetch(`/api/activities/${activityId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                tripId: currentTripId,
                dayID: newDay,
                activityName: a.activityName,
                notes: a.notes,
                location: a.location,
                cost: a.cost,
                startTime: a.startTime,
                endTime: a.endTime,
                lat: a.lat,
                lng: a.lng
            })
        });
        if (!response.ok) throw new Error(`Server returned ${response.status}`);
        a.dayID = newDay;
    } catch (err) {
        console.error("Failed to move activity:", err);
        loadTripPage(currentTripId); // snap everything back to the saved state
    }
}