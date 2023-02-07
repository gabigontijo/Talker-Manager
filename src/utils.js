const fs = require('fs').promises;
const { join } = require('path');

const unspectedJsonEnd = 'Unexpected end of JSON input';
const path = '/talker.json';

const readTalkerFile = async () => {
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
    try {
        const oldTalker = await readTalkerFile();
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
    const talkUpdate = { id, ...talk };
    const talkersUpdated = talkers.reduce((talkerlist, currentTalker) => {
        if (currentTalker.id === talkUpdate.id) return [...talkerlist, talkUpdate];
        return [...talkerlist, currentTalker];
    }, []);
    const updateData = JSON.stringify(talkersUpdated);
    try {
         await fs.writeFile(join(__dirname, path), updateData);
         return talkUpdate;
        } catch (error) {
        console.log(`falha ao escrever no arquivo ${error}`);
    }
};

const deleteTalker = async (id) => {
    const talkers = await readTalkerFile();
    const deletedList = JSON.stringify(talkers.filter((talk) => talk.id !== id));
    try {
        await fs.writeFile(join(__dirname, path), deletedList);
       } catch (error) {
       console.log(`falha ao escrever no arquivo ${error}`);
   }
};

const searchTalkerName = async (name) => {
    const talkers = await readTalkerFile();
    const searchFilter = talkers.filter((talk) => talk.name.includes(name));
    return searchFilter;
};

module.exports = {
    getAllTalker,
    writeTalkerFile,
    getOneTalker,
    randomToken,
    validateDate,
    getUpdate,
    deleteTalker,
    searchTalkerName,
};