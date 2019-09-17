#! /usr/bin/env node

import { readdirSync, readFileSync } from "fs"
import minimist from "minimist"
import { safeLoad } from "js-yaml"
import { join as joinPath, relative as relativePath } from "path"
import { parseFact, FactArray, EFactBit, ENonConstFactBit } from "./parse-fact"
import { FactBits, Fact, FactCategories, Question } from "./types"
import { scramble, shuffle } from "./scramble"
import { stripIndents, displayQuestion } from "./ui"

const args = {
  "fact-dir": "",
  "max-options": 0,
  "wrap-boundary": 0,
  ...minimist(process.argv.slice(2)),
}

let factDir = args["fact-dir"]
let maxOptions = args["max-options"]
let wrapBoundary = args["wrap-boundary"]

if (!factDir) {
  console.error(
    stripIndents`
    USAGE
       ${ relativePath(process.cwd(), process.argv[1]) } --fact-dir FACT_DIR [--max-options MAX_OPTIONS] [--wrap-boundary WRAP_BOUNDARY]
    `
  )

  process.exit()
}

if (maxOptions === 0 || isNaN(maxOptions)) {
  maxOptions = 4
}

if (wrapBoundary === 0 || isNaN(wrapBoundary)) {
  wrapBoundary = 80
}

const categories: Map<string, Fact[]> = new Map()
const facts: Fact[] = []
const factBits: FactBits = {
  name: new Set(),
  birth: new Set(),
  date: new Set(),
  company: new Set(),
  movie: new Set(),
  object: new Set(),
}

// Collect fact pieces
for (const file of readdirSync(factDir)) {
  const filePath = joinPath(process.cwd(), factDir, file)
  const doc = safeLoad(readFileSync(filePath, "utf8"))

  const factsYaml: {
    [cat: string]: {
      stars: number;
      info: string | string[];
      categories: string;
    }[]
  } = doc.facts

  if (factsYaml) {
    for (const [catName, catFacts] of Object.entries(factsYaml)) {
      let catNames = catName.split(/\s*,\s*/g)
      let catArrays: Fact[][] = []

      for (const catName of catNames) {
        let cat = categories.get(catName)

        if (!cat) {
          categories.set(catName, cat = [])
        }

        catArrays.push(<Fact[]> cat)
      }

      for (const rawFact of catFacts) {
        if (typeof rawFact.info === "string") {
          const factParsed = parseFact(rawFact.info)
          const factStored: Fact = {
            stars: rawFact.stars,
            info: factParsed,
          }

          facts.push(factStored)
          
          for (const arr of catArrays) {
            arr.push(factStored)
          }

          // Cache all fact bits for scrambling later
          for (const factPiece of factParsed) {
            if (typeof factPiece === "string") {

            } else {
              factBits[factPiece[0]].add(factPiece[1])
            }
          }
        } else {
          console.error("Can't process array-based facts yet: " + filePath)
        }
      }
    }
  } else {
    console.error("Malformed fact file: " + filePath)
  }
}

const questions: Question[] = []

for (const fact of facts) {
  questions.push(scramble(fact, factBits, maxOptions))
}

for (let i=0; i<questions.length; i++) {
  const question = questions[i]

  console.log("\nChoose the correct fact:")
  console.log(displayQuestion(i + 1, question, 5, wrapBoundary))
}

