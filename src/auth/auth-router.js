const express = require('express');
const AuthService = require('./auth-service');
const authRouter = express.Router();
const jsonParser = express.json();

authRouter.post('/login', jsonParser, (req, res, next) => {
  const { email, password } = req.body;
  const loginuser = { email, password };

  for (const [key, value] of Object.entries(loginuser))
    if (value == null)
      return res.status(400).json({
        error: `Missing ${key} in request body`,
      });

  AuthService.getUserWithEmail(req.app.get('db'), loginuser.email.toLowerCase())
    .then((dbUser) => {
      if (!dbUser) {
        return res.status(400).json({ error: 'Incorrect Email or Password' });
      }
      return AuthService.comparePasswords(
        loginuser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch) {
          return res.status(400).json({ error: 'Incorrect Email or Password' });
        }
        const subject = dbUser.email;
        const payload = { user_id: dbUser.user_id };
        res.send({
          authToken: AuthService.createJwt(subject, payload),
          userType: dbUser.user_type,
          user: {
            user_id: dbUser.user_id,
            email: dbUser.email,
            full_name: dbUser.full_name,
            date_created: dbUser.date_created,
          },
        });
      });
    })
    .catch(next);
});

module.exports = authRouter;
