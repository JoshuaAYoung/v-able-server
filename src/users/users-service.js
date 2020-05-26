const bcrypt = require('bcryptjs');
const REGEX_UPPER_LOWER_NUMBER = /^(?:(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).*)$/;

const UsersService = {
  hasUserWithEmail(db, email) {
    return db('users')
      .where({ email })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  insertOrg(db, newOrg) {
    return db
      .insert(newOrg)
      .into('organizations')
      .returning('*')
      .then(([org]) => org);
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be equal to or longer than 8 characters.';
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters.';
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces.';
    }
    if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
      return 'Password must contain an upper case letter, a lower case letter and a number.';
    }
    return null;
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
  deleteUser(db, user_id) {
    return db('users').where({ user_id }).delete();
  },
};

module.exports = UsersService;
