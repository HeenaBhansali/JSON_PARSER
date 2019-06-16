function nullParser (input) {
  if (input.startsWith('null')) return [null, input.slice(4)]
  return null
}
function boolParser (input) {
  if (input.startsWith('true')) return [true, input.slice(4)]
  if (input.startsWith('false')) return [false, input.slice(5)]
  return null
}
function numberParser (input) {
  let str = ''
  let i = 0
  if ((input[i] === '-') && (input[i + 1] >= '0' && input[i + 1] <= '9')) {
    str = input[0]
    i++
  }
  if (input[i] === '0') {
    str += input[i]
    i++
    if (input[i] === '.' && (input[i + 1] >= '0' && input[i + 1] <= '9')) {
      str += input[i]
      i++
      while (input[i] >= '0' && input[i] <= '9') {
        str += input[i]
        i++
      }
    } else if (input[i] >= '0' && input[i] <= '9') return null
  } else if (input[i] >= '1' && input[i] <= '9') {
    str += input[i]
    i++
    while (input[i] >= '0' && input[i] <= '9') {
      str += input[i]
      i++
    }
    if (input[i] === '.' && (input[i + 1] >= '0' && input[i + 1] <= '9')) {
      str += '.'
      i++
      while (input[i] >= '0' && input[i] <= '9') {
        str += input[i]
        i++
      }
    }
  }
  if (input[i] === 'e' || input[i] === 'E') {
    if ((input[i + 1] === '-' || input[i + 1] === '+') || (input[i + 1] >= '0' && input[i + 1] <= '9')) {
      if (input[i + 1] === '-' || input[i + 1] === '+') {
        if (input[i + 2] >= '0' && input[i + 2] <= '9') {
          str += input[i] + input[i + 1] + input[i + 2]
          i += 3
        }
      } else {
        str += input[i] + input[i + 1]
        i += 2
      }
    }
  }
  while (input[i] >= '0' && input[i] <= '9') {
    str += input[i]
    i++
  }
  if (str.length === 0) return null
  return [str * 1, input.slice(str.length)]
}
function stringParser (input) {
  if (!input.startsWith('"')) return null
  let escape = { '\\': '\\', '/': '/', '"': '"', 'b': '\b', 't': '\t', 'n': '\n', 'f': '\f', 'r': '\r' }
  let result = ''
  let str = input.slice(1)
  while (str[0] !== '"') {
    if (str[0] === '\t' || str[0] === '\n') return null
    if (str[0] === '\\') {
      if (escape[str[1]] === undefined && str[1] !== 'u') return null
      if (str[1] === 'u') {
        if (str.slice(2).length <= 4) return null
        let hex = str.slice(2, 6)
        result += String.fromCodePoint(parseInt(hex, 16))
        str = str.slice(6)
        continue
      }
      result += escape[str[1]]
      str = str.slice(2)
      if (str.indexOf('"') === -1) return null
      continue
    }
    result += str[0]; str = str.slice(1)
    if (str.length === 0) return null
  }
  // console.log(result[0].length)
  return [result, str.slice(1)]
}
function arrayParser (input) {
  if (!input.startsWith('[')) return null
  let val = []; let str = spaceParser(input.slice(1)); let result
  let iscomma = true
  if (str[0] === ']') return [val, str.slice(1)]
  while (str[0] !== ']') {
    if (str[0] === ',' && iscomma) return null
    if (str[0] === ',') {
      iscomma = true; str = spaceParser(str.slice(1))
      continue
    }
    iscomma = false
    result = parser(str)
    if (result === null) return null
    val.push(result[0]); str = spaceParser(result[1])
    continue
  }
  if (iscomma) return null
  return [val, str.slice(1)]
}
function objectParser (input) {
  if (!input.startsWith('{')) return null
  let str = input.slice(1)
  str = spaceParser(str)
  let result = {}
  if (!str.includes('}')) return null
  while (!str.startsWith('}')) {
    let key = stringParser(str)
    if (key === null) return null
    key[1] = spaceParser(key[1])
    if (!key[1].startsWith(':')) return null
    str = key[1].slice(1, str.length)
    str = spaceParser(str)
    let value = parser(str)
    if (value === null) return null
    result[key[0]] = value[0]
    if (value[1].startsWith(',')) {
      str = value[1].slice(1, str.length)
      str = spaceParser(str)
      if (str.startsWith('}')) return null
    } else str = value[1]
    str = spaceParser(str)
  }
  return [result, str.slice(1, str.length)]
}
function spaceParser (input) {
  while (input[0] === ' ' || input[0] === '' || input[0] === '\n' || input[0] === '\t') input = input.slice(1)
  return input
}
function parser (input) {
  let parser = [nullParser, boolParser, numberParser, stringParser, arrayParser, objectParser]
  let result = null
  for (let func of parser) {
    if (!result) result = func(input); else break
  }
  return result
}
var fs = require('fs')
var contents = fs.readFileSync('/home/heena/Downloads/test/fail1.json', 'utf8')
console.log(parser(contents))
// var path = require('path')
// var directory = '/home/heena/Downloads/test'
// var files = fs.readdirSync(directory)
// for (let i = 0; i < files.length; i++) {
//   var x = path.join('/home/heena/Downloads/test/', files[i])
//   var contents = fs.readFileSync(x, 'utf8')
//   let res = parser(contents)
//   if (res !== null) {
//     res = spaceParser(res.slice(1))
//     if (res.length > 0) console.log(files[i], null)
//     else console.log(files[i], parser(contents))
//   } else console.log(files[i], parser(contents))
// }
