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

const getOneTalker = async (id) => {
    const talker = await readTalkerFile();
    const talkerWicthId = talker.filter((talk) => Number(talk.id) === Number(id));
    if (talkerWicthId.length === 0) {
        return {
            message: 'Pessoa palestrante não encontrada',
          };
    }
    return talkerWicthId[0];
};

const randomToken = (size) => {
        let stringAleatoria = '';
        const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < size; i += 1) {
            stringAleatoria += caracteres.charAt(Math.floor(Math.random() * caracteres.length));
        }
        return stringAleatoria;
};

module.exports = {
    getAllTalker,
    getOneTalker,
    randomToken,
};