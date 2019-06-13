function nullParser (input) {
  if (input.startsWith('null')) return [null, input.slice(4)]
  return null
}
function boolParser (input) {
  if (input.startsWith('true')) return [true, input.slice(4)]
  if (input.startsWith('false')) return [false, input.slice(5)]
  return null
}
function numParser (input) {
  let _string = ''
  let i = 0
  if ((input[i] === '-') && (input[i + 1] >= '0' && input[i + 1] <= '9')) {
    _string = input[0]
    i++
  }
  if (input[i] === '0') {
    _string += input[i]
    i++
    if (input[i] === '.' && (input[i + 1] >= '0' && input[i + 1] <= '9')) {
      _string += input[i]
      i++
      while (input[i] >= '0' && input[i] <= '9') {
        _string += input[i]
        i++
      }
    } else return null
  } else if (input[i] >= '1' && input[i] <= '9') {
    _string += input[i]
    i++
    while (input[i] >= '0' && input[i] <= '9') {
      _string += input[i]
      i++
    }
    if (input[i] === '.' && (input[i + 1] >= '0' && input[i + 1] <= '9')) {
      _string += '.'
      i++
      while (input[i] >= '0' && input[i] <= '9') {
        _string += input[i]
        i++
      }
    }
  }
  if (input[i] === 'e' || input[i] === 'E') {
    if ((input[i + 1] === '-' || input[i + 1] === '+') || (input[i + 1] >= '0' && input[i + 1] <= '9')) {
      if (input[i + 1] === '-' || input[i + 1] === '+') {
        if (input[i + 2] >= '0' && input[i + 2] <= '9') {
          _string += input[i] + input[i + 1] + input[i + 2]
          i += 3
        }
      } else {
        _string += input[i] + input[i + 1]
        i += 2
      }
    }
  }
  while (input[i] >= '0' && input[i] <= '9') {
    _string += input[i]
    i++
  }
  if (_string.length === 0) return null
  return [Number(_string), input.slice(_string.length)]
}
function stringParser (input) {
  if (!input.startsWith('"')) return null
  let escape = { '\\': '\\', '/': '/', '"': '"', 'b': '\b', 't': '\t', 'n': '\n', 'f': '\f', 'r': '\r' }
  let result = ''
  let str = input.slice(1)
  while (str[0] !== '"') {
    if (str[0] === '\t' || str[1] === '\n') return null
    if (str[0] === '\\') {
      if (escape[str[1]] === undefined && str[1] !== 'u') return null
      if (str[1] === 'u') {
        if (str.slice(2).length <= 4) return null
        result += str.slice(2, 6); str = str.slice(6)
        continue
      }
      result += escape[str[1]]; str = str.slice(2)
      if (str.indexOf('"') === -1) return null
      continue
    }
    result += str[0]; str = str.slice(1)
    if (str.length === 0) return null
  }
  return [result.slice(0, result.length), str.slice(1)]
}
function arrayParser (input) {
  if (!input.startsWith('[')) return null
  let val = []
  let str = spaceParser(input.slice(1))
  let result
  let iscomma = true
  while (str[0] !== ']') {
    if (str[0] === ',' && iscomma) return null
    if (str[0] === ',') {
      iscomma = true; str = spaceParser(str.slice(1))
      if (!str.length) return null
    }
    if (!iscomma) return null
    iscomma = false
    result = parser(str)
    if (!result) return null
    val.push(result[0]); str = spaceParser(result[1])
  }
  if (iscomma) return null
  return [val, str.slice(1)]
}
function objectParser (input) {
  if (!input.startsWith('{')) return null
  input = input.slice(1)
  input = spaceParser(input)
  let result = {}
  let key, value
  while (input[0] !== '}') {
    if (stringParser(input) !== null) key = stringParser(input)
    else return null
    if (key[1].startsWith(':')) input = key[1].slice(1)
    else return null
    input = spaceParser(input)
    if (parser(input) !== null) value = parser(input)
    else return null
    result[key[0]] = value[0]
    // console.log(result)
    if (value[1].startsWith(',')) {
      input = value[1].slice(1)
      input = spaceParser(input)
      if (input.startsWith('}')) return null
    } else input = value[1]
    input = spaceParser(input)
    // console.log(input)
  }
  return [result, input.slice(1)]
}
function spaceParser (input) {
  while (input[0] === ' ') input = input.slice(1)
  return input
}
function parser (input) {
  let parser = [nullParser, boolParser, numParser, stringParser, arrayParser, objectParser]
  let result = null
  for (let func of parser) {
    if (!result) result = func(input); else break
  }
  return result
}

var fs = require('fs')
// var jsonParser = require('/home/heena/objects/json parser/json.js')
var path = require('path')
var directory = '/home/heena/Downloads/test'
let files = fs.readdirSync(directory)
// console.log(files)
for (let i = 0; i < files.length; i++) {
  var x = path.join('/home/heena/Downloads/test/', files[i])
  var contents = fs.readFileSync(x, 'utf8')
  console.log(files[i], parser(contents))
}
