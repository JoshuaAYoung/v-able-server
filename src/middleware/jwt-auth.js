const AuthService = require('../auth/auth-service');
const OrgService = require('../organizations/org-service');

function requireAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  bearerToken = authToken.slice(7, authToken.length);

  try {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithEmail(req.app.get('db'), payload.sub)
      .then((user) => {
        if (!user) {
          return res.status(401).json({ error: 'Unauthorized request' });
        }
        req.user = user;
        next();
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    res.status(401).json({ error: 'Unauthorized request' });
  }
}

function orgAuth(req, res, next) {
  const authToken = req.get('Authorization') || '';

  let bearerToken;
  if (!authToken.toLowerCase().startsWith('bearer ')) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  bearerToken = authToken.slice(7, authToken.length);

  try {
    const payload = AuthService.verifyJwt(bearerToken);

    AuthService.getUserWithEmail(req.app.get('db'), payload.sub)
      .then((user) => {
        if (!user) {
          console.log(user);
          return res.status(401).json({ error: 'Unauthorized request' });
        }
        OrgService.getOrgById(req.app.get('db'), user.user_id).then((org) => {
          req.org = org;
          next();
        });
        req.user = user;
      })
      .catch((err) => {
        console.error(err);
        next(err);
      });
  } catch (error) {
    console.log(error);
    res.status(401).json({ error: 'Unauthorized request' });
  }
}

module.exports = {
  requireAuth,
  orgAuth,
};
