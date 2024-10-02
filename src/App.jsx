import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const patternTypes = [
  "Garter Stitch",
  "Stockinette Stitch",
  "Ribbing (K1, P1)",
  "Ribbing (K2, P2)",
  "Seed Stitch",
  "Cable Stitch (C4F)",
  "Cable Stitch (C6B)",
  "Basketweave",
  "Lace (Yarn Over, K2tog)",
  "Honeycomb Brioche",
  "Fair Isle",
  "Chevron",
  "Feather and Fan",
  "Twisted Rib",
  "Double Seed Stitch",
];

const yarnThicknesses = ["Light", "Medium", "Bulky"];

function PatternPreview({ pattern }) {
  return (
    <div className="bg-gray-800 p-4 rounded-lg shadow-lg font-mono text-sm overflow-auto max-h-60 transition duration-300 text-white">
      {pattern ? (
        pattern.split("\n").map((line, index) => <div key={index}>{line}</div>)
      ) : (
        <div className="text-gray-400">No pattern generated yet.</div>
      )}
    </div>
  );
}

function generatePattern(width, height, patternType, yarnThickness) {
  let pattern = `Knitting Pattern\nWidth: ${width} stitches\nHeight: ${height} rows\nPattern Type: ${patternType}\nYarn Thickness: ${yarnThickness}\n\n`;

  for (let row = 1; row <= height; row++) {
    pattern += `Row ${row}: `;
    switch (patternType) {
      case "Garter Stitch":
        pattern += "Knit all stitches";
        break;
      case "Stockinette Stitch":
        pattern += row % 2 === 1 ? "Knit all stitches" : "Purl all stitches";
        break;
      case "Ribbing (K1, P1)":
        pattern += "*(K1, P1) repeat from * to end";
        break;
      case "Ribbing (K2, P2)":
        pattern += "*(K2, P2) repeat from * to end";
        break;
      case "Seed Stitch":
        pattern +=
          row % 2 === 1
            ? "*(K1, P1) repeat from * to end"
            : "*(P1, K1) repeat from * to end";
        break;
      case "Cable Stitch (C4F)":
        pattern +=
          row % 4 === 0
            ? "*(C4F, K4) repeat from * to end"
            : "Knit all stitches";
        break;
      case "Cable Stitch (C6B)":
        pattern +=
          row % 6 === 0
            ? "*(C6B, K6) repeat from * to end"
            : "Knit all stitches";
        break;
      case "Basketweave":
        pattern +=
          row % 8 < 4
            ? "*(K4, P4) repeat from * to end"
            : "*(P4, K4) repeat from * to end";
        break;
      case "Lace (Yarn Over, K2tog)":
        pattern += "*(YO, K2tog) repeat from * to end";
        break;
      case "Honeycomb Brioche":
        pattern +=
          row % 2 === 1
            ? "*(K1, Sl1yo) repeat from * to end"
            : "*(BRK1, P1) repeat from * to end";
        break;
      case "Fair Isle":
        pattern += "Follow Fair Isle chart for color changes";
        break;
      case "Chevron":
        pattern += "*(K5, K2tog, K5, M1) repeat from * to end";
        break;
      case "Feather and Fan":
        pattern +=
          row % 4 === 1
            ? "Knit all stitches"
            : row % 4 === 2
            ? "*(K2tog) 3 times, (YO, K1) 6 times, (K2tog) 3 times, repeat from * to end"
            : row % 4 === 3
            ? "Purl all stitches"
            : "Knit all stitches";
        break;
      case "Twisted Rib":
        pattern += "*(K1tbl, P1) repeat from * to end";
        break;
      case "Double Seed Stitch":
        pattern +=
          row % 4 <= 1
            ? "*(K2, P2) repeat from * to end"
            : "*(P2, K2) repeat from * to end";
        break;
      default:
        pattern += "Knit all stitches";
    }
    pattern += "\n";
  }

  return pattern;
}

export default function App() {
  const [width, setWidth] = useState("");
  const [height, setHeight] = useState("");
  const [patternType, setPatternType] = useState("");
  const [yarnThickness, setYarnThickness] = useState("");
  const [pattern, setPattern] = useState("");

  const isFormComplete = width && height && patternType && yarnThickness;

  const handleGenerate = () => {
    if (isFormComplete) {
      setPattern(generatePattern(width, height, patternType, yarnThickness));
    }
  };

  const handleDownload = () => {
    const blob = new Blob([pattern], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "knitting_pattern.txt";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6 flex justify-center items-center">
      <Card className="max-w-2xl w-full shadow-xl rounded-lg bg-gray-800">
        <CardHeader>
          <CardTitle
            className="text-3xl font-semibold text-center"
            style={{ color: "#670962" }}
          >
            Knitting Pattern Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-8 p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <Label htmlFor="width" className="text-white">
                Width (stitches)
              </Label>
              <Input
                id="width"
                type="number"
                placeholder="Enter number of stitches"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                min="1"
                className="border-gray-600 bg-gray-700 text-white rounded-lg p-2 shadow-sm transition"
              />
            </div>
            <div>
              <Label htmlFor="height" className="text-white">
                Height (rows)
              </Label>
              <Input
                id="height"
                type="number"
                placeholder="Enter number of rows"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                min="1"
                className="border-gray-600 bg-gray-700 text-white rounded-lg p-2 shadow-sm transition"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="patternType" className="text-white">
              Pattern Type
            </Label>
            <Select onValueChange={setPatternType}>
              <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white rounded-lg p-2 shadow-sm transition">
                <SelectValue placeholder="Select a pattern type" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectGroup>
                  {patternTypes.map((pattern) => (
                    <SelectItem key={pattern} value={pattern}>
                      {pattern}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="yarnThickness" className="text-white">
              Yarn Thickness
            </Label>
            <Select onValueChange={setYarnThickness}>
              <SelectTrigger className="w-full border-gray-600 bg-gray-700 text-white rounded-lg p-2 shadow-sm transition">
                <SelectValue placeholder="Select a yarn thickness" />
              </SelectTrigger>
              <SelectContent className="bg-gray-700 text-white">
                <SelectGroup>
                  {yarnThicknesses.map((thickness) => (
                    <SelectItem key={thickness} value={thickness}>
                      {thickness}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Button
              onClick={handleGenerate}
              disabled={!isFormComplete}
              className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
                isFormComplete
                  ? "bg-[#670962] text-white hover:bg-purple-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Generate Pattern
            </Button>
          </div>
          <div>
            <Label className="text-white">Pattern Preview</Label>
            <PatternPreview pattern={pattern} />
          </div>
          {pattern && (
            <Button
              onClick={handleDownload}
              className={`w-full py-3 text-lg font-semibold rounded-lg transition ${
                isFormComplete
                  ? "bg-[#670962] text-white hover:bg-purple-700"
                  : "bg-gray-600 text-gray-400 cursor-not-allowed"
              }`}
            >
              Download Pattern
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}