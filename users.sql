CREATE SEQUENCE user_id;
CREATE TABLE users (
  id INTEGER PRIMARY KEY DEFAULT NEXTVAL('user_id'),
  login VARCHAR(64),
  password VARCHAR(64),
  email VARCHAR(64));