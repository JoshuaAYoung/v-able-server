BEGIN;

  CREATE TYPE ed_types AS ENUM
  (
  'none',
  'highschool',
  'associates',
  'bachelors',
  'masters',
  'phd'
);

CREATE TYPE org_types AS ENUM
(
  'organization',
  'volunteer'
);

CREATE TABLE users
(
  user_id serial PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password TEXT NOT NULL,
  full_name TEXT NOT NULL,
  user_type org_types NOT NULL,
  date_created TIMESTAMP NOT NULL
);

CREATE TABLE organizations
(
  organization_id serial PRIMARY KEY,
  usr_id int4 NOT NULL,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zipcode int4 NOT NULL,
  phone TEXT,
  website TEXT
);

CREATE TABLE opportunities
(
  opportunity_id serial PRIMARY KEY,
  org_id int4 NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  contact TEXT NOT NULL,
  start_date TEXT NOT NULL,
  duration TEXT NOT NULL,
  commitment TEXT NOT NULL,
  ed_level ed_types,
  experience TEXT,
  license TEXT,
  remote BOOLEAN NOT NULL DEFAULT false,
  posted DATE NOT NULL
);

CREATE TABLE applications
(
  application_id serial PRIMARY KEY,
  opp_id int4 NOT NULL,
  usr_id int4 NOT NULL,
  message TEXT NOT NULL,
  time_applied TIMESTAMP NOT NULL,
  subject TEXT NOT NULL
);

ALTER TABLE organizations ADD CONSTRAINT organizations_fk0 FOREIGN KEY (usr_id) REFERENCES users(user_id);
ALTER TABLE opportunities ADD CONSTRAINT opportunities_fk0 FOREIGN KEY (org_id) REFERENCES organizations(organization_id);
ALTER TABLE applications ADD CONSTRAINT applications_fk0 FOREIGN KEY (opp_id) REFERENCES opportunities(opportunity_id);
ALTER TABLE applications ADD CONSTRAINT applications_fk1 FOREIGN KEY (usr_id) REFERENCES users(user_id);

COMMIT;