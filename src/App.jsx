import { useState, useEffect } from 'react';
import './App.css';

const POKEMON_IDS = [1, 4, 7, 25, 152, 155, 158, 175, 252, 255, 258, 151];

function randomize(a, b) {
  if(Math.random() > Math.random()) {
    return 1;
  } else {
    return -1;
  }
}

async function getPokemon(id) {
  const url = 'https://pokeapi.co/api/v2/pokemon/' + id + '/';
  const response = await fetch(url);
  const responseJson = await response.json();
  const img = responseJson.sprites.other['official-artwork'].front_default;
  return {id: responseJson.id, name: responseJson.name , clicked: false, img};
}

function App() {
  const [pokemon, setPokemon] = useState([]);

  useEffect(() => {
    const getAllPokemon = async () => {
      const monsters = [];
      for(let num of POKEMON_IDS) {
        const monster = await getPokemon(num);
        monsters.push(monster);
      }
      setPokemon(monsters);
    }
    getAllPokemon();
  }, []);

  const handleClick = (pokemonObj) => {
    console.log('clicked! ' + pokemonObj.name);
    if (pokemonObj.clicked) {
      console.log('you lose');
    } else {
      pokemonObj.clicked = true;
    }
    setPokemon((prev) => {
      const newOrder = prev.slice();
      newOrder.sort(randomize);
      return newOrder;
    });
  };

  return (
    <>
      <h1>Pokemon Memory Game</h1>
      <p>Get points by clicking on an image but don't click the same image more than once!</p>
      <div id="table">
        {
          pokemon.map((p) => (
            <div key={p.id} className="card" onClick={() => handleClick(p)}>
              <img src={p.img} alt={p.name} />
              <p>{p.name}</p>
            </div>
          ))
        }
      </div>
    </>
  )
}

export default App;
