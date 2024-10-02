import React, { useState } from 'react';
import { Button, Card, CardContent, CardHeader, CardTitle, Select, SelectItem, Input, Label } from "@/components/ui";
import { cn } from "@/lib/utils";

const patternTypes = [
  'Garter Stitch', 'Stockinette Stitch', 'Ribbing', 'Seed Stitch', 'Cable Stitch',
  'Basketweave', 'Lace', 'Honeycomb Brioche', 'Fair Isle', 'Chevron', 
  'Feather and Fan', 'Twisted Rib', 'Double Seed Stitch'
];

const yarnThicknesses = ['light', 'medium', 'bulky'];

function generatePattern(width, height, type, thickness) {
  let pattern = `Pattern for ${width} stitches by ${height} rows, using ${thickness} yarn:\n\n`;
  // Simplified pattern generation logic for demonstration
  pattern += `Cast on ${width} stitches.\n`;
  for (let row = 1; row <= height; row++) {
    pattern += `Row ${row}: `;
    switch(type) {
      case 'Garter Stitch': pattern += 'Knit all stitches.\n'; break;
      case 'Stockinette Stitch': pattern += (row % 2 === 0 ? 'Purl' : 'Knit') + ' all stitches.\n'; break;
      // Add other patterns similarly
      default: pattern += 'Pattern not implemented.\n';
    }
  }
  pattern += 'Bind off all stitches.';
  return pattern;
}

export default function App() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [patternType, setPatternType] = useState('');
  const [yarnThickness, setYarnThickness] = useState('');
  const [pattern, setPattern] = useState('No pattern generated yet.');
  const [isGenerated, setIsGenerated] = useState(false);

  const canGenerate = width && height && patternType && yarnThickness;

  const handleGenerate = () => {
    const newPattern = generatePattern(width, height, patternType, yarnThickness);
    setPattern(newPattern);
    setIsGenerated(true);
  };

  const downloadTxtFile = () => {
    const element = document.createElement("a");
    const file = new Blob([pattern], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = "knitting_pattern.txt";
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <div className="min-h-screen bg-[#670962] flex items-center justify-center">
      <Card className="w-full max-w-md p-4 sm:p-6">
        <CardHeader>
          <CardTitle>Knitting Pattern Generator</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input label="Width (stitches)" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
            <Input label="Height (rows)" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
            <Select label="Pattern Type" value={patternType} onValueChange={setPatternType}>
              {patternTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
            </Select>
            <Select label="Yarn Thickness" value={yarnThickness} onValueChange={setYarnThickness}>
              {yarnThicknesses.map(thick => <SelectItem key={thick} value={thick}>{thick}</SelectItem>)}
            </Select>
            <Button disabled={!canGenerate} onClick={handleGenerate}>Generate Pattern</Button>
            {isGenerated && (
              <Button onClick={downloadTxtFile} className="mt-2">Download Pattern</Button>
            )}
            <div className="mt-4">
              <Label>Pattern Preview</Label>
              <textarea 
                readOnly
                value={pattern}
                rows="10"
                className="w-full p-2 border rounded-md bg-white text-black"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}