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

const getNewId = async () => {
    const arrayId = await readTalkerFile();
    const lastId = arrayId[arrayId.length - 1];
    const newId = +lastId.id + 1;
    return newId;
};

const writeTalkerFile = async (newTalker) => {
    const path = '/talker.json';
    try {
        const oldTalker = await readTalkerFile();
        // const oldTalker = [];
        const newId = await getNewId();
        const newTalkerWithId = { id: newId, ...newTalker };
        const allTalker = JSON.stringify([...oldTalker, newTalkerWithId]);
        console.log(allTalker);
    await fs.writeFile(join(__dirname, path), allTalker);
    return newTalkerWithId;
    } catch (error) {
        console.log(`falha ao escrever no arquivo ${error}`);
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

const validateDate = (date) => {
        const reg = /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d/;
        console.log(date.match(reg));
        if (date.match(reg)) {
          return true;
        }
          return false;
};

const getUpdate = async (id, talk) => {
    const talkers = await readTalkerFile();
    console.log('++++++ talker', talkers);
    const talkUpdate = { id, ...talk };
    const talkersUpdated = talkers.reduce((talkerlist, currentTalker) => {
        console.log(talkerlist);
        if (currentTalker.id === talkUpdate.id) return [...talkerlist, talkUpdate];
        return [...talkerlist, currentTalker];
    }, []);
    const updateData = JSON.stringify(talkersUpdated);
    const path = '/talker.json';
    try {
         await fs.writeFile(join(__dirname, path), updateData);
         return talkUpdate;
        } catch (error) {
        console.log(`falha ao escrever no arquivo ${error}`);
    }
};

module.exports = {
    getAllTalker,
    writeTalkerFile,
    getOneTalker,
    randomToken,
    validateDate,
    getUpdate,
};