const fs = require('fs').promises;
const { join } = require('path');

const unspectedJsonEnd = 'Unexpected end of JSON input';

const readTalkerFile = async () => {
  const path = '/talker.json';
  try {
    const contentFile = await fs.readFile(join(__dirname, path), 'utf-8');
    return JSON.parse(contentFile);
  } catch (error) {
      return error;
    }
};

const getAllTalker = async () => {
    const talker = await readTalkerFile();
    if (talker instanceof Error && talker.message === unspectedJsonEnd) {
        return [];
    }
  return talker;
};

module.exports = {
    getAllTalker,
};