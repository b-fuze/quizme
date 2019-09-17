import { Question } from "./types"

export function wrap(line: string, wrap: number) {
  let wrapped = []
  let tmpLine = ""
  let words = line.split(" ")
  let curWord = 0

  while (curWord < words.length) {
    const newLine = tmpLine + " " + words[curWord]

    if (newLine.length < wrap) {
      tmpLine = newLine
    } else {
      wrapped.push(newLine.trim())
      tmpLine = ""
    }

    curWord++
  }

  if (tmpLine) {
    wrapped.push(tmpLine.trim())
  }

  return wrapped.join("\n")
}

export function displayQuestion(number: number, question: Question, padding: number, wrapBoundary: number): string {
  const result = ""
  const maxNumber = 100
  const out: string[] = []

  const maxNumberCharCount = maxNumber.toString(10).length

  let optionNumber = 1
  for (const option of question.options) {
    const wrapped = wrap(option, wrapBoundary)
    const lines = wrapped.split(/\n/g)

    out.push(optionNumber.toString(10).padStart(maxNumberCharCount + 1, " ") + ". " + lines[0])

    const startSpace = new Array(maxNumberCharCount + 1).fill(" ").join("")
    for (const line of lines.slice(1)) {
      out.push(startSpace + "  " + line)
    }

    optionNumber++
    out.push("")
  }

  return out.join("\n")
}

export function stripIndents(strings: TemplateStringsArray, ...parts: string[]) {
  let full = strings[0]

  for (let i=1; i<strings.length; i++) {
    full += parts[i - 1] + strings[i]
  }

  // TODO: Check the match isn't null here
  const beginWhiteSpace = (<RegExpMatchArray> full.match(/^\s+/))[0]
  const beginWSRe = new RegExp(beginWhiteSpace.replace(/\n/g, "\\n"), "g")

  return full.slice(beginWhiteSpace.length).replace(beginWSRe, "\n").trim()
}

