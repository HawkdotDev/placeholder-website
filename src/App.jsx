// import { useState } from 'react'
import PokemonCard from "./Components/PokemonCard";

function App() {
  return (
    <>
      <div className="w-screen h-screen flex flex-col p-3 items-center">
        <h1 className="text-center font-bold">
          Website is coming soon!
        </h1>
        <h2 className="mt-2">
          meanwhile here is a pokemon card for you
        </h2>
        <PokemonCard />
      </div>
    </>
  );
}

export default App;
