DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS showtimes;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS movies;

CREATE TABLE movies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        genre TEXT,
                        rating TEXT,
                        duration INTEGER,
                        poster TEXT,
                        status TEXT,
                        synopsis TEXT
);

CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       email TEXT UNIQUE,
                       password TEXT,
                       name TEXT,
                       role TEXT
);

CREATE TABLE showtimes (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           movieId INTEGER,
                           date TEXT,
                           time TEXT,
                           theater TEXT,
                           pricePerSeat INTEGER,
                           FOREIGN KEY (movieId) REFERENCES movies(id)
);

CREATE TABLE bookings (
                          id TEXT PRIMARY KEY,
                          userId INTEGER,
                          movieId INTEGER,
                          movieTitle TEXT,
                          showtime TEXT,
                          theater TEXT,
                          seats TEXT, -- Stored as a JSON string array e.g., '["A1", "A2"]'
                          totalPrice INTEGER,
                          status TEXT,
                          qrCode TEXT,
                          bookingDate TEXT,
                          FOREIGN KEY (userId) REFERENCES users(id),
                          FOREIGN KEY (movieId) REFERENCES movies(id)
);

-- Insert Mock Movies
INSERT INTO movies (id, title, genre, rating, duration, poster, status, synopsis) VALUES
                                                                                      (1, 'The Quantum Paradox', 'Sci-Fi', 'PG-13', 148, 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop', 'now-showing', 'A mind-bending journey through parallel dimensions.'),
                                                                                      (2, 'Echoes of Tomorrow', 'Drama', 'R', 132, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop', 'now-showing', 'A powerful story of love, loss, and redemption.'),
                                                                                      (3, 'The Last Horizon', 'Adventure', 'PG', 156, 'https://images.unsplash.com/photo-1489749798305-4fea3ba63d60?w=300&h=450&fit=crop', 'now-showing', 'An epic adventure to the edge of the world.'),
                                                                                      (4, 'Midnight Crimes', 'Thriller', 'R', 118, 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=300&h=450&fit=crop', 'now-showing', 'A detective races against time to stop a serial killer.'),
                                                                                      (5, 'Love in Paris', 'Romance', 'PG-13', 124, 'https://images.unsplash.com/photo-1472027784056-d282a0be896b?w=300&h=450&fit=crop', 'upcoming', 'A romantic journey through the streets of Paris.'),
                                                                                      (6, 'Robot Uprising', 'Action', 'PG-13', 142, 'https://images.unsplash.com/photo-1485579149c01123123aab0d?w=300&h=450&fit=crop', 'upcoming', 'Humanity fights back against artificial intelligence.');

-- Insert Mock Users
INSERT INTO users (id, email, password, name, role) VALUES
                                                        (1, 'customer@example.com', 'password123', 'John Customer', 'customer'),
                                                        (2, 'employee@example.com', 'password123', 'Jane Employee', 'employee'),
                                                        (3, 'admin@example.com', 'password123', 'Admin User', 'admin');

-- Insert Mock Showtimes
INSERT INTO showtimes (id, movieId, date, time, theater, pricePerSeat) VALUES
                                                                           (1, 1, '2026-03-21', '10:00', 'A', 12),
                                                                           (2, 1, '2026-03-21', '13:30', 'B', 12),
                                                                           (3, 1, '2026-03-21', '16:00', 'A', 12),
                                                                           (6, 2, '2026-03-21', '11:00', 'C', 12);

-- Insert Mock Bookings
INSERT INTO bookings (id, userId, movieId, movieTitle, showtime, theater, seats, totalPrice, status, qrCode, bookingDate) VALUES
                                                                                                                              ('BK001', 1, 1, 'The Quantum Paradox', '2026-03-21 19:30', 'C', '["C1", "C2", "C3"]', 45, 'confirmed', 'data:image/svg+xml,...', '2026-03-20'),
                                                                                                                              ('BK002', 1, 2, 'Echoes of Tomorrow', '2026-03-22 14:30', 'A', '["A5", "A6"]', 24, 'confirmed', 'data:image/svg+xml,...', '2026-03-19');