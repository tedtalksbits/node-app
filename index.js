import express from 'express';
import cors from 'cors';
import pdf from 'html-pdf';
import request from 'request';
import path from 'path';
import { fileURLToPath } from 'url';
import { pokemon } from './data/pokemon.js';
import { createDocument } from './lib/createDocument.js';
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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
    const pdfOptions = {
        format: 'A4',
        orientation: 'portrait',
    };

    //    build a pdf file

    if (foundPokemon) {
        const html = `
            <h1>${foundPokemon.name} </h1> <span>${foundPokemon.id}</span>
            <p>${foundPokemon.type}</p>
            <img src="${foundPokemon.img}" />
            `;
        pdf.create(html, pdfOptions).toFile(`./pdf/${foundPokemon.name.toLowerCase()}.pdf`, (err, result) => {
            if (err) return console.log(err);
            console.log(result);
            if (result) {
                console.log(result.filename);
                res.download(result.filename);
            }
        });
    } else {
        res.status(404).send('Pokemon not found');
    }
});

app.get('/test/test-pdf', async (req, res) => {
    const { path: pdfPath } = await createDocument(pokemon[0]);
    const fullPath = path.join(__dirname, pdfPath);
    console.log(fullPath);
    res.download(fullPath);
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});

//C:\\Users\\TBlake\\Documents\\dev\\node\\node-app\\pdf\\pikachu.pdf
