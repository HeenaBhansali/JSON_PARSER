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
