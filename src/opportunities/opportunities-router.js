const express = require('express')
const OpportunitiesService = require('./opportunities-service')
const { requireAuth } = require('../middleware/jwt-auth')
const opportunitiesRouter = express.Router()

opportunitiesRouter
  .route('/')
  .get((req, res, next) => {
    OpportunitiesService.getAllOpportunities(req.app.get('db'))
      .then(opportunities => {
        res.json(OpportunitiesService.serializeOpportunities(opportunities))
      })
      .catch(next)
  })

opportunitiesRouter
  .route('/:opportunity_id')
  .all(requireAuth)
  .all(checkOpportunityExists)
  .get((req, res) => {
    res.json(OpportunitiesService.serializeOpportunity(res.opportunity))
  })

opportunitiesRouter.route('/:opportunity_id/reviews/')
  .all(requireAuth)
  .all(checkOpportunityExists)
  .get((req, res, next) => {
    OpportunitiesService.getReviewsForOpportunity(
      req.app.get('db'),
      req.params.opportunity_id
    )
      .then(reviews => {
        res.json(OpportunitiesService.serializeOpportunityReviews(reviews))
      })
      .catch(next)
  })

/* async/await syntax for promises */
async function checkOpportunityExists(req, res, next) {
  try {
    const opportunity = await OpportunitiesService.getById(
      req.app.get('db'),
      req.params.opportunity_id
    )

    if (!opportunity)
      return res.status(404).json({
        error: `Opportunity doesn't exist`
      })

    res.opportunity = opportunity
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = opportunitiesRouter
