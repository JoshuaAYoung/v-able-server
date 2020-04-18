
<img src="http://joshyoung.net/v-able/assets/v-able-logo.svg" width="15%"> 

# v • able server

<<<<<<< HEAD
## Live App: [v•able](v.able.joshyoung.net)
=======
## Live App
### [v•able Demo](v.able.joshyoung.net)
>>>>>>> 5801f61f92b7e206cc7f96dbd5cdb09fcec05e4e

<p float="left"><img src="http://joshyoung.net/v-able/mobilescreenshots/landing-screenshot.png" width="20%">  <img src="http://joshyoung.net/v-able/mobilescreenshots/recruit-screenshot.png" width="20%"> <img src="http://joshyoung.net/v-able/mobilescreenshots/oppboard-screenshot.png" width="20%"> <img src="http://joshyoung.net/v-able/mobilescreenshots/details-screenshot.png" width="20%"></p>

## Description

v•able is a platform for connecting experienced volunteers to non-profit organizations that have a specific need for skilled labor or professional services and are having a hard time finding them on the open market. 

## Notes on Current Features
- The app utilizes JSON Web Tokens and bCrypt hashing for auth & auth. I know that from a security standpoint, this isn't a fool proof system. In terms of a learning experience, however, I couldn't have asked for better.
- In addition to the client, the server also validates form inputs with Regex.
- The NPM package "XSS" is used to sanitize all "text" type inputs, with the exception of the opportunity description. The rich text editor writes basic inline styling which the XSS package filters out, with no options of adding to the default whitelist. This will be a focus of future versions.
- The database schema was built with future features in mind. To note:
  - An "applications" table connects volunteer users with the "opportunitites" table in order to aid the implementation of application tracking and messaging
  - Breaking out organizations from users (even though on the client side it's one form and one fetch request) will, in the future, allow users to add multiple organizations from a single account.

## Features to Come

- A way for organizations users to see and edit their profiles and posted opportunities. 
- A way for volunteer users to see and edit their profiles and the jobs they've applied for.
- A system for volunteers to save opportunities to a list of favorites.
- A way for volunteer users to add a profile with resumes and a way for organizations to see a volunteer applicant's information.
- A system to store and present volunteers' applications.
- Full text search for the opportunity board using something like PostgreSQL's native tsvector / tsquery.

## Getting Started

- Install dependencies: `npm install`
- Create development and test databases: `createdb v-able`, `createdb v-able-test`
- Create database user: `createuser v-able`
- Grant privileges to new user in `psql`:
  - `GRANT ALL PRIVILEGES ON DATABASE v-able TO v-able`
  - `GRANT ALL PRIVILEGES ON DATABASE "v-able-test" TO v-able`
- Prepare environment file: `cp example.env .env`
- Replace values in `.env` with your custom values.
- Bootstrap development database: `npm run migrate`
- Bootstrap test database: `npm run migrate:test`

## Sample Data

- To seed the database for development: `psql -U v-able -d v-able -a -f seeds/seed.v-able_tables.sql`
- To clear seed data: `psql -U v-able -d v-able -a -f seeds/trunc.v-able_tables.sql`

## Scripts

- Start application for development: `npm run dev`
- Run tests: `npm test`

## Built With

[PostgreSQL](https://www.postgresql.org/)

[Express](https://expressjs.com/)

[React](https://reactjs.org/)

[Node](https://nodejs.org/en/)

HTML 5

CSS 3

Javascript

[Mocha](https://mochajs.org/)

[Chai](https://www.chaijs.com/)

[Knex](http://knexjs.org/)


## The Author

**Josh Young** - [Portfolio](https://joshyoung.net)

## License

This project is licensed under the MIT License


