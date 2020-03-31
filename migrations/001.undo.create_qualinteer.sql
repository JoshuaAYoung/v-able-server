ALTER TABLE applications DROP CONSTRAINT applications_fk1;
ALTER TABLE applications DROP CONSTRAINT applications_fk0;
ALTER TABLE opportunities DROP CONSTRAINT opportunities_fk0;
ALTER TABLE organizations DROP CONSTRAINT organizations_fk0;

DROP TABLE IF EXISTS applications;
DROP TABLE IF EXISTS opportunities;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS users;

DROP TYPE IF EXISTS ed_types;
