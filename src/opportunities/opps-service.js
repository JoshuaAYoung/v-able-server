const OppsService = {
  getAllOpps(db, ) {
    return db
      .from('opportunities AS opp')
      .select(
        'opp.opportunity_id',
        'opp.org_id',
        'opp.title',
        'opp.description',
        'opp.contact',
        'opp.posted',
        'org.usr_id',
        'org.name',
        'org.address',
        'org.city',
        'org.state',
        'org.zipcode',
        'org.website'
      )
      .leftJoin(
        'organizations AS org',
        'opp.org_id',
        'org.organization_id'
      )
  },
  getById(db, id) {
    return db
      .from('opportunities AS opp')
      .select('*')
      .leftJoin(
        'organizations AS org',
        'opp.org_id',
        'org.organization_id'
      )
      .where('opp.opportunity_id', id)
      .first()
  },
  insertOpp(db, newOpp) {
    return db
      .insert(newOpp)
      .into('opportunities')
      .returning('*')
      .then(([opp]) => opp)
      .then(opp =>
        OppsService.getById(db, opp.opportunity_id)
      )
  }
}

module.exports = OppsService
