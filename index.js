import express from "express";
import bodyParser from "body-parser";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));

app.get("/distance", (req, res) => {
    const slat = parseFloat(req.query.slat);
    const slon = parseFloat(req.query.slon);
    const elat = parseFloat(req.query.elat);
    const elon = parseFloat(req.query.elon);
    var round = true;
    if (req.query.round) {
        round = (req.query.round === 'true');
    }

    const distance = calculateDistance(slat, slon, elat, elon, round);

    const result = {
        start: { lat: slat, lon: slon },
        end: { lat: elat, lon: elon },
        distance: distance,
        round: round,
    };

    res.json(result);
});

function calculateDistance(lat1, lon1, lat2, lon2, round) {
    const R = 6371e3; // metres -> 6371000m
    const φ1 = lat1 * Math.PI/180; // convert φ, λ in radians (as they are in degrees)
    const φ2 = lat2 * Math.PI/180;
    const λ1 = lon1 * Math.PI/180;
    const λ2 = lon2 * Math.PI/180;

    const Δφ = (φ2-φ1);
    const Δλ = (λ2-λ1);

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    var d = R * c; // in metres
    d = d * 0.001; // in km
    if (round) {
        d = Math.round(d) // in km
    }
    return d;
}

app.listen(port, () => {
    console.log(`Started server on port ${port}`);
});