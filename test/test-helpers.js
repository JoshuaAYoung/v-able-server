const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray() {
  return [
    {
      user_id: 1,
      email: 'test-user-1@email.com',
      password: 'password',
      full_name: 'Test user 1',
      user_type: 'organization',
      date_created: new Date('2029-01-22T07:00:00.000Z'),
    },
    {
      user_id: 2,
      email: 'test-user-2@email.com',
      password: 'password',
      full_name: 'Test user 2',
      user_type: 'organization',
      date_created: new Date('2029-01-22T07:00:00.000Z'),
    },
    {
      user_id: 3,
      email: 'test-user-3@email.com',
      password: 'password',
      full_name: 'Test user 3',
      user_type: 'volunteer',
      date_created: new Date('2029-01-22T07:00:00.000Z'),
    },
    {
      user_id: 4,
      email: 'test-user-4@email.com',
      password: 'password',
      full_name: 'Test user 4',
      user_type: 'volunteer',
      date_created: new Date('2029-01-22T07:00:00.000Z'),
    },
  ]
}

function makeOrganizationsArray() {
  return [
    {
      organization_id: 1,
      usr_id: 1,
      name: 'test org 1',
      address: 'test address 1',
      city: 'test city 1',
      state: 'test state 1',
      zipcode: 80000,
      phone: '5555555555',
      website: 'testwebsite1.com'
    },
    {
      organization_id: 2,
      usr_id: 2,
      name: 'test org 2',
      address: 'test address 2',
      city: 'test city 2',
      state: 'test state 2',
      zipcode: 80000,
      phone: '5555555555',
      website: 'testwebsite2.com'
    },
    {
      organization_id: 3,
      usr_id: 3,
      name: 'test org 3',
      address: 'test address 3',
      city: 'test city 3',
      state: 'test state 3',
      zipcode: 80000,
      phone: '5555555555',
      website: 'testwebsite3.com'
    },
    {
      organization_id: 4,
      usr_id: 4,
      name: 'test org 4',
      address: 'test address 4',
      city: 'test city 4',
      state: 'test state 4',
      zipcode: 80000,
      phone: '5555555555',
      website: 'testwebsite4.com'
    }
  ]
}

function makeOpportunitiesArray() {
  return [
    {
      opportunity_id: 1,
      org_id: 1,
      title: 'Test Title 1',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      contact: 'testcontact1@email.com',
      start_date: 'ASAP',
      duration: 'test duration 1',
      commitment: 'test commitment 1',
      ed_level: 'none',
      experience: 'test experience 1',
      license: 'test license 1',
      remote: false,
      posted: new Date('2029-01-22T07:00:00.000Z'),
    },
    {
      opportunity_id: 2,
      org_id: 2,
      title: 'Test Title 2',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      contact: 'testcontact2@email.com',
      start_date: 'ASAP',
      duration: 'test duration 2',
      commitment: 'test commitment 2',
      ed_level: 'none',
      experience: 'test experience 2',
      license: 'test license 2',
      remote: false,
      posted: new Date('2029-01-22T07:00:00.000Z'),
    },
    {
      opportunity_id: 3,
      org_id: 3,
      title: 'Test Title 3',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      contact: 'testcontact3@email.com',
      start_date: 'ASAP',
      duration: 'test duration 3',
      commitment: 'test commitment 3',
      ed_level: 'none',
      experience: 'test experience 3',
      license: 'test license 3',
      remote: false,
      posted: new Date('2029-01-22T07:00:00.000Z'),
    },
    {
      opportunity_id: 4,
      org_id: 4,
      title: 'Test Title 4',
      description: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus consequuntur deserunt commodi, nobis qui inventore corrupti iusto aliquid debitis unde non.Adipisci, pariatur.Molestiae, libero esse hic adipisci autem neque ?',
      contact: 'testcontact4@email.com',
      start_date: 'ASAP',
      duration: 'test duration 4',
      commitment: 'test commitment 4',
      ed_level: 'none',
      experience: 'test experience 4',
      license: 'test license 4',
      remote: false,
      posted: new Date('2029-01-22T07:00:00.000Z'),
    }
  ]
}

function makeExpectedOppById(opportunity, organizations) {
  const organization = organizations.find(org => org.organization_id === opportunity.org_id)
  return {
    opportunity_id: opportunity.opportunity_id,
    org_id: opportunity.org_id,
    title: opportunity.title,
    description: opportunity.description,
    contact: opportunity.contact,
    posted: opportunity.posted.toISOString(),
    start_date: opportunity.start_date,
    duration: opportunity.duration,
    commitment: opportunity.commitment,
    ed_level: opportunity.ed_level,
    experience: opportunity.experience,
    license: opportunity.license,
    phone: organization.phone,
    usr_id: organization.usr_id,
    name: organization.name,
    address: organization.address,
    city: organization.city,
    state: organization.state,
    zipcode: organization.zipcode,
    website: organization.website
  }
}

function makeExpectedOpportunity(opportunity, organizations) {
  const organization = organizations.find(org => org.organization_id === opportunity.org_id)
  return {
    opportunity_id: opportunity.opportunity_id,
    org_id: opportunity.org_id,
    title: opportunity.title,
    description: opportunity.description,
    posted: opportunity.posted.toISOString(),
    usr_id: organization.usr_id,
    name: organization.name,
    city: organization.city,
    state: organization.state,
    zipcode: organization.zipcode
  }
}

function makeMaliciousOpportunity(organizations) {
  const maliciousOpportunity = {
    opportunity_id: 911,
    org_id: 2,
    title: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
    description: 'Naughty naughty very naughty <script>alert("xss");</script>',
    contact: 'xsstestcontact@email.com',
    start_date: 'ASAP',
    duration: 'xss test duration 4',
    commitment: 'xss test commitment',
    ed_level: 'none',
    experience: 'none',
    remote: false,
    posted: new Date(),
  }
  const expectedOpportunity = {
    ...makeExpectedOpportunity(maliciousOpportunity, organizations),
    description: 'Naughty naughty very naughty &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
    title: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
  }
  return {
    maliciousOpportunity,
    expectedOpportunity,
  }
}

function makeOpportunitiesFixtures() {
  const testUsers = makeUsersArray()
  const testOrganizations = makeOrganizationsArray()
  const testOpportunities = makeOpportunitiesArray()
  return { testUsers, testOrganizations, testOpportunities }
}

function cleanTables(db) {
  return db.transaction(trx =>
    trx.raw(
      `TRUNCATE
        applications,
        opportunities,
        organizations,
        users
        RESTART IDENTITY CASCADE
      `
    )
  )
}

function seedUsers(db, users) {
  const preppedUsers = users.map(user => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1)
  }))
  return db.into('users').insert(preppedUsers)
}

function seedOrganizations(db, organizations) {
  return db.into('organizations').insert(organizations)
}

function seedOpportunitiesTables(db, users, organizations, opportunities) {
  // use a transaction to group the queries and auto rollback on any failure
  return db.transaction(async trx => {
    await seedUsers(trx, users)
    await seedOrganizations(trx, organizations)
    await trx.into('opportunities').insert(opportunities)
  })
}

function seedMaliciousOpportunity(db, users, organizations, opportunity) {
  return db
    .into('users')
    .insert(users)
    .then(() =>
      db
        .into('organizations')
        .insert(organizations)
    )
    .then(() =>
      db
        .into('opportunities')
        .insert([opportunity])
    )
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
  const token = jwt.sign({ user_id: user.user_id }, secret, {
    subject: user.email,
    algorithm: 'HS256',
  })
  return `Bearer ${token}`
}

module.exports = {
  makeUsersArray,
  makeOpportunitiesArray,
  makeOrganizationsArray,
  makeExpectedOppById,
  makeExpectedOpportunity,
  makeMaliciousOpportunity,
  makeOpportunitiesFixtures,
  cleanTables,
  seedOpportunitiesTables,
  seedOrganizations,
  seedMaliciousOpportunity,
  makeAuthHeader,
  seedUsers,
}
