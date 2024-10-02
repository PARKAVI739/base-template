import React, { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const morseCodeMap = {
  A: ".-",
  B: "-...",
  C: "-.-.",
  D: "-..",
  E: ".",
  F: "..-.",
  G: "--.",
  H: "....",
  I: "..",
  J: ".---",
  K: "-.-",
  L: ".-..",
  M: "--",
  N: "-.",
  O: "---",
  P: ".--.",
  Q: "--.-",
  R: ".-.",
  S: "...",
  T: "-",
  U: "..-",
  V: "...-",
  W: ".--",
  X: "-..-",
  Y: "-.--",
  Z: "--..",
  "1": ".----",
  "2": "..---",
  "3": "...--",
  "4": "....-",
  "5": ".....",
  "6": "-....",
  "7": "--...",
  "8": "---..",
  "9": "----.",
  "0": "-----",
  ".": ".-.-.-",
  ",": "--..--",
  "?": "..--..",
  "'": ".----.",
  "!": "-.-.--",
  "/": "-..-.",
  "(": "-.--.",
  ")": "-.--.-",
  "&": ".-...",
  ":": "---...",
  ";": "-.-.-.",
  "=": "-...-",
  "+": ".-.-.",
  "-": "-....-",
  _: "..--.-",
  '"': ".-..-.",
  $: "...-..-",
  "@": ".--.-.",
  " ": "/",
};

const reverseMorseCodeMap = Object.fromEntries(
  Object.entries(morseCodeMap).map(([k, v]) => [v, k])
);

export default function App() {
  const [conversionType, setConversionType] = useState("textToMorse");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [error, setError] = useState("");
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [progress, setProgress] = useState(0);
  const [isConverted, setIsConverted] = useState(false);
  const audioContext = useRef(null);
  const oscillator = useRef(null);

  useEffect(() => {
    audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  useEffect(() => {
    if (isPlaying === false) {
      setProgress(0);
      if (oscillator.current) {
        oscillator.current.stop();
      }
      setCurrentIndex(-1);
    }
  }, [isPlaying, progress]);

  // Reset states when conversionType changes
  useEffect(() => {
    setInput("");
    setOutput("");
    setError("");
    setIsConverted(false);
  }, [conversionType]);

  const handleConvert = () => {
    setError("");
    if (conversionType === "textToMorse") {
      const morse = input
        .toUpperCase()
        .split("")
        .map((char) => morseCodeMap[char] || "")
        .join(" ");
      setOutput(morse);
    } else {
      const text = input
        .split(" ")
        .map((code) => reverseMorseCodeMap[code] || "")
        .join("");
      if (text.trim() === "") {
        setError("Invalid Morse code input");
      } else {
        setOutput(text);
      }
    }
    setIsConverted(true);
  };

  const playMorseCode = () => {
    if (!audioContext.current || isPlaying) return;

    setIsPlaying(true);
    setCurrentIndex(-1);
    setProgress(0);

    const morse = conversionType === "textToMorse" ? output : input;
    const dotDuration = 60; // Duration for dot
    const dashDuration = dotDuration * 3; // Duration for dash
    const pauseDuration = dotDuration; // Pause duration after dot/dash
    const letterPauseDuration = dotDuration * 3; // Pause duration between letters
    const wordPauseDuration = dotDuration * 7; // Pause duration between words

    oscillator.current = audioContext.current.createOscillator();
    oscillator.current.type = "sine"; // Set oscillator type
    oscillator.current.frequency.setValueAtTime(600, audioContext.current.currentTime);

    const gainNode = audioContext.current.createGain();
    gainNode.gain.setValueAtTime(0, audioContext.current.currentTime); // Initially mute

    oscillator.current.connect(gainNode);
    gainNode.connect(audioContext.current.destination);
    oscillator.current.start();

    let currentTime = audioContext.current.currentTime;

    // Calculate total duration of the Morse code
    const totalDuration = morse.split("").reduce((acc, char) => {
      switch (char) {
        case ".":
          return acc + dotDuration + pauseDuration;
        case "-":
          return acc + dashDuration + pauseDuration;
        case " ":
          return acc + letterPauseDuration;
        case "/":
          return acc + wordPauseDuration;
        default:
          return acc;
      }
    }, 0);

    morse.split("").forEach((char, index) => {
      setTimeout(() => {
        setCurrentIndex(index);
        setProgress(((index + 1) / morse.length) * 100);
      }, (currentTime - audioContext.current.currentTime) * 1000);

      switch (char) {
        case ".":
          gainNode.gain.setValueAtTime(1, currentTime); // Sound for dot
          gainNode.gain.setValueAtTime(0, currentTime + dotDuration / 1000); // Stop sound
          currentTime += (dotDuration + pauseDuration) / 1000; // Update current time
          break;
        case "-":
          gainNode.gain.setValueAtTime(1, currentTime); // Sound for dash
          gainNode.gain.setValueAtTime(0, currentTime + dashDuration / 1000); // Stop sound
          currentTime += (dashDuration + pauseDuration) / 1000; // Update current time
          break;
        case " ":
          currentTime += letterPauseDuration / 1000; // Pause between letters
          break;
        case "/":
          currentTime += wordPauseDuration / 1000; // Pause between words
          break;
      }
    });

    // Attach the onended event to the oscillator
    oscillator.current.onended = () => {
      console.log("Playback finished, resetting state...");
      setIsPlaying(false); // Re-enable button
      setCurrentIndex(-1); // Reset current index
      setProgress(100); // Set progress to 100%
    };

    oscillator.current.stop(currentTime + totalDuration / 1000); // Stop oscillator
  };

  const stopMorseCode = () => {
    if (!isPlaying) return; // Do nothing if not playing
    console.log("Playback STOP"); // Log when stopping playback
    oscillator.current.stop(); // Stop the oscillator immediately
    setIsPlaying(false); // Update state to indicate not playing
    setCurrentIndex(-1); // Reset current index
  };

  const handleInputChange = (e) => {
    setInput(e.target.value);
    setIsConverted(false); // Reset conversion state on input change
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-800 border-[#670926]">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center text-[#670926]">
            Morse Code Translator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={conversionType} onValueChange={setConversionType}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select conversion type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="textToMorse">Text to Morse Code</SelectItem>
              <SelectItem value="morseToText">Morse Code to Text</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder={
              conversionType === "textToMorse"
                ? "Enter text"
                : "Enter Morse code"
            }
            value={input}
            onChange={handleInputChange}
            className="w-full"
          />

          <Button
            onClick={handleConvert}
            disabled={!input || isConverted} // Disable button if input is empty or already converted
            className="w-full bg-[#670926] hover:bg-[#7a0a2e]"
          >
            Convert
          </Button>

          {error && <p className="text-red-500">{error}</p>}

          <div className="bg-gray-700 p-2 rounded min-h-[100px] break-words">
            {output}
          </div>

          {conversionType === "textToMorse" && output && (
            <div className="space-y-4">
              <Button
                onClick={playMorseCode}
                disabled={isPlaying} // Button disabled if playing
                className="w-full bg-[#670926] hover:bg-[#7a0a2e]"
              >
                Play Morse Code
              </Button>

              <Button
                onClick={stopMorseCode}
                disabled={!isPlaying} // Button enabled if playing
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Stop
              </Button>

              <div className="relative w-full bg-gray-600 h-2 rounded-full">
                <div
                  className="absolute left-0 h-full bg-[#670926] rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>

              <div className="h-8 bg-gray-700 rounded overflow-hidden flex space-x-1">
                {output.split("").map((char, index) => (
                  <span
                    key={index}
                    className={`block transition-all duration-300 ${
                      index === currentIndex
                        ? "bg-[#670926] w-3 h-full"
                        : char === "."
                        ? "bg-gray-500 w-2 h-3"
                        : char === "-"
                        ? "bg-gray-500 w-6 h-3"
                        : "w-2"
                    }`}
                  ></span>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
