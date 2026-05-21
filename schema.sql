CREATE TABLE _cf_KV (
                        key TEXT PRIMARY KEY,
                        value BLOB
) WITHOUT ROWID
CREATE TABLE movies (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT NOT NULL,
                        genre TEXT,
                        rating TEXT,
                        duration INTEGER,
                        poster TEXT,
                        status TEXT,
                        synopsis TEXT
)
CREATE TABLE sqlite_sequence(name,seq)
CREATE TABLE theaters (
                          id TEXT PRIMARY KEY,
                          capacity INTEGER
)
CREATE TABLE users (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       email TEXT UNIQUE NOT NULL,
                       password_hash TEXT NOT NULL,
                       name TEXT NOT NULL,
                       role TEXT DEFAULT 'customer'
)
CREATE TABLE showtimes (
                           id INTEGER PRIMARY KEY AUTOINCREMENT,
                           movieId INTEGER,
                           theaterId TEXT,
                           start_time DATETIME NOT NULL,
                           pricePerSeat INTEGER NOT NULL,
                           FOREIGN KEY (movieId) REFERENCES movies(id),
                           FOREIGN KEY (theaterId) REFERENCES theaters(id)
)
CREATE TABLE bookings (
                          id TEXT PRIMARY KEY,
                          userId INTEGER,
                          showtimeId INTEGER,
                          totalPrice INTEGER,
                          status TEXT DEFAULT 'confirmed',
                          qrCode TEXT,
                          bookingDate DATETIME DEFAULT CURRENT_TIMESTAMP, paymentMethod TEXT NOT NULL DEFAULT 'card',
                          FOREIGN KEY (userId) REFERENCES users(id),
                          FOREIGN KEY (showtimeId) REFERENCES showtimes(id)
)
CREATE TABLE booking_seats (
                               bookingId TEXT,
                               seatId TEXT,
                               PRIMARY KEY (bookingId, seatId),
                               FOREIGN KEY (bookingId) REFERENCES bookings(id)
)