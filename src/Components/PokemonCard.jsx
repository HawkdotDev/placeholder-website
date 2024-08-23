import { useState, useEffect } from "react";

const fetchPokemonData = async (id) => {
  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const data = await response.json();
    return {
      name: data.name,
      sprite: data.sprites.front_default,
      types: data.types.map((typeInfo) => typeInfo.type.name),
      serialNumber: data.id,
    };
  } catch (error) {
    console.log(error);
  }
};

const cropTransparentPixels = async (imageUrl) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = imageUrl;
    img.crossOrigin = "anonymous";

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const { data } = imageData;

      let top = null,
        left = null,
        right = null,
        bottom = null;

      for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
          const index = (y * canvas.width + x) * 4;
          const alpha = data[index + 3];

          if (alpha > 0) {
            if (top === null) top = y;
            if (left === null || x < left) left = x;
            if (right === null || x > right) right = x;
            bottom = y;
          }
        }
      }

      const width = right - left + 1;
      const height = bottom - top + 1;

      const croppedCanvas = document.createElement("canvas");
      const croppedCtx = croppedCanvas.getContext("2d");
      croppedCanvas.width = width;
      croppedCanvas.height = height;

      croppedCtx.drawImage(
        canvas,
        left,
        top,
        width,
        height,
        0,
        0,
        width,
        height
      );

      resolve(croppedCanvas.toDataURL());
    };
  });
};

const typeColors = {
  normal: { bg: "#A8A77A", border: "#6D6D4E" },
  fire: { bg: "#EE8130", border: "#AB5500" },
  water: { bg: "#6390F0", border: "#0A75BC" },
  grass: { bg: "#7AC74C", border: "#3C824E" },
  electric: { bg: "#F7D02C", border: "#AA9900" },
  ice: { bg: "#96D9D6", border: "#50A8A7" },
  fighting: { bg: "#C22E28", border: "#831717" },
  poison: { bg: "#A33EA1", border: "#6C1A68" },
  ground: { bg: "#E2BF65", border: "#B3851A" },
  flying: { bg: "#A98FF3", border: "#7364AA" },
  psychic: { bg: "#F95587", border: "#AA3363" },
  bug: { bg: "#A6B91A", border: "#727C11" },
  rock: { bg: "#B6A136", border: "#817524" },
  ghost: { bg: "#735797", border: "#493763" },
  dragon: { bg: "#6F35FC", border: "#4321A3" },
  dark: { bg: "#705746", border: "#4E3C32" },
  steel: { bg: "#B7B7CE", border: "#85859B" },
  fairy: { bg: "#D685AD", border: "#A64D7D" },
};

const getTypeStyles = (types) => {
  if (types.length === 1) {
    const color = typeColors[types[0]];
    return { backgroundColor: color.bg, borderColor: color.border };
  } else {
    const color1 = typeColors[types[0]];
    const color2 = typeColors[types[1]];

    const gradientBg = `linear-gradient(135deg, ${color1.bg} 50%, ${color2.bg} 50%)`;
    const gradientBorder = `linear-gradient(135deg, ${color1.border} 50%, ${color2.border} 50%)`;

    return {
      backgroundImage: gradientBg,
      borderImage: `${gradientBorder} 1`,
      borderStyle: "solid",
      borderWidth: "4px",
    };
  }
};

const PokemonCard = () => {
  const [pokemon, setPokemon] = useState(null);

  const loadRandomPokemon = async () => {
    const id = Math.floor(Math.random() * 1025) + 1;
    const pokemonData = await fetchPokemonData(id);
    // console.log(pokemonData);

    const croppedSprite = await cropTransparentPixels(pokemonData.sprite);
    setPokemon({ ...pokemonData, sprite: croppedSprite });
  };

  useEffect(() => {
    loadRandomPokemon();
  }, []);

  if (!pokemon) {
    return <p>Loading...</p>;
  }

  const styles = getTypeStyles(pokemon.types);

  return (
    <div className="flex flex-col items-center justify-start mt-6 min-h-screen ">
      <div
        className={`rounded-lg p-4 max-w-xs relative shadow-lg ${
          pokemon.types.length === 1 ? "border-4" : "rounded-xl"
        }`}
        style={styles}
      >
        <div className="bg-white border-2 border-gray-300 rounded-lg overflow-hidden p-2 w-64 h-72">
          <div className="flex justify-between items-center">
            <h1 className="text-lg font-bold capitalize text-black">
              {pokemon.name}
            </h1>
            <div className="flex">
              {pokemon.types.map((type) => (
                <span
                  key={type}
                  className="text-xs rounded-full px-2 py-1 m-1 capitalize"
                  style={{ backgroundColor: typeColors[type].bg }}
                >
                  {type}
                </span>
              ))}
            </div>
          </div>
          <div className="bg-gray-200 border-2 w-full h-32 border-gray-300 rounded-lg p-2 mt-2 flex items-center justify-center">
            <img
              src={pokemon.sprite}
              alt={pokemon.name}
              className="object-contain h-full w-full bg-transparent"
            />
          </div>
        </div>
        <div className="absolute -top-2 -right-2 p-1 border border-black bg-red-500 text-white text-sm font-bold rounded-full w-10 h-10 flex items-center justify-center">
          {pokemon.serialNumber}
        </div>
      </div>
      <button
        onClick={loadRandomPokemon}
        className="mt-8 bg-red-500 text-white border border-white px-4 py-2 rounded hover:border-red-500 hover:bg-white hover:text-black"
      >
        Get a different Pokémon
      </button>
    </div>
  );
};

export default PokemonCard;
