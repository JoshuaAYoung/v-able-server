const express = require('express');
const usersRouter = express.Router();
const jsonParser = express.json();
const UsersService = require('./users-service');
const xss = require('xss');

const scrubUser = (user) => ({
  user_id: user.user_id,
  email: xss(user.email),
  full_name: xss(user.full_name),
  user_type: user.user_type,
  date_created: new Date(user.date_created),
});

const scrubOrg = (org) => ({
  organization_id: org.organization_id,
  usr_id: org.usr_id,
  name: xss(org.name),
  address: xss(org.address),
  city: xss(org.city),
  state: xss(org.state),
  zipcode: xss(org.zipcode),
  phone: xss(org.phone),
  website: xss(org.website),
});

function postOrg(req, res) {
  const {
    usr_id,
    name,
    address,
    city,
    state,
    zipcode,
    phone,
    website,
  } = req.body;

  for (const field of ['usr_id', 'name', 'city', 'state', 'zipcode'])
    if (!req.body[field]) {
      return UsersService.deleteUser(req.app.get('db'), req.body.usr_id).then(
        (data) => {
          return res.status(400).json({
            error: `Missing '${field}' in request body`,
          });
        }
      );
    }
  const newOrg = {
    usr_id,
    name,
    address,
    city,
    state,
    zipcode,
    phone,
    website,
  };
  return UsersService.insertOrg(req.app.get('db'), newOrg).catch((err) => {
    return UsersService.deleteUser(req.app.get('db'), req.body.usr_id).then(
      (data) => {
        throw err;
      }
    );
  });
}

usersRouter.post('/', jsonParser, (req, res, next) => {
  const { email, password, full_name, user_type } = req.body;
  for (const field of ['email', 'password', 'full_name', 'user_type'])
    if (!req.body[field])
      return res.status(400).json({
        error: `Missing '${field}' in request body`,
      });

  const passwordError = UsersService.validatePassword(password);

  if (passwordError) return res.status(400).json({ error: passwordError });

  UsersService.hasUserWithEmail(req.app.get('db'), email)
    .then((hasUserWithEmail) => {
      if (hasUserWithEmail)
        return res.status(400).json({
          error: `User with that email address already exists in our system.`,
        });

      return UsersService.hashPassword(password).then((hashedPassword) => {
        const newUser = {
          email,
          password: hashedPassword,
          full_name,
          user_type,
          date_created: 'now()',
        };
        let createdUser;
        return UsersService.insertUser(req.app.get('db'), newUser)
          .then((user) => {
            createdUser = user;
            req.body.usr_id = user.user_id;
            return req.body.user_type === 'organization'
              ? postOrg(req, res)
              : null;
          })
          .then((org) => {
            if (res.headersSent) {
              return;
            }
            res.status(201).json({
              user: scrubUser(createdUser),
              org: org ? scrubOrg(org) : null,
            });
          });
      });
    })
    .catch(next);
});

module.exports = usersRouter;
