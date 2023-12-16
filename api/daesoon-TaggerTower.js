import express from 'express';
const app = express();



app.get('/:gameIDplaceIDcreatorID/:ScriptName', Route_DaeSoon_TaggerTower);
app.get('/', (req, res) => {
    return res.json("daesoon-TaggerTower")
});