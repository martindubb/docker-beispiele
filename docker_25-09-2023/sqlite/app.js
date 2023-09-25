// import benoetigte module
const express = require('express');
const app = express();
const db = require('better-sqlite3')('db/restaurants.sqlite');

// http-server verbindungs parameter
const port = 3000;

// db table creation string
db.prepare('CREATE TABLE IF NOT EXISTS restaurants (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT NOT NULL)').run();

// middleware aktivieren
app.use(express.json());

/* API ENDPUNKTE */

// alle restaurants abfragen
app.get('/restaurants', (_, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET all restaurants");
    
    // db abfrage alle restaurants
    let result = db.prepare('SELECT * FROM restaurants').all();
    res.send(result);
});

// bestimmtes restaurant abfragen
app.get('/restaurant/:name', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " GET " + req.params.name);

    // db abfrage einzelnes restaurant
    let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(req.params.name);

    // gib ergebnis der suche zurück
    if (result === undefined) {
        res.status(404);
        res.send({"message": "Restaurant nicht gefunden!"});
    } else {
        res.send(result);
    }
});

// neues restaurant hinzufügen
app.post('/restaurant', (req, res) => {
    // log request received
    let date_ob = new Date();
    console.log(date_ob.toISOString() + " POST " + req.body.name);

    let r = req.body;
    // prüfe, ob alle erforderlichen daten vorhanden sind
    if (!r.name) {
        res.status(400);
        res.send({"message": "bitte name angeben!"});
    } else {
        // prüfe, ob element bereits in datenbank
        let result = db.prepare('SELECT * FROM restaurants WHERE name = ?').get(r.name);
        if (result === undefined) {
            // nicht vorhanden, füge restaurant hinzu
            db.prepare('INSERT INTO restaurants (name) VALUES(?)').run(r.name);
            res.status(201);
            res.send({"message": "Restaurant hinzugefügt: " + r.name});
        } else {
            // restaurant bereits vorhanden
            res.status(409);
            res.send({"message": "Restaurant bereits vorhanden: " + r.name});
        }
    }
});

// server starten
app.listen(port, '', () => {
    console.log(`Server gestartet ${port}.`);
});

// verbindung zur datenbank trennen
process.on('SIGINT', () => {
    db.close();
    console.log("verbindung zur datenbank getrennt.");
    process.exit();
});
