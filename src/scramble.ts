import { EFactBit } from "./parse-fact"
import { Fact, FactBits, Question } from "./types"

const bitArrays: {
  [K in keyof FactBits]: string[];
} & {
  cached: boolean;
} = <any> {
  cached: false,
}

const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31]

export function scramble(fact: Fact, factBits: FactBits, maxOptions: number): Question {
  if (!bitArrays.cached) {
    for (const [factBitType, factBitSet] of Object.entries(factBits)) {
      bitArrays[<keyof FactBits> factBitType] = Array.from(factBitSet)
    }

    bitArrays.cached = true
  }

  let options: string[] = []
  let question = {
    options,
    correct: 0,
  }

  let random = Math.floor(Math.random() * 100)

  // TODO: Dynamically generate
  const offsets: number[] = []

  for (let i=0; i<maxOptions; i++) {
    offsets.push(random % primes[i % primes.length])
  }

  const info = fact.info

  // Add first (correct) fact bit
  let firstOption = ""
  for (let i=0; i<info.length; i++) {
    const isFactBit = (i % 2)

    if (isFactBit) {
      const factBit = <[EFactBit, string]> info[i]
      firstOption += factBit[1]
    } else {
      firstOption += <string> info[i]
    }
  }

  options.push(firstOption)
  let uniqOptions = new Set(options)

  // Construct different fact bits
  for (let j=1; j<maxOptions; j++) {
    let currentOption = ""
    let currentOffset = 0
    const currentOptionCount = uniqOptions.size

    // Enforce some randomness to the options
    while (currentOptionCount === uniqOptions.size && currentOffset < 5) {
      currentOption = ""

      for (let i=0; i<info.length; i++) {
        const isFactBit = (i % 2)

        if (isFactBit) {
          const curBitArray = bitArrays[(<[EFactBit, string]> info[i])[0]]
          const index = Math.floor(Math.random() * curBitArray.length)
          const randomOption = curBitArray[index]

          currentOption += randomOption
        } else {
          currentOption += <string> info[i]
        }
      }

      uniqOptions.add(currentOption)
      currentOffset++
    }

    options.push(currentOption)
  }

  // Scramble up options
  for (let i=0; i<offsets.length; i++) {
    const correct = question.correct
    const offset = offsets[i] % options.length

    const old = options[offset]
    const newo = options[i]
    
    options[i] = old
    options[offset] = newo

    let fixCorrect = -1

    if (correct === i) fixCorrect = offset
    if (correct === offset) fixCorrect = i
    if (fixCorrect !== -1) question.correct = fixCorrect
  }

  return question
}

// Kinda Fisher Yates, a little backwards
export function shuffle<T = any>(arr: T[]): T[] {
  for (let i=0; i<arr.length; i++) {
    const newIndex = Math.floor(Math.random() * (i + 1))
    const tmp = arr[i]

    arr[i] = arr[newIndex]
    arr[newIndex] = tmp
  }

  return arr
}

