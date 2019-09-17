import { parseFact, FactArray, EFactBit, ENonConstFactBit } from "./parse-fact"

export type FactBits = {
  [K in ENonConstFactBit]: Set<string>;
}

export type Fact = {
  info: FactArray;
  stars: number;
}

export type FactCategories = {
  [category: string]: Fact;
}

export type Question = {
  options: string[];
  correct: number;
}

