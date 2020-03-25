const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Opportunities Endpoints', function () {
  let db

  const {
    testUsers,
    testOpportunities,
    testReviews,
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
          testOpportunities,
          testReviews,
        )
      )

      it('responds with 200 and all of the opportunities', () => {
        const expectedOpportunities = testOpportunities.map(opportunity =>
          helpers.makeExpectedOpportunity(
            testUsers,
            opportunity,
            testReviews,
          )
        )
        return supertest(app)
          .get('/api/opportunities')
          .expect(200, expectedOpportunities)
      })
    })

    context(`Given an XSS attack opportunity`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousOpportunity,
        expectedOpportunity,
      } = helpers.makeMaliciousOpportunity(testUser)

      beforeEach('insert malicious opportunity', () => {
        return helpers.seedMaliciousOpportunity(
          db,
          testUser,
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
        const opportunityId = 123456
        return supertest(app)
          .get(`/api/opportunities/${opportunityId}`)
          .expect(404, { error: `Opportunity doesn't exist` })
      })
    })

    context('Given there are opportunities in the database', () => {
      beforeEach('insert opportunities', () =>
        helpers.seedOpportunitiesTables(
          db,
          testUsers,
          testOpportunities,
          testReviews,
        )
      )

      it('responds with 200 and the specified opportunity', () => {
        const opportunityId = 2
        const expectedOpportunity = helpers.makeExpectedOpportunity(
          testUsers,
          testOpportunities[opportunityId - 1],
          testReviews,
        )

        return supertest(app)
          .get(`/api/opportunities/${opportunityId}`)
          .expect(200, expectedOpportunity)
      })
    })

    context(`Given an XSS attack opportunity`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousOpportunity,
        expectedOpportunity,
      } = helpers.makeMaliciousOpportunity(testUser)

      beforeEach('insert malicious opportunity', () => {
        return helpers.seedMaliciousOpportunity(
          db,
          testUser,
          maliciousOpportunity,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/opportunities/${maliciousOpportunity.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedOpportunity.title)
            expect(res.body.content).to.eql(expectedOpportunity.content)
          })
      })
    })
  })

  describe(`GET /api/opportunities/:opportunity_id/reviews`, () => {
    context(`Given no opportunities`, () => {
      it(`responds with 404`, () => {
        const opportunityId = 123456
        return supertest(app)
          .get(`/api/opportunities/${opportunityId}/reviews`)
          .expect(404, { error: `Opportunity doesn't exist` })
      })
    })

    context('Given there are reviews for opportunity in the database', () => {
      beforeEach('insert opportunities', () =>
        helpers.seedOpportunitiesTables(
          db,
          testUsers,
          testOpportunities,
          testReviews,
        )
      )

      it('responds with 200 and the specified reviews', () => {
        const opportunityId = 1
        const expectedReviews = helpers.makeExpectedOpportunityReviews(
          testUsers, opportunityId, testReviews
        )

        return supertest(app)
          .get(`/api/opportunities/${opportunityId}/reviews`)
          .expect(200, expectedReviews)
      })
    })
  })
})
