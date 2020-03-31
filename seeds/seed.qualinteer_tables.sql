BEGIN;

  TRUNCATE
  applications,
  opportunities,
  organizations,
  users
  RESTART IDENTITY CASCADE;


  INSERT INTO users
    (email, password, full_name, user_type, date_created)
  VALUES
    ('testuser1@gmail.com', '$2a$12$ml7Sc3QuD5JsIKYb1G4/0eaJreelMHwF4KdrUBWhpE5SGTxHW4ZY.', 'John Doe', 'organization', '2019-12-22T16:28:32.615Z'),
    ('testuser2@gmail.com', '$2a$12$WHyHTYDqa/dqUh7.htNEBuQ5RfBajSZn4HmdLA5r2tNtnBde9XUJ6', 'Jane Doe', 'organization', '2019-12-22T16:28:32.615Z'),
    ('testuser3@gmail.com', '$2a$12$EALd0PQN7rJ.ixvvMu15Jesb4Cs44VxXZowGts5fyw35nqIl8nSbq', 'Billy Joe', 'volunteer', '2019-12-22T16:28:32.615Z'),
    ('testuser4@gmail.com', '$2a$12$f.Kr6bGXSm1y0NfUw3e5helKXBh0byQZrB1bwVbAaM6OUtwTcygja', 'Timmy Tom', 'volunteer', '2019-12-22T16:28:32.615Z');


  INSERT INTO organizations
    (usr_id, name, address, city, state, zipcode, phone, website)
  VALUES
    (2, 'BEST FRIENDS ANIMAL SOCIETY', '5001 Angel Canyon Road', 'Kanab', 'UT', 84741, null, 'https://bestfriends.org/sanctuary'),
    (2, 'THE DAILY SOURCE', '1509 Blake St.', 'Denver', 'CO', 80202, null, 'http://dailysource.org/'),
    (1, 'RESTORATION PROJECT INTERNATIONAL', '1609 Havana Street', 'Aurora', 'CO', 80010, '555-694-3256', 'http://www.restorationpi.org');


  INSERT INTO opportunities
    (org_id, title, description, contact, start_date, duration, commitment, ed_level, experience, license, remote, posted)
  VALUES
    (3, 'Community Outreach Coordinator', 'This individual will work with the Executive Board Member in charge of Community Outreach to: Plan and implement outreach events Be RPI''s connection to the community Cultivate relationships and collaborations with individuals, businesses, and other non-profit organizations doing similar work. Provide assistance to RPI''s program assistants in supporting our constituents.', 'info@restorationpi.com', '02-24-2020', '8 months', '20 hours', 'none', 'Public Relations', null, false, '10-25-2019'),
    (1, 'Clinic Stipend-Volunteer Veterinary Technician', 'Shelters across the country are expecting to experience overcrowding, economic hardships, and staff shortages due to the COVID-19 pandemic. This position increases the organization''s ability to continue to provide critical services to shelter partners, local pet owners, and sanctuary animals.', 'info@bestfriendsas.com', 'ASAP', 'As long as possible', 'We''ll work with your schedule', 'associates', 'Animal Care / Handling', 'Vet Tech', false, '02-28-2020'),
    (1, 'Clinic Stipend-Volunteer Veterinarian', 'Shelters across the country are expecting to experience overcrowding, economic hardships, and staff shortages due to the COVID-19 pandemic. This position increases the organization''s ability to continue to provide critical services to shelter partners, local pet owners, and sanctuary animals. The Sanctuary is home to a beautifully equipped, state-of-the-art veterinary clinic for homeless animals and you will be providing medical services to animals in need with the support of an enthusiastic and skilled veterinary staff.', 'info@bestfriendsas.com', 'ASAP', 'As long as possible', 'We''ll work with your schedule', 'bachelors', 'Animal Therapy', 'Licensed Veterinarian', false, '02-26-2020'),
    (2, 'Seeking editor for leading edge daily news site', 'DailySource.org is looking for an individual with a nose for news to help update our site with great content and lay out the front page. Our nonprofit focuses on news about making the world a better place, particularly news related to topics such as global poverty, nonprofits, climate change and human rights. All volunteering is via the computer -- you can be anywhere in the world.', 'volunteer@dailysource.net', 'The sooner the better', '20 weeks', '10 hours', 'associates', 'Journalism', null, true, '03-10-2020');


  INSERT INTO applications
    (opp_id, usr_id, message, time_applied, subject)
  VALUES
    (1, 3, 'Hi there, I''m really interested in the opp to volunteer for such an amazing company! Please reach out to me if you still need someone. Best, Billy', '2019-12-22T16:28:32.615Z', 'Looking To Help'),
    (2, 3, 'To whom it may concern, I think I can be of service. Please let me know if the opp is still available. Best, Billy', '2020-03-21T16:28:32.615Z', 'Would love to help'),
    (3, 3, 'Hello, I am a vet and just moved to Kanab. I''d love to help, though I can only offer 10 hours a week if that''s ok. Let me know. Sincerely, Tim', '2020-03-22T16:28:32.615Z', 'Vet looking to help');


  COMMIT;
