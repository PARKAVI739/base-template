
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
