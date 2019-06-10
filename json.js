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
    }
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
function strParser (input) {
  if (!input.startsWith('"')) return null
  let escape = { '\\': '\\', '/': '/', '"': '"', 'b': '\b', 't': '\t', 'n': '\n', 'f': '\f', 'r': '\r' }
  let result = ' '
  let str = input.slice(1)
  while (str[0] !== '"') {
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
  return [result.slice(1, result.length), str.slice(1)]
}
