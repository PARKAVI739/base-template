import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const MORSE_CODE_DICT = {
  'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.', 'G': '--.', 'H': '....',
  'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..', 'M': '--', 'N': '-.', 'O': '---', 'P': '.--.',
  'Q': '--.-', 'R': '.-.', 'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
  'Y': '-.--', 'Z': '--..', '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
  '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----', '.': '.-.-.-', ',': '--..--',
  '?': '..--..', "'": '.----.', '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-', '&': '.-...',
  ':': '---...', ';': '-.-.-.', '=': '-...-', '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
  '$': '...-..-', '@': '.--.-.'
};

function textToMorse(text) {
  return text.toUpperCase().split('').map(char => MORSE_CODE_DICT[char] || '').join(' ');
}

function morseToText(morse) {
  const morseDictReverse = Object.entries(MORSE_CODE_DICT).reduce((acc, [k, v]) => ({...acc, [v]: k}), {});
  return morse.split(' ').map(code => morseDictReverse[code] || '?').join('');
}

export default function App() {
  const [mode, setMode] = useState('textToMorse');
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [error, setError] = useState(null);
  const audioContext = useRef(null);
  const oscillator = useRef(null);
  const [playProgress, setPlayProgress] = useState(0);
  
  useEffect(() => {
    if (!audioContext.current) {
      audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return () => {
      if (oscillator.current) {
        oscillator.current.stop();
      }
    };
  }, []);

  const playMorseCode = (morseCode) => {
    const dotDuration = 100; // ms
    const dashDuration = dotDuration * 3;
    const spaceBetweenElements = dotDuration;
    const spaceBetweenLetters = dotDuration * 3;
    const spaceBetweenWords = dotDuration * 7;

    let time = 0;
    const totalDuration = morseCode.split('').reduce((acc, char) => {
      if (char === '.') return acc + dotDuration + spaceBetweenElements;
      if (char === '-') return acc + dashDuration + spaceBetweenElements;
      if (char === ' ') return acc + spaceBetweenWords - spaceBetweenElements;
      return acc + spaceBetweenLetters - spaceBetweenElements;
    }, 0) - spaceBetweenElements;

    morseCode.split('').forEach(char => {
      setTimeout(() => {
        if (char === '.') {
          oscillator.current = audioContext.current.createOscillator();
          oscillator.current.connect(audioContext.current.destination);
          oscillator.current.frequency.setValueAtTime(800, audioContext.current.currentTime);
          oscillator.current.start();
          oscillator.current.stop(audioContext.current.currentTime + dotDuration / 1000);
        } else if (char === '-') {
          oscillator.current = audioContext.current.createOscillator();
          oscillator.current.connect(audioContext.current.destination);
          oscillator.current.frequency.setValueAtTime(800, audioContext.current.currentTime);
          oscillator.current.start();
          oscillator.current.stop(audioContext.current.currentTime + dashDuration / 1000);
        }
        setPlayProgress((time / totalDuration) * 100);
      }, time);
      time += (char === '.' ? dotDuration : char === '-' ? dashDuration : char === ' ' ? spaceBetweenWords : spaceBetweenLetters);
    });

    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), time);
  };

  const handleConvert = () => {
    setError(null);
    if (mode === 'textToMorse') {
      setOutput(textToMorse(input));
    } else {
      try {
        setOutput(morseToText(input));
      } catch (e) {
        setError("Invalid Morse code input.");
      }
    }
  };

  const canConvert = input.trim() !== '';

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#670926] text-white p-4 sm:p-8">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>Morse Code Translator</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select onValueChange={setMode}>
            <SelectTrigger>
              <SelectValue placeholder="Select Mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="textToMorse">Text to Morse</SelectItem>
              <SelectItem value="morseToText">Morse to Text</SelectItem>
            </SelectContent>
          </Select>
          <Input 
            placeholder={mode === 'textToMorse' ? "Enter text here..." : "Enter Morse code here..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <Button disabled={!canConvert} onClick={handleConvert}>Convert</Button>
          {error && <p className="text-red-500">{error}</p>}
          {output && <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">{mode === 'textToMorse' ? "Morse Code:" : "Text:"}</h3>
            <div className="bg-gray-800 p-3 rounded">
              {mode === 'textToMorse' ? 
                output.split('').map((char, idx) => (
                  <span key={idx} className={char === '.' ? 'bg-blue-500' : char === '-' ? 'bg-red-500' : 'bg-transparent'} style={{width: char === '.' ? '0.5em' : char === '-' ? '1.5em' : '0.25em', display: 'inline-block', marginRight: '0.1em', height: '2em'}}></span>
                )) : 
                <p>{output}</p>
              }
            </div>
            <div className="mt-4">
              <Button onClick={() => playMorseCode(output)} disabled={isPlaying}>Play Morse Code</Button>
              <Button onClick={() => setIsPlaying(false)} disabled={!isPlaying}>Stop</Button>
            </div>
            <div className="h-2 bg-gray-700 rounded mt-2">
              <div style={{width: `${playProgress}%`}} className="h-full bg-green-500"></div>
            </div>
          </div>}
        </CardContent>
      </Card>
    </div>
  );
}
