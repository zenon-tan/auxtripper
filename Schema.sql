-- create database AuxTripperDb;

-- use AuxTripperDb;

CREATE TABLE `userData` (
  `username` varchar(45) NOT NULL,
  `password` varchar(100) NOT NULL,
  `email` varchar(45) NOT NULL,
  `firstName` varchar(45) NOT NULL,
  `lastName` varchar(45) NOT NULL,
  `role` varchar(10) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `spotifyUser` (
  `id` varchar(50) NOT NULL,
  `displayName` varchar(50) NOT NULL,
  `email` varchar(64) NOT NULL,
  `username` varchar(45) NOT NULL,
  `refreshToken` varchar(300),
  PRIMARY KEY (`id`),
  KEY `username_idx` (`username`),
  CONSTRAINT `username` FOREIGN KEY (`username`) REFERENCES `userData` (`username`)
  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `itinerary` (
  `id` char(8) NOT NULL,
  `spotifyId` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `spotifyId` (`spotifyId`),
  CONSTRAINT `itinerary_ibfk_1` FOREIGN KEY (`spotifyId`) REFERENCES `spotifyUser` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE `playlist` (
  `id` int NOT NULL AUTO_INCREMENT,
  `playlistId` varchar(30) DEFAULT NULL,
  `itineraryId` char(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itineraryId` (`itineraryId`),
  CONSTRAINT `playlist_ibfk_1` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `playlistRequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `title` varchar(45) NOT NULL,
  `isPublic` tinyint(1) NOT NULL,
  `isCollaborative` tinyint(1) NOT NULL,
  `description` varchar(255) NOT NULL,
  `imageData` longblob,
  `playlistId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `playlistId` (`playlistId`),
  CONSTRAINT `playlistrequest_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `artists` (
  `id` int NOT NULL AUTO_INCREMENT,
  `artistId` varchar(30) NOT NULL,
  `name` varchar(50) NOT NULL,
  `playlistId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `playlistId` (`playlistId`),
  CONSTRAINT `artists_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=101 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `genres` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(24) NOT NULL,
  `playlistId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `playlistId` (`playlistId`),
  CONSTRAINT `genres_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `tracks` (
  `id` int NOT NULL AUTO_INCREMENT,
  `trackId` varchar(30) NOT NULL,
  `title` varchar(150) NOT NULL,
  `playlistId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `playlistId` (`playlistId`),
  CONSTRAINT `tracks_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=715 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `vibes` (
  `id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(15) NOT NULL,
  `energy` float NOT NULL,
  `danceability` float NOT NULL,
  `loudness` float NOT NULL,
  `liveness` float NOT NULL,
  `valence` float NOT NULL,
  `playlistId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `playlistId` (`playlistId`),
  CONSTRAINT `vibes_ibfk_1` FOREIGN KEY (`playlistId`) REFERENCES `playlist` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `direction` (
  `id` int NOT NULL AUTO_INCREMENT,
  `chosenRoute` int NOT NULL,
  `duration` int NOT NULL,
  `travelDate` varchar(25) NOT NULL,
  `itineraryId` char(8) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `itineraryId` (`itineraryId`),
  CONSTRAINT `direction_ibfk_1` FOREIGN KEY (`itineraryId`) REFERENCES `itinerary` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=25 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `directionRequest` (
  `id` int NOT NULL AUTO_INCREMENT,
  `time` varchar(50) NOT NULL,
  `travelWhen` varchar(10) NOT NULL,
  `travelMode` varchar(10) NOT NULL,
  `directionId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `directionId` (`directionId`),
  CONSTRAINT `directionrequest_ibfk_1` FOREIGN KEY (`directionId`) REFERENCES `direction` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

CREATE TABLE `location` (
  `id` int NOT NULL AUTO_INCREMENT,
  `originAddress` varchar(125) NOT NULL,
  `originLat` float NOT NULL,
  `originLng` float NOT NULL,
  `destinationAddress` varchar(125) NOT NULL,
  `destinationLat` float NOT NULL,
  `destinationLng` float NOT NULL,
  `directionRequestId` int NOT NULL,
  PRIMARY KEY (`id`),
  KEY `directionRequestId` (`directionRequestId`),
  CONSTRAINT `location_ibfk_1` FOREIGN KEY (`directionRequestId`) REFERENCES `directionRequest` (`id`)
  ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;