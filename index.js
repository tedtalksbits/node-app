import express from 'express';
import cors from 'cors';
import pdf from 'html-pdf';
import request from 'request';
import path from 'path';
import { fileURLToPath } from 'url';
import { pokemon } from './data/pokemon.js';
import { createDocument } from './lib/createDocument.js';
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.get('/:pokemon', (req, res) => {
  const requestedPokemon = req.params.pokemon;
  const foundPokemon = pokemon.find(
    (pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase()
  );

  if (foundPokemon) {
    res.json(foundPokemon);
  } else {
    res.status(404).send('Pokemon not found');
  }
});

app.get('/download/:pokemon', (req, res) => {
  const requestedPokemon = req.params.pokemon;
  const foundPokemon = pokemon.find(
    (pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase()
  );

  if (foundPokemon) {
    const imgRemotePath = foundPokemon.img;

    // make a request to the remote server to get the image
    request.defaults({ encoding: null });
    request.get(imgRemotePath, (error, response, body) => {
      if (error) {
        console.log(error);
      } else {
        res.setHeader(
          'Content-Disposition',
          `attachment; filename=${foundPokemon.name.toLowerCase()}.png`
        );
        request.get(imgRemotePath).pipe(res);
      }
    });
  } else {
    res.status(404).send('Pokemon not found');
  }
});

app.get('/download-pdf/:pokemon', (req, res) => {
  const requestedPokemon = req.params.pokemon;
  const foundPokemon = pokemon.find(
    (pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase()
  );
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
            <input type="text" value="${foundPokemon.name}" />
            <input type="checkbox" checked />
            `;
    pdf
      .create(html, pdfOptions)
      .toFile(`./pdf/${foundPokemon.name.toLowerCase()}.pdf`, (err, result) => {
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
  // download created-modified pdf file from the server
  const file = await createDocument(pokemon[0]);

  console.log(file);
  res.download(file.path);
});

app.get('/pokemon/list', (req, res) => {
  // return a list of pokemon as .csv file with header row
  const headerRow = Object.keys(pokemon[0]).join(',').toUpperCase();
  const csv = pokemon
    .map((pokemon) => Object.values(pokemon).join(','))
    .join('\n');

  const csvWithHeaderRow = `${headerRow}\n${csv}`;

  res.setHeader('Content-Type', 'text/csv');
  res.setHeader('Content-Disposition', 'attachment; filename=pokemon.csv');
  res.send(csvWithHeaderRow);
});

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});

//C:\\Users\\TBlake\\Documents\\dev\\node\\node-app\\pdf\\pikachu.pdf
