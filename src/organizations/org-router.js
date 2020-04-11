const express = require('express')
const orgRouter = express.Router()
const jsonParser = express.json()
const OrgService = require('./org-service')
const xss = require('xss')

scrubOrg = org => (
  {
    organization_id: org.organization_id,
    usr_id: org.usr_id,
    name: xss(org.name),
    address: xss(org.address),
    city: xss(org.city),
    state: xss(org.state),
    zipcode: xss(org.zipcode),
    phone: xss(org.phone),
    website: xss(org.website)
  }
)

orgRouter
  .post('/', jsonParser, (req, res, next) => {
    const { usr_id, name, address, city, state, zipcode, phone, website } = req.body

    for (const field of ['usr_id', 'name', 'address', 'city', 'state', 'zipcode'])
      if (!req.body[field])
        return res.status(400).json({
          error: `Missing '${field}' in request body`
        })

    const newOrg = {
      usr_id,
      name,
      address,
      city,
      state,
      zipcode,
      phone,
      website
    }

    OrgService.insertOrg(
      req.app.get('db'),
      newOrg
    )
      .then(org => {
        res
          .status(201)
          .json(scrubOrg(org))
      })
      .catch(next)
  })

module.exports = orgRouter