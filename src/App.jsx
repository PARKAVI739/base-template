// App.jsx
import React, { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import Dropdown from "./components/Dropdown";
import TextToMorse from "./components/TextToMorse";
import MorseToText from "./components/MorseToText";

const App = () => {
  const [mode, setMode] = useState('textToMorse');

  return (
    <div className="bg-[#670926] min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardContent>
          <Dropdown onChange={setMode} />
          {mode === 'textToMorse' ? <TextToMorse /> : <MorseToText />}
        </CardContent>
      </Card>
    </div>
  );
};

export default App;

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

// components/MorseToText.jsx would follow a similar structure

// components/Dropdown.jsx
import { Select, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select";

const Dropdown = ({ onChange }) => (
  <Select onValueChange={onChange}>
    <SelectTrigger className="w-full mb-4">
      <SelectValue placeholder="Select Conversion" />
    </SelectTrigger>
    <SelectContent>
      <Select.Option value="textToMorse">Text to Morse</Select.Option>
      <Select.Option value="morseToText">Morse to Text</Select.Option>
    </SelectContent>
  </Select>
);

// components/MorseVisualizer.jsx
// This component would handle visualization and audio playback with state for play/stop

// Note: This code snippet is a simplified structure. Expand with full functionality,
// including the Morse alphabet, audio handling, and detailed error management.
