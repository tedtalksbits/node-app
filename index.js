import express from 'express';
import cors from 'cors';
import pdf from 'html-pdf';
import request from 'request';
import { pokemon } from './data/pokemon.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/:pokemon', (req, res) => {
    const requestedPokemon = req.params.pokemon;
    const foundPokemon = pokemon.find((pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase());

    if (foundPokemon) {
        res.json(foundPokemon);
    } else {
        res.status(404).send('Pokemon not found');
    }
});

app.get('/download/:pokemon', (req, res) => {
    const requestedPokemon = req.params.pokemon;
    const foundPokemon = pokemon.find((pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase());

    if (foundPokemon) {
        const imgRemotePath = foundPokemon.img;

        // make a request to the remote server to get the image
        request.defaults({ encoding: null });
        request.get(imgRemotePath, (error, response, body) => {
            if (error) {
                console.log(error);
            } else {
                res.setHeader('Content-Disposition', `attachment; filename=${foundPokemon.name.toLowerCase()}.png`);
                request.get(imgRemotePath).pipe(res);
            }
        });
    } else {
        res.status(404).send('Pokemon not found');
    }
});

app.get('/download-pdf/:pokemon', (req, res) => {
    const requestedPokemon = req.params.pokemon;
    const foundPokemon = pokemon.find((pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase());

    //    build a pdf file

    if (foundPokemon) {
        const html = `<h1>${foundPokemon.name}</h1><p>${foundPokemon.type}</p>`;
        pdf.create(html).toFile(`./pdf/${foundPokemon.name.toLowerCase()}.pdf`, (err, result) => {
            if (err) return console.log(err);
            console.log(result);
            if (result) {
                res.download(result.filename);
            }
        });
    } else {
        res.status(404).send('Pokemon not found');
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
