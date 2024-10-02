import React, { useState, useEffect } from 'react';
import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectItem } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DownloadIcon } from "@radix-ui/react-icons";

const patterns = {
  'Garter Stitch': () => 'Knit all rows.',
  'Stockinette Stitch': () => 'Row 1: Knit\nRow 2: Purl\nRepeat these two rows.',
  'Ribbing (K1, P1)': () => 'Every row: *K1, P1; repeat from * to end.',
  'Ribbing (K2, P2)': () => 'Every row: *K2, P2; repeat from * to end.',
  'Seed Stitch': () => 'Row 1: *K1, P1; repeat from *\nRow 2: *P1, K1; repeat from *\nRepeat these two rows.',
  'Cable Stitch (C4F, C6B)': (width) => `Row 1, 5: Knit\nRow 3: C4F, knit to last 4 sts, C6B\nRow 7: Knit\nRepeat these 8 rows. Ensure you have enough width for cables.`,
  'Basketweave': () => 'Multiples of 8 + 5:\nRow 1-4: *K5, P3; rep from *\nRow 5-8: *P5, K3; rep from *\nRepeat these 8 rows.',
  'Lace (Yarn Over, K2tog)': () => 'Row 1: *YO, K2tog; repeat from *\nRow 2: Purl\nRepeat these two rows.',
  'Honeycomb Brioche': () => 'Complex pattern, requires setup row. Not suitable for simple text generation.',
  'Fair Isle': () => 'Pattern involves color changes. Text description not suitable.',
  'Chevron': () => 'Row 1: *K1, YO, K3, SL1-K2tog-PSO, K3, YO; rep from *\nRow 2: Purl\nRepeat these two rows.',
  'Feather and Fan': () => 'Row 1: Knit\nRow 2: Purl\nRow 3: *K2tog twice, (YO, K1) 4 times, K2tog twice; rep from *\nRow 4: Knit\nRepeat these 4 rows.',
  'Twisted Rib': () => 'Every row: *K1 tbl, P1; repeat from *',
  'Double Seed Stitch': () => 'Row 1-2: *K2, P2; repeat from *\nRow 3-4: *P2, K2; repeat from *\nRepeat these 4 rows.',
};

const yarnThickness = ['light', 'medium', 'bulky'];

function PatternGenerator() {
  const [width, setWidth] = useState('');
  const [height, setHeight] = useState('');
  const [patternType, setPatternType] = useState('');
  const [yarn, setYarn] = useState('');
  const [pattern, setPattern] = useState('');
  const [canGenerate, setCanGenerate] = useState(false);

  useEffect(() => {
    setCanGenerate(width && height && patternType && yarn);
  }, [width, height, patternType, yarn]);

  const generatePattern = () => {
    const generator = patterns[patternType];
    setPattern(typeof generator === 'function' ? generator(width) : generator);
  };

  const downloadPattern = () => {
    const element = document.createElement('a');
    const file = new Blob([pattern], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = `knitting_pattern.txt`;
    document.body.appendChild(element);
    element.click();
  };

  return (
    <Card className="max-w-lg mx-auto mt-10 bg-[#670962] text-white">
      <CardHeader>
        <CardTitle>Knitting Pattern Generator</CardTitle>
        <CardDescription>Create your custom knitting pattern</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="width">Width (stitches)</Label>
            <Input id="width" type="number" value={width} onChange={(e) => setWidth(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="height">Height (rows)</Label>
            <Input id="height" type="number" value={height} onChange={(e) => setHeight(e.target.value)} />
          </div>
          <div>
            <Label htmlFor="pattern">Pattern Type</Label>
            <Select id="pattern" value={patternType} onChange={(e) => setPatternType(e.target.value)}>
              <SelectItem value="">Choose a pattern</SelectItem>
              {Object.keys(patterns).map(pattern => <SelectItem key={pattern} value={pattern}>{pattern}</SelectItem>)}
            </Select>
          </div>
          <div>
            <Label htmlFor="yarn">Yarn Thickness</Label>
            <Select id="yarn" value={yarn} onChange={(e) => setYarn(e.target.value)}>
              <SelectItem value="">Choose yarn thickness</SelectItem>
              {yarnThickness.map(thickness => <SelectItem key={thickness} value={thickness}>{thickness}</SelectItem>)}
            </Select>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button disabled={!canGenerate} onClick={generatePattern}>Generate Pattern</Button>
      </CardFooter>
      {pattern && 
        <CardContent>
          <pre className="text-sm whitespace-pre-wrap bg-black p-2 rounded">{pattern}</pre>
          {pattern !== 'No pattern generated yet' && <Button onClick={downloadPattern} className="mt-2"><DownloadIcon className="mr-2" />Download Pattern</Button>}
        </CardContent>
      }
      {!pattern && <CardContent>No pattern generated yet.</CardContent>}
    </Card>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-[#450640] flex items-center justify-center">
      <PatternGenerator />
    </div>
  );
}