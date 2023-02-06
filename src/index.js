const express = require('express');
const talker = require('./talker');

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

app.get('/talker/:id', async (req, res) => {
  const { id } = req.params;
  const talk = await talker.getOneTalker(id);
  if (talk.id === undefined) {
     return res.status(404).json(talk);
  }
   return res.status(HTTP_OK_STATUS).json(talk);
});
