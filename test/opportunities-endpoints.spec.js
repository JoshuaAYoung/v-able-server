const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Opportunities Endpoints', function () {
  let db

  const {
    testUsers,
    testOrganizations,
    testOpportunities
  } = helpers.makeOpportunitiesFixtures()

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

  describe(`GET /api/opportunities`, () => {
    context(`Given no opportunities`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/opportunities')
          .expect(200, [])
      })
    })

    context('Given there are opportunities in the database', () => {
      beforeEach('insert opportunities', () =>
        helpers.seedOpportunitiesTables(
          db,
          testUsers,
          testOrganizations,
          testOpportunities
        )
      )

      it('responds with 200 and all of the opportunities', () => {
        const expectedOpportunities = testOpportunities.map(opportunity =>
          helpers.makeExpectedOpportunity(
            opportunity,
            testOrganizations
          )
        )
        return supertest(app)
          .get('/api/opportunities')
          .expect(200, expectedOpportunities)
      })
    })

    context(`Given an XSS attack opportunity`, () => {
      const {
        maliciousOpportunity,
        expectedOpportunity,
      } = helpers.makeMaliciousOpportunity(testOrganizations)

      beforeEach('insert malicious opportunity', () => {
        return helpers.seedMaliciousOpportunity(
          db,
          testUsers,
          testOrganizations,
          maliciousOpportunity,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/opportunities`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedOpportunity.title)
            expect(res.body[0].content).to.eql(expectedOpportunity.content)
          })
      })
    })
  })

  describe(`GET /api/opportunities/:opportunity_id`, () => {
    context(`Given no opportunities`, () => {
      it(`responds with 404`, () => {
        const oppId = 123456
        return supertest(app)
          .get(`/api/opportunities/${oppId}`)
          .expect(404, { error: `Opportunity doesn't exist` })
      })
    })

    context('Given there are opportunities in the database', () => {
      beforeEach('insert opportunities', () =>
        helpers.seedOpportunitiesTables(
          db,
          testUsers,
          testOrganizations,
          testOpportunities
        )
      )

      it('responds with 200 and the specified opp', () => {
        const opportunityId = 2
        const expectedOpportunity = helpers.makeExpectedOppById(
          testOpportunities[opportunityId - 1],
          testOrganizations
        )

        return supertest(app)
          .get(`/api/opportunities/${opportunityId}`)
          .expect(200, expectedOpportunity)
      })
    })
  })
})