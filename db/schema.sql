CREATE TABLE IF NOT EXISTS wca.WCAExportDate (
    exportDate TEXT
);

CREATE TABLE IF NOT EXISTS wca.CountryStates (
    id VARCHAR(7),
    name VARCHAR(80)
);

CREATE TABLE IF NOT EXISTS wca.CompetitionsEachState (
    id VARCHAR(7),
    name VARCHAR(80),
    qtd INT
); 

CREATE TABLE IF NOT EXISTS wca.CompetitionsEachCountry (
    id VARCHAR(7),
    countryId VARCHAR(50),
    qtd INT
);

CREATE TABLE IF NOT EXISTS wca.StatePerson (
    id VARCHAR(7),
    stateName VARCHAR(80),
    countryId VARCHAR(50)
);

CREATE TABLE IF NOT EXISTS wca.ResultsByState (
    personId VARCHAR(7),
    personName VARCHAR(80),
    eventId VARCHAR(6),
    stateName VARCHAR(80),
    average FLOAT,
    single FLOAT
);

CREATE TABLE IF NOT EXISTS wca.ResultsByStateRankingSingle (
    personId VARCHAR(7),
    personName VARCHAR(80),
    eventId VARCHAR(6),
    stateName VARCHAR(80),
    single FLOAT,
    ranking INT
);

CREATE TABLE IF NOT EXISTS wca.ResultsByStateRankingAverage (
    personId VARCHAR(7),
    personName VARCHAR(80),
    eventId VARCHAR(6),
    stateName VARCHAR(80),
    average FLOAT,
    ranking INT
);
