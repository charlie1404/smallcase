const crypto = require('crypto');

const alphabet = '_-0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
const alphabetLength = 63;

const buffers = {};

/*
  Why not uuids ??
    Only reason is they are slow,
    and this function has enought entropy to generate random values without conflicts for our use case
*/
function generateRandomId(size = 32) {
  let buffer = buffers[size];
  let id = '';

  if (!buffer) {
    buffer = Buffer.allocUnsafe(size);
    buffers[size] = buffer;
  }

  const bytes = crypto.randomFillSync(buffer);

  for (let i = 0; i < size; i += 1) {
    // eslint-disable-next-line no-bitwise
    id += alphabet[bytes[i] & alphabetLength];
  }

  return id;
}

module.exports = generateRandomId;
