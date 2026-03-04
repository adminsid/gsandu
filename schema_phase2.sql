ALTER TABLE listings ADD COLUMN is_sponsored BOOLEAN DEFAULT 0;
ALTER TABLE listings ADD COLUMN open_data_source TEXT;

CREATE TABLE IF NOT EXISTS reviews (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  rating INTEGER CHECK(rating >= 1 AND rating <= 5),
  comment TEXT,
  reviewer_name TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings (id)
);

CREATE TABLE IF NOT EXISTS leads (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  listing_id INTEGER NOT NULL,
  sender_name TEXT NOT NULL,
  sender_email TEXT NOT NULL,
  message TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (listing_id) REFERENCES listings (id)
);

CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT,
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Insert some dummy news
INSERT INTO news (title, content, author) VALUES ('GS&U Management Launches Smart Directory', 'We are thrilled to announce the launch of our new smart directory, connecting businesses and people across NYC.', 'Siddhartha Lama');
