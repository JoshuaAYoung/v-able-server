const xss = require('xss')
const Treeize = require('treeize')

const OpportunitiesService = {
  getAllOpportunities(db) {
    return db
      .from('qualinteer_opportunities AS thg')
      .select(
        'thg.id',
        'thg.title',
        'thg.date_created',
        'thg.content',
        'thg.image',
        ...userFields,
        db.raw(
          `count(DISTINCT rev) AS number_of_reviews`
        ),
        db.raw(
          `AVG(rev.rating) AS average_review_rating`
        ),
      )
      .leftJoin(
        'qualinteer_reviews AS rev',
        'thg.id',
        'rev.opportunity_id',
      )
      .leftJoin(
        'qualinteer_users AS usr',
        'thg.user_id',
        'usr.id',
      )
      .groupBy('thg.id', 'usr.id')
  },

  getById(db, id) {
    return OpportunitiesService.getAllOpportunities(db)
      .where('thg.id', id)
      .first()
  },

  getReviewsForOpportunity(db, opportunity_id) {
    return db
      .from('qualinteer_reviews AS rev')
      .select(
        'rev.id',
        'rev.rating',
        'rev.text',
        'rev.date_created',
        ...userFields,
      )
      .where('rev.opportunity_id', opportunity_id)
      .leftJoin(
        'qualinteer_users AS usr',
        'rev.user_id',
        'usr.id',
      )
      .groupBy('rev.id', 'usr.id')
  },

  serializeOpportunities(opportunities) {
    return opportunities.map(this.serializeOpportunity)
  },

  serializeOpportunity(opportunity) {
    const opportunityTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const opportunityData = opportunityTree.grow([opportunity]).getData()[0]

    return {
      id: opportunityData.id,
      title: xss(opportunityData.title),
      content: xss(opportunityData.content),
      date_created: opportunityData.date_created,
      image: opportunityData.image,
      user: opportunityData.user || {},
      number_of_reviews: Number(opportunityData.number_of_reviews) || 0,
      average_review_rating: Math.round(opportunityData.average_review_rating) || 0,
    }
  },

  serializeOpportunityReviews(reviews) {
    return reviews.map(this.serializeOpportunityReview)
  },

  serializeOpportunityReview(review) {
    const reviewTree = new Treeize()

    // Some light hackiness to allow for the fact that `treeize`
    // only accepts arrays of objects, and we want to use a single
    // object.
    const reviewData = reviewTree.grow([review]).getData()[0]

    return {
      id: reviewData.id,
      rating: reviewData.rating,
      opportunity_id: reviewData.opportunity_id,
      text: xss(reviewData.text),
      user: reviewData.user || {},
      date_created: reviewData.date_created,
    }
  },
}

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.full_name AS user:full_name',
  'usr.nickname AS user:nickname',
  'usr.date_created AS user:date_created',
  'usr.date_modified AS user:date_modified',
]

module.exports = OpportunitiesService
