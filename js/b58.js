// Thank you random person from github for this.

var base58_chars = "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz";

const create_base58_map = () => {
  const base58M = Array(256).fill(-1)
  for (let i = 0; i < base58_chars.length; ++i)
    base58M[base58_chars.charCodeAt(i)] = i

  return base58M
}

const base58Map = create_base58_map()

const binary_to_base58 = uint8array => {
  const result = []

  for (const byte of uint8array) {
    let carry = byte
    for (let j = 0; j < result.length; ++j) {
      const x = (base58Map[result[j]] << 8) + carry
      result[j] = base58_chars.charCodeAt(x % 58)
      carry = (x / 58) | 0
    }
    while (carry) {
      result.push(base58_chars.charCodeAt(carry % 58))
      carry = (carry / 58) | 0
    }
  }

  for (const byte of uint8array)
    if (byte) break
    else result.push('1'.charCodeAt(0))

  result.reverse()

  return String.fromCharCode(...result)
}

function b58 (input) {
  const enc = new TextEncoder();
  const res = binary_to_base58(enc.encode(input))
  return res
}
