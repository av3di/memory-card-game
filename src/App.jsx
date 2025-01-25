import { useState, useEffect, useMemo } from 'react';
import './App.css';
import Header from './components/Header';
import Modal from './components/Modal';

const POKEMON_IDS = [1, 4, 7, 25, 152, 155, 158, 175, 252, 255, 258, 151];

function randomize(a, b) {
  if(Math.random() > 0.5) {
    return 1;
  } else {
    return -1;
  }
}

async function getPokemon(id) {
  const url = 'https://pokeapi.co/api/v2/pokemon/' + id + '/';
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch Pokémon with id ${id}: ${response.statusText}`);
    }
    const responseJson = await response.json();
    const img = responseJson.sprites.other['official-artwork'].front_default;
    return {id: responseJson.id, name: responseJson.name , clicked: false, img};
  } catch (e) {
    console.error(`Error fetching pokemon #${id}: `, e);
    throw e;
  }
}

function App() {
  const [pokemon, setPokemon] = useState([]);
  const [isPlaying, setIsPlaying] = useState(true);
  const [won, setWon] = useState(false);
  const [error, setError] = useState(false);

  useEffect(() => {
    const getAllPokemon = async () => {
      const monsters = [];
      try {
        for(let num of POKEMON_IDS) {
          const monster = await getPokemon(num);
          monsters.push(monster);
        }
        setPokemon(monsters);
      } catch (e) {
        setError(true);
        console.error("There was an issue: ", e);
      }
    }
    getAllPokemon();
  }, []);

  const handleClick = (pokemonObj) => {
    if (pokemonObj.clicked) {
      setIsPlaying(false);
      setWon(false);
    } else {
      setPokemon((prev) => {
        const updatedPokemon = prev.map((p) => p.id === pokemonObj.id ? {...p, clicked: true } : p );
        if(updatedPokemon.every((p) => p.clicked === true)) {
          setIsPlaying(false);
          setWon(true);
        } else {
          updatedPokemon.sort(randomize);
        }
        return updatedPokemon;
      });
    }
  };

  const handleRestart = () => {
    setPokemon((prev) => {
      const reset = prev.map((p) => ({...p, clicked: false}));
      reset.sort(randomize);
      return reset;
    });
    setIsPlaying(true);
    setWon(false);
  };

  return (
    <>
      <Header />
      {error && <p>Sorry, something went wrong. Please try again later</p>}
      {!error && <div id="table">
        {
          pokemon.map((p) => (
            <div key={p.id} className="card" onClick={() => handleClick(p)}>
              <img src={p.img} alt={p.name} />
              <p>{p.name}</p>
            </div>
          ))
        }
      </div>}
      <Modal handleRestart={handleRestart} won={won} isPlaying={isPlaying} />
    </>
  )
}

export default App;
