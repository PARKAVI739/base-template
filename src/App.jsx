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