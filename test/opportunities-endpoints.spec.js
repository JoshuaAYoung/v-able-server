const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Opps Endpoints', function () {
  let db

  const {
    testUsers,
    testOpps,
    testReviews,
  } = helpers.makeOppsFixtures()

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

  describe(`GET /api/opps`, () => {
    context(`Given no opps`, () => {
      it(`responds with 200 and an empty list`, () => {
        return supertest(app)
          .get('/api/opps')
          .expect(200, [])
      })
    })

    context('Given there are opps in the database', () => {
      beforeEach('insert opps', () =>
        helpers.seedOppsTables(
          db,
          testUsers,
          testOpps,
          testReviews,
        )
      )

      it('responds with 200 and all of the opps', () => {
        const expectedOpps = testOpps.map(opp =>
          helpers.makeExpectedOpp(
            testUsers,
            opp,
            testReviews,
          )
        )
        return supertest(app)
          .get('/api/opps')
          .expect(200, expectedOpps)
      })
    })

    context(`Given an XSS attack opp`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousOpp,
        expectedOpp,
      } = helpers.makeMaliciousOpp(testUser)

      beforeEach('insert malicious opp', () => {
        return helpers.seedMaliciousOpp(
          db,
          testUser,
          maliciousOpp,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/opps`)
          .expect(200)
          .expect(res => {
            expect(res.body[0].title).to.eql(expectedOpp.title)
            expect(res.body[0].content).to.eql(expectedOpp.content)
          })
      })
    })
  })

  describe(`GET /api/opps/:opp_id`, () => {
    context(`Given no opps`, () => {
      it(`responds with 404`, () => {
        const oppId = 123456
        return supertest(app)
          .get(`/api/opps/${oppId}`)
          .expect(404, { error: `Opp doesn't exist` })
      })
    })

    context('Given there are opps in the database', () => {
      beforeEach('insert opps', () =>
        helpers.seedOppsTables(
          db,
          testUsers,
          testOpps,
          testReviews,
        )
      )

      it('responds with 200 and the specified opp', () => {
        const oppId = 2
        const expectedOpp = helpers.makeExpectedOpp(
          testUsers,
          testOpps[oppId - 1],
          testReviews,
        )

        return supertest(app)
          .get(`/api/opps/${oppId}`)
          .expect(200, expectedOpp)
      })
    })

    context(`Given an XSS attack opp`, () => {
      const testUser = helpers.makeUsersArray()[1]
      const {
        maliciousOpp,
        expectedOpp,
      } = helpers.makeMaliciousOpp(testUser)

      beforeEach('insert malicious opp', () => {
        return helpers.seedMaliciousOpp(
          db,
          testUser,
          maliciousOpp,
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/opps/${maliciousOpp.id}`)
          .expect(200)
          .expect(res => {
            expect(res.body.title).to.eql(expectedOpp.title)
            expect(res.body.content).to.eql(expectedOpp.content)
          })
      })
    })
  })

  describe(`GET /api/opps/:opp_id/reviews`, () => {
    context(`Given no opps`, () => {
      it(`responds with 404`, () => {
        const oppId = 123456
        return supertest(app)
          .get(`/api/opps/${oppId}/reviews`)
          .expect(404, { error: `Opp doesn't exist` })
      })
    })

    context('Given there are reviews for opp in the database', () => {
      beforeEach('insert opps', () =>
        helpers.seedOppsTables(
          db,
          testUsers,
          testOpps,
          testReviews,
        )
      )

      it('responds with 200 and the specified reviews', () => {
        const oppId = 1
        const expectedReviews = helpers.makeExpectedOppReviews(
          testUsers, oppId, testReviews
        )

        return supertest(app)
          .get(`/api/opps/${oppId}/reviews`)
          .expect(200, expectedReviews)
      })
    })
  })
})
