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

  module.exports = validateEmailType;