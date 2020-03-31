const bcrypt = require('bcryptjs')
const REGEX_UPPER_LOWER_NUMBER_SPECIAL = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&])[\S]/

const UsersService = {
  hasUserWithEmail(db, email) {
    return db('users')
      .where({ email })
      .first()
      .then(user => !!user)
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user)
  },
  insertOrg(db, newOrg) {
    return db
      .insert(newOrg)
      .into('organizations')
      .returning('*')
      .then(([org]) => org)
  },
  validatePassword(password) {
    if (password.length < 8) {
      return 'Password must be equal to or longer than 8 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER_SPECIAL.test(password)) {
      return 'Password must contain 1 upper case, lower case, number and special character'
    }
    return null
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },
  deleteUser(db, user_id) {
    return db('users')
      .where({ user_id })
      .delete()
  }
}

module.exports = UsersService