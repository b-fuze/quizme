export const enum EFactBit {
  N = "name",
  B = "birth",
  D = "date",
  C = "company",
  M = "movie",
  O = "object",
}

export enum ENonConstFactBit {
  N = "name",
  B = "birth",
  D = "date",
  C = "company",
  M = "movie",
  O = "object",
}

export type Fact = (string | [EFactBit, string])
export type FactArray = Fact[]

const factBitRe = /([A-Z])<([^>]+)>/g
const whiteSpaceRe = /[ \n]+/g

export function parseFact(factSrc: string): FactArray {
  const fact: FactArray = []

  factBitRe.lastIndex = 0
  let curMatch: RegExpExecArray | null = null
  let cursor = 0
  while (curMatch = factBitRe.exec(factSrc)) {
    // Push in the substring before the fact bit
    fact.push(factSrc.slice(cursor, curMatch.index).replace(whiteSpaceRe, " "))

    // Push in the fact bit
    const factBitType = <EFactBit> <unknown> ENonConstFactBit[<keyof typeof ENonConstFactBit> curMatch[1]]
    const factBit: [EFactBit, string] = [factBitType, curMatch[2].replace(whiteSpaceRe, " ")]
    fact.push(factBit)

    cursor = curMatch.index + curMatch[0].length
  }

  // Add last substring (if any)
  if (cursor !== factSrc.length) {
    fact.push(factSrc.slice(cursor, factSrc.length).replace(whiteSpaceRe, " "))
  }

  return fact
}

