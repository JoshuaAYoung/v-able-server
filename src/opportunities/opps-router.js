const express = require('express')
const OppsService = require('./opps-service.js')
const { orgAuth } = require('../middleware/jwt-auth')
const oppsRouter = express.Router()
const xss = require('xss')
const jsonParser = express.json();


const removeNulls = obj => {
  const newObj = {};
  for (key in obj) {
    if (!!obj[key]) {
      newObj[key] = obj[key]
    }
  }
  return newObj
}

const scrubOpp = opp => (
  removeNulls({
    opportunity_id: opp.opportunity_id,
    org_id: opp.org_id,
    title: xss(opp.title),
    description: xss(opp.description),
    contact: xss(opp.contact),
    posted: new Date(opp.posted),
    start_date: xss(opp.start_date),
    duration: xss(opp.duration),
    commitment: xss(opp.commitment),
    ed_level: opp.ed_level,
    experience: xss(opp.experience),
    license: xss(opp.license),
    remote: opp.remote,
    phone: xss(opp.phone),
    usr_id: opp.usr_id,
    name: xss(opp.name),
    address: xss(opp.address),
    city: xss(opp.city),
    state: xss(opp.state),
    zipcode: opp.zipcode,
    website: xss(opp.website)
  })
)

oppsRouter
  .route('/')
  .get((req, res, next) => {
    OppsService.getAllOpps(req.app.get('db'))
      .modify(function (queryBuilder) {
        if (req.query.searchTerm) {
          queryBuilder
            .where('description', 'ilike', `%${req.query.searchTerm}%`)
            .orWhere('title', 'ilike', `%${req.query.searchTerm}%`)
            .orWhere('name', 'ilike', `%${req.query.searchTerm}%`)
            .orWhere('city', 'ilike', `%${req.query.searchTerm}%`)
            .orWhere('state', 'ilike', `%${req.query.searchTerm}%`)
        }
      })
      .then(opps => {
        res.json(opps.map(scrubOpp))
      })
      .catch(next)
  })
  .post(orgAuth, jsonParser, (req, res, next) => {
    const { title, description, contact, start_date, duration, commitment, ed_level, experience, license, remote, posted } = req.body;
    const org_id = req.org.organization_id
    for (const field of ['title', 'description', 'contact', 'start_date', 'duration', 'commitment', 'ed_level', 'posted'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const newOpp = {
      org_id,
      title,
      description,
      contact,
      start_date,
      duration,
      commitment,
      ed_level,
      experience,
      license,
      remote,
      posted
    }

    OppsService.insertOpp(
      req.app.get('db'),
      newOpp
    )
      .then(opp => {
        res
          .status(201)
          .json(scrubOpp(opp))
      })
      .catch(next)
  })

oppsRouter
  .route('/:id')
  .all(checkOppExists)
  .get((req, res) => {
    res.json(scrubOpp(res.opp))
  })

async function checkOppExists(req, res, next) {
  try {
    const opp = await OppsService.getById(
      req.app.get('db'),
      req.params.id
    )

    if (!opp)
      return res.status(404).json({
        error: `Opp doesn't exist`
      })

    res.opp = opp
    next()
  }
  catch (error) {
    next(error)
  }
}

module.exports = oppsRouter
