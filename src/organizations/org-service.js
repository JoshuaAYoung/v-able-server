const OrgService = {
  insertOrg(db, newOrg) {
    return db
      .insert(newOrg)
      .into('organizations')
      .returning('*')
      .then(([org]) => org);
  },
  getOrgById(db, usr_id) {
    return db.from('organizations').select('*').where({ usr_id }).first();
  },
};

module.exports = OrgService;
