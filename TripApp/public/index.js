/*
    SQL EXAMPLES
    -----------------------------------------------------
    -- Step 1: Add the base Trip (Generates ID: 1)
        INSERT INTO trips (title, destination, start_date, end_date) 
        VALUES ('Tokyo Adventure', 'Tokyo, Japan', '2027-07-15', '2027-07-16');

    -- Step 2: Add Day 1 to that Trip (Generates ID: 1)
        INSERT INTO trip_days (trip_id, day_number, day_date, notes) 
        VALUES (1, 1, '2027-07-15', 'Arrival and exploration day.');

    -- Step 3: Add sequential activities tied to Day 1 (day_id = 1)
        INSERT INTO activities (day_id, activity_name, location, start_time, end_time, cost, confirmation_number) VALUES 
            (1, 'Check-in Hotel Gracery', 'Shinjuku', '15:00:00', '15:30:00', 0.00, 'BK-993821'),
            (1, 'Sushi Dinner', 'Sukiyabashi Jiro', '18:30:00', '20:30:00', 30000.00, 'RES-JIRO55'),
            (1, 'Observation Deck View', 'Tokyo Metropolitan Gov Building', '21:00:00', '22:00:00', 0.00, NULL);

    -- Step 4: Extract the ultimate complete chronological itinerary
        SELECT 
            t.title AS trip_name,
            d.day_number,
            d.day_date,
            a.start_time,
            a.activity_name,
            a.location,
            a.cost
        FROM trips t
        JOIN trip_days d ON t.id = d.trip_id
        JOIN activities a ON d.id = a.day_id
        WHERE t.id = 1
        ORDER BY d.day_number ASC, a.start_time ASC;
*/
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
    <main>
            <div class = "card">
                <button onclick = "tripPage()">
                    View Trip
                </button>
            </div>
            <div class = "card">
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
        console.log(day);
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
        console.log("Failed to load Activities: ".err);
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
        console.log("Failed to load restuarants: ".err);
        const errorDiv = document.getElementById("error");
        errorDiv.innerHTML = `<h2>Failed to load activities</h2>`
    }
    return rests;
}

async function loadFoodPage(id){

}

async function loadTripPage(id){
    const trip = await fetchTrip(id);
    wraps.innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1> ${trip.Title} </h1>
        </header>
        <p> ${trip.destination ?? ""} </p>
        <button onclick = "loadFoodPage(${id})">Food Near Me</button>
        <div class = "card" id = "days"></div>
        <div class="card">
            <button onclick="home()">Home</button>
        </div>
    `;
    

    const dayDiv = document.getElementById("days");
    const days = await fetchDays(id);
    const activities = await fetchActivities(id);
    console.log(activities[0]);
    console.log(days[0]);

    if(!days || days.length == 0)
    {
        dayDiv.innerHTML = `<p>No days for this trip yet</p>`;
    }
    else
    {
        dayDiv.innerHTML = days.map(d => {
            const dayActivities = activities.filter(a=> a.dayID === d.dayNumber);
            const activitiesHTML = dayActivities.map(a=> `
                    <div class = "activity">
                    <div class = "headerDiv">
                        <h3>${a.activityName}</h3>
                        <p>${a.cost}</p>
                        <p>${a.startTime}-${a.endTime}</p>
                        <button onclick = "window.location.href ='${a.location}'" class = "linkBtn">Dir</button>  
                    </div>
                        <p>${a.notes}</p>
                    </div>
                `).join("");

            return `
                <div class = "card">
                    <div class = "headerDiv">
                        <h1>${d.dayDate}</h1>
                        <button class = "editBtn" onclick="editDay(${id},${d.dayNumber})">edit</button>
                    </div>
                    <p>${d.notes}</p>
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
        loadTrips();
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
        <div class = "card">
                <input type = "text" id = "note" value = "${day.notes ?? ''}">
        </div>
        <div class = "card" id = "activs"></div>
        <div class="card">
            <button onclick = "createActivity(${tripId},${dayNumber})">Add Activity</button>
            <button onclick = "saveNotes(${tripId},${dayNumber})">Save Changes</button>
            <button onclick="home()">Home</button>
        </div>
    `;

}

async function createActivity(tripId,dayNumber){
    const day = await pullDay(tripId,dayNumber);
    wraps.innerHTML = `
        <div id = "error" class = "error"></div>
        <header>
            <h1>${day.dayDate}</h1>
        </header>
        <div class = "card">
            <input type = "text" id = "title" value = "">
            <input type = "text" id = "desc" value = "">
            <input type = "text" id = "direction" value = "">
            <input type = "text" id = "cost" value = "">
            <input type = "time" id = "startTime" value = "">
            <input type = "time" id = "endTime" value = "">
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
                endTime: activET

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


