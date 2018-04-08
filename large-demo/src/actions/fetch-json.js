
const fs = require('fs');
const util = require('util');
const readFile = util.promisify(fs.readFile);

module.exports = async (fileName) => {
  let content = await readFile(fileName);
  return JSON.parse(content);
}