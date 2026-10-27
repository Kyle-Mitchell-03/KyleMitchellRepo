const express = require('express');
const path = require('path');
const mysql = require('mysql2/promise');

//require('dotenv').config();
const pool = mysql.createPool({
    host:'localhost', //process.env.DB_HOST,
    user: 'root',//process.env.DB_USER,
    password: '',//process.env.DB_PASSWORD,
    database: 'Travel' //process.env.DB_NAME
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
app.get('/api/days',makeListHandler('days'));
app.get('/api/activities',makeListHandler('activities'));

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

    const [rows] = await pool.query('SELECT * FROM days WHERE tripID = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Days not found' });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/Trips', async (req,res,next) => {
    try{
        const{Title, startDate, endDate} = req.body;

        console.log('Received body:', req.body);
        console.log('Title',Title);
        console.log('startDate', startDate);
        console.log('endDate',endDate);

        const [result] = await pool.query(
            'INSERT INTO Trips (Title, startDate, endDate) VALUES (?,?,?)', 
            [Title,startDate,endDate]
        );
        res.status(201).json({id:result.insertId});
    }
    catch(err)
    {
        next(err);
    }
});

app.delete('/api/Trips/:id', async (req,res, next) => {
    try{
        const {id} = req.params;
        const [result] = await pool.query('DELETE FROM Trips WHERE id = ?', [id]);

        if(result.affectedRows === 0) {
            return res.status(404).json({error: 'Trip not found'});
        }

        res.json({message: 'Trip deleted', id});
    }
    catch(err)
    {
        next(err);
    }
})

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
