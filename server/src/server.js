import express from "express";

const app = express();



const PORT = 3333;


app.get('/ads', (req, res) => {
    return res.json([]);
});


app.listen(`${PORT}`, () => {
    console.log(`Ouvindo na porta ${PORT}`);
});
