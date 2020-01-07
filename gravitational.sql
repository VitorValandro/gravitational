CREATE DATABASE gravitational;
USE gravitational;

CREATE TABLE user_score(
	user_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
	username VARCHAR(30),
	password VARCHAR(40),
	score INT,
	ip VARCHAR(30)
);
