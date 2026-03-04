DROP TABLE IF EXISTS categories;
DROP TABLE IF EXISTS listings;

CREATE TABLE categories (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE listings (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK(type IN ('business', 'person')),
  category_id INTEGER,
  description TEXT,
  phone TEXT,
  email TEXT,
  website TEXT,
  address TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (category_id) REFERENCES categories (id)
);

-- Insert some initial data based on the history
INSERT INTO categories (name, description) VALUES ('Real Estate', 'Real estate and property management services');
INSERT INTO categories (name, description) VALUES ('Employment', 'Job placement and recruitment services');
INSERT INTO categories (name, description) VALUES ('Education', 'Computer and language classes');

INSERT INTO listings (name, type, category_id, description, email, website)
VALUES ('GS & U Management LLC', 'business', NULL, 'Exceeding your networking needs. Food, shelter, clothing.', 'gsu.mgt@gmail.com', 'gsandu.com');

INSERT INTO listings (name, type, category_id, description, website)
VALUES ('Prime America Real Estate', 'business', 1, 'Clearing obstacles from your path to your home.', 'primeamericany.com');

INSERT INTO listings (name, type, category_id, description, phone)
VALUES ('Sakinxa', 'business', 2, 'Outsource platform.', '');

INSERT INTO listings (name, type, category_id, description)
VALUES ('Gobinda Lama', 'person', 1, 'Founder and Principal Broker of Prime America Real Estate. Previous CEO & Founder of GS&U Management.');

INSERT INTO listings (name, type, category_id, description)
VALUES ('Siddhartha Lama', 'person', 1, 'CEO of GS&U.com & PrimeAmericaNY.com.');
