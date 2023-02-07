const express = require('express');
const { validateAge1, validateAge2 } = require('./middlewares/validateAge');
const validateEmailType = require('./middlewares/validateEmail');
const validateLogin = require('./middlewares/validateLogin');
const validateName = require('./middlewares/validateName');
const validatePasswordType = require('./middlewares/validatePassword');
const { validateTalk,
  validateTalkWatchedAt, validateTalkRate } = require('./middlewares/validateTalk');
const validateToken = require('./middlewares/validateToken');
const talker = require('./utils');

const app = express();
app.use(express.json());

const HTTP_OK_STATUS = 200;
const PORT = '3000';

// não remova esse endpoint, e para o avaliador funcionar
app.get('/', (_request, response) => {
  response.status(HTTP_OK_STATUS).send();
});

app.listen(PORT, () => {
  console.log('Online');
});

app.get('/talker', async (_req, res) => {
  const talk = await talker.getAllTalker();
  return res.status(HTTP_OK_STATUS).json(talk);
});

app.get('/talker/search', validateToken, async (req, res) => {
  const { q } = req.query;
  const searched = await talker.searchTalkerName(q);
  return res.status(200).json(searched);
});

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talk = await talker.getOneTalker(id);
  if (talk.id === undefined) {
     return res.status(404).json(talk);
  }
   return res.status(HTTP_OK_STATUS).json(talk);
});

app.post('/login', validateLogin, validateEmailType, validatePasswordType,
 (_req, res) => res.status(HTTP_OK_STATUS).json({ token: talker.randomToken(16) }));

app.post('/talker', validateToken, validateName, validateAge1, validateAge2,
 validateTalk, validateTalkWatchedAt, validateTalkRate, async (req, res) => {
  const talkerBody = req.body;
  const newTalker = await talker.writeTalkerFile(talkerBody);
  res.status(201).json(newTalker);
});

app.put('/talker/:id', validateToken, validateName, validateAge1, validateAge2,
validateTalk, validateTalkWatchedAt, validateTalkRate, async (req, res) => {
  const { id } = req.params;
  const talk = req.body;
  const talkerUpdate = await talker.getUpdate(Number(id), talk);
    return res.status(HTTP_OK_STATUS).json(talkerUpdate);
});

app.delete('/talker/:id', validateToken, async (req, res) => {
  const { id } = req.params;
 await talker.deleteTalker(Number(id));
 return res.status(204).send();
});
