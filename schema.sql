DROP TABLE IF EXISTS booking_seats;
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS showtimes;
DROP TABLE IF EXISTS theaters;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS movies;

-- 1. Movies Table
CREATE TABLE movies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        genre TEXT,
                        rating TEXT,
                        duration INTEGER,
                        poster TEXT,
                        status TEXT,
                        synopsis TEXT
);

-- 2. Theaters Table
CREATE TABLE theaters (
                          id TEXT PRIMARY KEY,
                          capacity INTEGER
);

-- 3. Users Table (Using password_hash instead of plain text)
CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       email TEXT UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       name TEXT NOT NULL,
                       role TEXT DEFAULT 'customer'
);

-- 4. Showtimes Table
CREATE TABLE showtimes (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           movieId INTEGER,
                           theaterId TEXT,
                           start_time DATETIME NOT NULL,
                           pricePerSeat INTEGER NOT NULL,
                           FOREIGN KEY (movieId) REFERENCES movies(id),
                           FOREIGN KEY (theaterId) REFERENCES theaters(id)
);

-- 5. Bookings Table (Redundant data removed)
CREATE TABLE bookings (
                          id TEXT PRIMARY KEY,
                          userId INTEGER,
                          showtimeId INTEGER,
                          totalPrice INTEGER,
                          status TEXT DEFAULT 'confirmed',
                          qrCode TEXT,
                          bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP,
                          FOREIGN KEY (userId) REFERENCES users(id),
                          FOREIGN KEY (showtimeId) REFERENCES showtimes(id)
);

-- 6. Booking Seats Table
CREATE TABLE booking_seats (
                               bookingId TEXT,
                               seatId TEXT,
                               PRIMARY KEY (bookingId, seatId),
                               FOREIGN KEY (bookingId) REFERENCES bookings(id)
);

-- --- INITIAL DATA ---

INSERT INTO theaters (id, capacity) VALUES ('A', 120), ('B', 120), ('C', 80);

-- NOTE: In a real app, these passwords would be encrypted via bcrypt.
-- For right now, we insert a placeholder hash string so the app doesn't break.
INSERT INTO users (email, password_hash, name, role) VALUES
                                                         ('customer@example.com', '$2b$10$PlaceholderHash1234567890', 'John Customer', 'customer'),
                                                         ('employee@example.com', '$2b$10$PlaceholderHash1234567890', 'Jane Employee', 'employee'),
                                                         ('admin@example.com', '$2b$10$PlaceholderHash1234567890', 'Admin User', 'admin');

-- Two starter movies so your UI isn't completely empty
INSERT INTO movies (id, title, genre, rating, duration, poster, status, synopsis) VALUES
                                                                                      (1, 'The Quantum Paradox', 'Sci-Fi', 'PG-13', 148, 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85?w=300&h=450&fit=crop', 'now-showing', 'A mind-bending journey through parallel dimensions.'),
                                                                                      (2, 'Echoes of Tomorrow', 'Drama', 'R', 132, 'https://images.unsplash.com/photo-1485846234645-a62644f84728?w=300&h=450&fit=crop', 'now-showing', 'A powerful story of love, loss, and redemption.');