DROP DATABASE IF EXISTS Travel;
CREATE DATABASE Travel;
USE Travel;

CREATE TABLE Trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Title VARCHAR(250),
    destination VARCHAR(250),
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    lastViewed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT charset=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE days (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tripID INT NOT NULL,
    dayNumber INT NOT NULL,
    dayDate DATE NOT NULL,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (tripID) REFERENCES Trips(id) ON DELETE CASCADE,
    UNIQUE KEY uniqueTripDay (tripID,dayNumber)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE restaurants (
    id INT AUTO_INCREMENT PRIMARY KEY,
    restName VARCHAR(250),
    tripID INT NOT NULL,
    notes TEXT,
    location VARCHAR(10000),
    lng INT NOT NULL,
    lat INT NOT NULL,

    FOREIGN KEY (tripID) REFERENCES Trips(id) ON DELETE CASCADE,
    UNIQUE KEY uniqueTripDay (tripID,id)
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tripId INT NOT NULL,
    dayID INT NOT NULL,
    activityName VARCHAR(250) NOT NULL,
    location VARCHAR(10000),
    startTime TIME,
    endTime TIME,
    cost TEXT,
    notes TEXT,
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (dayID) REFERENCES days(id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;