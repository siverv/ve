
const fs = require('fs');
const util = require('util');
const writeFile = util.promisify(fs.writeFile);

module.exports = async (fileName, object) => {
  let content = JSON.stringify(object);
  return await writeFile(fileName, content);
}