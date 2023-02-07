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

 const validateToken = (req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return res.status(401).json({
      message: 'Token não encontrado',
    });
  }
  if (token.length !== 16 || (typeof token) !== 'string') {
    return res.status(401).json({
      message: 'Token inválido',
    });
  }
 return next();
 };

 const validateName = (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({
      message: 'O campo "name" é obrigatório',
    });
  }
  if (name.length < 3) {
    return res.status(400).json({
      message: 'O "name" deve ter pelo menos 3 caracteres',
    });
  }
  return next();
 };

 const validateAge1 = (req, res, next) => {
  const { age } = req.body;
  if (!age) {
    return res.status(400).json({
      message: 'O campo "age" é obrigatório',
    });
  }
  if (typeof age !== 'number') {
    return res.status(400).json({
      message: 'O campo "age" deve ser do tipo "number"',
    });
  }
  return next();
 };

 const validateAge2 = (req, res, next) => {
  const { age } = req.body;

  if (!Number.isInteger(age)) {
    return res.status(400).json({
      message: 'O campo "age" deve ser um "number" do tipo inteiro',
    });
  }
  if (age < 18) {
    return res.status(400).json({
      message: 'A pessoa palestrante deve ser maior de idade',
    });
  }
  return next();
 };

 const validateTalk = (req, res, next) => {
  const { talk } = req.body;
  if (!talk) {
 return res.status(400).json({
  message: 'O campo "talk" é obrigatório',
});
  }
  return next();
 };

 const validateTalkWatchedAt = (req, res, next) => {
  const { watchedAt } = req.body.talk;
  console.log(watchedAt);
  if (!watchedAt) {
    return res.status(400).json({
      message: 'O campo "watchedAt" é obrigatório',
    });
  }
    if (!talker.validateDate(watchedAt)) {
      return res.status(400).json({
        message: 'O campo "watchedAt" deve ter o formato "dd/mm/aaaa"',
      });
    }

  return next();
 };

 const checkRate = (rate) => (rate === 1 || rate === 2 || rate === 3 || rate === 4 || rate === 5);

 const validateTalkRate = (req, res, next) => {
  const { rate } = req.body.talk;

  if (rate === undefined) {
    return res.status(400).json({
      message: 'O campo "rate" é obrigatório',
    });
  }
  if (!(checkRate(rate)) || rate === 0) {
    return res.status(400).json({
      message: 'O campo "rate" deve ser um inteiro de 1 à 5',
      });
  }
  return next();
 };

 app.post('/talker', validateToken, validateName, validateAge1, validateAge2,
 validateTalk, validateTalkWatchedAt, validateTalkRate, async (req, res) => {
  const talkerBody = req.body;
  const newTalker = await talker.writeTalkerFile(talkerBody);
  res.status(201).json(newTalker);
 });
