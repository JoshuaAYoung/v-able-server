const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Organizations Endpoints', function () {
  let db

  const { testOrganizations, testUsers } = helpers.makeOpportunitiesFixtures()

  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe(`POST /api/organizations`, () => {
    context(`User Validation`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )
      beforeEach('insert organizations', () =>
        helpers.seedOrganizations(
          db,
          testOrganizations,
        )
      )

      const requiredFields = ['usr_id', 'name', 'address', 'city', 'state', 'zipcode']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          usr_id: 1,
          name: 'test name',
          address: '123 Fourth Ave',
          city: 'Denver',
          state: 'CO',
          zipcode: 80000
        }

        it(`responds with 400 required error when '${field}' is missing`, () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/organizations')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing '${field}' in request body`,
            })
        })
      })

    })
    context(`Happy path`, () => {
      beforeEach('insert users', () =>
        helpers.seedUsers(
          db,
          testUsers,
        )
      )
      it(`responds 201, serialized organization`, () => {
        const newOrganization = {
          usr_id: 1,
          name: 'test name',
          address: '123 Fourth Ave',
          city: 'Denver',
          state: 'CO',
          zipcode: 80000
        }
        return supertest(app)
          .post('/api/organizations')
          .send(newOrganization)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('organization_id')
            expect(res.body.user_id).to.eql(newOrganization.user_id)
            expect(res.body.name).to.eql(newOrganization.name)
            expect(res.body.address).to.eql(newOrganization.address)
            expect(res.body.city).to.eql(newOrganization.city)
            expect(res.body.state).to.eql(newOrganization.state)
            expect(res.body.zipcode).to.eql(newOrganization.zipcode.toString())
          })
          .expect(res =>
            db
              .from('organizations')
              .select('*')
              .where({ organization_id: res.body.organization_id })
              .first()
              .then(row => {
                expect(row.user_id).to.eql(newOrganization.user_id)
                expect(row.name).to.eql(newOrganization.name)
                expect(row.address).to.eql(newOrganization.address)
                expect(row.city).to.eql(newOrganization.city)
                expect(row.state).to.eql(newOrganization.state)
                expect(row.zipcode).to.eql(newOrganization.zipcode)
              })
          )
      })
    })
  })
})
