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

  module.exports = validatePasswordType;