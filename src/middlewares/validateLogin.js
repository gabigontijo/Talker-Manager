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

  module.exports = validateLogin;