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

const validateLogin = (req, res, next) => {
  const requiredProperties = ['email', 'password'];
  if (requiredProperties.every((property) => property in req.body)) {
    next();
  } if (!req.body.email) {
   return res.status(400).json({
      message: 'O campo "email" é obrigatório',
    });
  }
  if (!req.body.password) {
    return res.status(400).json({
       message: 'O campo "password" é obrigatório',
     });
   }
};

const validateEmailType = (req, res, next) => {
  const { email } = req.body;
    if (/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    next();
  } else {
    res.status(400).json({
      message: 'O "email" deve ter o formato "email@email.com"',
    });
  }
};

const validatePasswordType = (req, res, next) => {
  const { password } = req.body;
    if (password.length >= 6) {
    next();
  } else {
    return res.status(400).json({
      message: 'O "password" deve ter pelo menos 6 caracteres',
    }); 
  }
};

app.post('/login', validateLogin, validateEmailType, validatePasswordType,
 (_req, res) => res.status(HTTP_OK_STATUS).json({ token: talker.randomToken(16) }));
