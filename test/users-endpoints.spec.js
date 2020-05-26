const knex = require('knex');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users Endpoints', function () {
  let db;

  const { testUsers } = helpers.makeOpportunitiesFixtures();
  const testUser = testUsers[3];

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    });
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  describe(`POST /api/users`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () => helpers.seedUsers(db, testUsers));

      const requiredFields = ['email', 'password', 'full_name', 'user_type'];

      requiredFields.forEach((field) => {
        const registerAttemptBody = {
          email: 'testemail@email.com',
          password: 'testP4ssword',
          full_name: 'test full_name',
          user_type: 'organization',
        };

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field];

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            });
        });
      });

      it(`responds 400 'Password must be equal to or longer than 8 characters.' when empty password`, () => {
        const userShortPassword = {
          email: 'testemail@email.com',
          password: 'P4sswrd',
          full_name: 'test full_name',
          user_type: 'organization',
        };
        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, {
            error: `Password must be equal to or longer than 8 characters.`,
          });
      });

      it(`responds 400 'Password must be less than 72 characters.' when long password`, () => {
        const userLongPassword = {
          email: 'testemail@email.com',
          password: '*'.repeat(73),
          full_name: 'test full_name',
          user_type: 'organization',
        };
        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: `Password must be less than 72 characters.` });
      });

      it(`responds 400 error when password starts with spaces`, () => {
        const userPasswordStartsSpaces = {
          email: 'testemail@email.com',
          password: ' 1Aa!2Bb@',
          full_name: 'test full_name',
          user_type: 'organization',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordStartsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces.`,
          });
      });

      it(`responds 400 error when password ends with spaces`, () => {
        const userPasswordEndsSpaces = {
          email: 'testemail@email.com',
          password: '1Aa!2Bb@ ',
          full_name: 'test full_name',
          user_type: 'organization',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordEndsSpaces)
          .expect(400, {
            error: `Password must not start or end with empty spaces.`,
          });
      });

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          email: 'testemail@email.com',
          password: '11aaaaaaa',
          full_name: 'test full_name',
          user_type: 'organization',
        };
        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, {
            error: `Password must contain an upper case letter, a lower case letter and a number.`,
          });
      });

      it(`responds 400 'User with that email address already exists in our system.' when email isn't unique`, () => {
        const duplicateUser = {
          email: testUser.email,
          password: '11AAaa!!',
          full_name: 'test full_name',
          user_type: 'organization',
        };
        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, {
            error: `User with that email address already exists in our system.`,
          });
      });
    });
  });
  context(`Happy path`, () => {
    it(`responds 201, serialized user`, () => {
      const newUser = {
        email: 'testemail@email.com',
        password: 'P4ssword',
        full_name: 'test full_name',
        user_type: 'volunteer',
      };
      return supertest(app)
        .post('/api/users')
        .send(newUser)
        .expect(201)
        .expect((res) => {
          expect(res.body.user).to.have.property('user_id');
          expect(res.body.user.email).to.eql(newUser.email);
          expect(res.body.user.full_name).to.eql(newUser.full_name);
          expect(res.body.user).to.not.have.property('password');
        })
        .expect((res) =>
          db
            .from('users')
            .select('*')
            .where({ user_id: res.body.user.user_id })
            .first()
            .then((row) => {
              expect(row.email).to.eql(newUser.email);
              expect(row.full_name).to.eql(newUser.full_name);
            })
        );
    });
  });
});
