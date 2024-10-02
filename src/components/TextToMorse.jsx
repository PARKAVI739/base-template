
// components/TextToMorse.jsx

import React, { useState, useEffect } from 'react';

import MorseVisualizer from './MorseVisualizer';


const TextToMorse = () => {

  const [text, setText] = useState('');

  const [morse, setMorse] = useState('');

  const [error, setError] = useState('');


  const convertToMorse = () => {

    // Simple conversion logic (expand as needed)

    const morseCode = text.split('').map(char => {

      // This should be expanded with a full Morse alphabet

      return char.toUpperCase() in morseAlphabet ? morseAlphabet[char.toUpperCase()] + ' ' : '';

    }).join('').trim();

    setMorse(morseCode);

    setError(morseCode ? '' : 'No valid characters to convert.');

  };


  return (

    <div>

      <textarea 

        onChange={(e) => setText(e.target.value)} 

        placeholder="Enter text to convert to Morse code"

        className="w-full p-2 border rounded mb-2"

      />

      <button 

        onClick={convertToMorse}

        disabled={!text}

        className="mb-2 w-full bg-blue-500 text-white p-2 rounded disabled:bg-gray-300"

      >

        Convert

      </button>

      {morse && <MorseVisualizer morseCode={morse} />}

      {error && <p className="text-red-500">{error}</p>}

    </div>

  );

};
