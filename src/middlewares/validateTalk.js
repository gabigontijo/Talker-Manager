const talker = require('../utils');

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

   module.exports = {
    validateTalk,
    validateTalkRate,
    validateTalkWatchedAt,
   };