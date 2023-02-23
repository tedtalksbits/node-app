import express from 'express';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.get('/:pokemon', (req, res) => {
    const pokemons = [
        { name: 'Pikachu', type: 'electric' },
        { name: 'Bulbasaur', type: 'grass' },
        { name: 'Charmander', type: 'fire' },
        { name: 'Squirtle', type: 'water' },
    ];

    const requestedPokemon = req.params.pokemon;
    const pokemon = pokemons.find((pokemon) => pokemon.name.toLowerCase() === requestedPokemon.toLowerCase());

    if (pokemon) {
        res.json(pokemon);
    } else {
        res.status(404).send('Pokemon not found');
    }
});

app.listen(8080, () => {
    console.log('Server is running on port 8080');
});
