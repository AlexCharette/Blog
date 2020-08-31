-- Your SQL goes here
CREATE TABLE IF NOT EXISTS icons (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE posts(
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    title VARCHAR NOT NULL,
    pub_date DATE NOT NULL DEFAULT CURRENT_DATE,
    author VARCHAR NOT NULL,
    icon_id INT NOT NULL REFERENCES icons(id),
    category VARCHAR NOT NULL CONSTRAINT valid_category CHECK (category = 'idea' OR category = 'tech' OR category = 'journal'),
    body TEXT NOT NULL,
    published BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE images (
    id INT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    source VARCHAR UNIQUE NOT NULL,
    caption VARCHAR
);

CREATE TABLE post_refs (
    post_id INT NOT NULL REFERENCES posts(id),
    ref_id INT NOT NULL REFERENCES posts(id),
    PRIMARY KEY(post_id, ref_id)
);

CREATE TABLE post_images (
    post_id INT NOT NULL REFERENCES posts(id),
    image_id INT NOT NULL REFERENCES images(id),
    PRIMARY KEY(post_id, image_id)
);

CREATE TABLE admins (
    username VARCHAR UNIQUE NOT NULL,
    email VARCHAR UNIQUE NOT NULL,
    password VARCHAR NOT NULL,
    PRIMARY KEY(username, password)
);
