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
        tripDiv.innerHTML = tripList.map(t => `<p>${t.Title}</p>`).join("");
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
        //Make Error Div filled
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
                <input type = "param" id = "Startdate" placeholder = "StartDate">
            </div>
            <div class = "card">
                <input type = "param" id = "Enddate" placeholder = "EndDate">
            </div>
            <button onclick = "createTrip()">
                Create Trip
            </button>
        </main>
        `;
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
}

async function loadEditTrip() {
    //Load new edit UI
}


