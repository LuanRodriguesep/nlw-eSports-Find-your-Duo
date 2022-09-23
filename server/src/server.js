import express from "express";
const app = express();
const PORT = 3333;
app.get('/ads', (req, res) => {
    return res.json([
        { id: 1, name: 'Anuncio1' },
        { id: 2, name: 'Anuncio 2' },
        { id: 3, name: 'Anuncio 3' },
    ]);
});
app.listen(`${PORT}`, () => {
    console.log(`Ouvindo na porta ${PORT}`);
});
