ALTER DATABASE wca CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;

CREATE INDEX idx_id ON Competitions (id);
CREATE INDEX idx_countryId ON Competitions (countryId);
CREATE INDEX idx_personId ON Results (personId);
CREATE INDEX idx_competitionId ON Results (competitionId);
CREATE INDEX idx_id ON Persons (id);

DROP TABLE IF EXISTS StatesId;
CREATE TABLE StatesId (
    id CHAR(2),
    name VARCHAR(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci,
    PRIMARY KEY (id)
);
INSERT INTO StatesId (id, name) VALUES
    ('AC', 'Acre'),
    ('AL', 'Alagoas'),
    ('AP', 'Amapá'),
    ('AM', 'Amazonas'),
    ('BA', 'Bahia'),
    ('CE', 'Ceará'),
    ('DF', 'Distrito Federal'),
    ('ES', 'Espírito Santo'),
    ('GO', 'Goiás'),
    ('MA', 'Maranhão'),
    ('MT', 'Mato Grosso'),
    ('MS', 'Mato Grosso do Sul'),
    ('MG', 'Minas Gerais'),
    ('PA', 'Pará'),
    ('PB', 'Paraíba'),
    ('PR', 'Paraná'),
    ('PE', 'Pernambuco'),
    ('PI', 'Piauí'),
    ('RJ', 'Rio de Janeiro'),
    ('RN', 'Rio Grande do Norte'),
    ('RS', 'Rio Grande do Sul'),
    ('RO', 'Rondônia'),
    ('RR', 'Roraima'),
    ('SC', 'Santa Catarina'),
    ('SP', 'São Paulo'),
    ('SE', 'Sergipe'),
    ('TO', 'Tocantins')
;
ALTER TABLE StatesId CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE Competitions CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
ALTER TABLE Persons CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;


DROP TABLE IF EXISTS CountryStates;
CREATE TABLE CountryStates AS
    SELECT
        c.id AS id,
        c.name as cname,
        s.id AS name
    FROM
        (
            SELECT
                c.id AS id,
                SUBSTRING_INDEX(c.cityName, ', ', -1) AS name
            FROM Competitions c
            WHERE c.countryId = 'Brazil'
        ) AS c 
        LEFT JOIN 
            StatesId s ON c.name = s.name
;
ALTER TABLE CountryStates CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_cid ON CountryStates (id);
CREATE INDEX idx_state ON CountryStates (name);

DROP TABLE IF EXISTS CompetitionsEachState;
CREATE TABLE CompetitionsEachState AS 
    SELECT
        p.id AS id, 
        s.name AS name,
        COUNT(DISTINCT c.id) AS qtd
    FROM
        Persons p,
        Results r,
        CountryStates s,
        Competitions c
    WHERE
        p.id = r.personId AND
        c.id = r.competitionId AND
        s.id = c.id AND
        p.countryId = 'Brazil'
    GROUP BY p.id, s.name
;
ALTER TABLE CompetitionsEachState CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_id ON CompetitionsEachState (id);
CREATE INDEX state ON CompetitionsEachState (name);

DROP TABLE IF EXISTS CompetitionsEachCountry;
CREATE TABLE CompetitionsEachCountry AS
    SELECT
        p.id AS id,
        c.countryId AS countryId,
        COUNT(DISTINCT c.id) AS qtd
    FROM
        Persons p,
        Competitions c,
        Results r
    WHERE
        p.id = r.personId AND
        c.id = r.competitionId AND
        p.countryId = 'Brazil'
    GROUP BY p.id, c.countryId
;
ALTER TABLE CompetitionsEachCountry CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_id ON CompetitionsEachCountry (id);
CREATE INDEX idx_countryId ON CompetitionsEachCountry (countryId);

DROP TABLE IF EXISTS StatePerson;
CREATE TABLE StatePerson AS
    SELECT
        p.id AS id,
        cesMaxState.name AS stateName,
        cecMaxCountry.countryId AS countryId
    FROM
        Persons p
            LEFT JOIN (
                SELECT id, name
                FROM CompetitionsEachState c1
                WHERE qtd = (
                    SELECT MAX(qtd)
                    FROM CompetitionsEachState c2
                    WHERE c1.id = c2.id
                )
            ) AS cesMaxState ON p.id = cesMaxState.id
            LEFT JOIN  (
                SELECT id, countryId
                FROM CompetitionsEachCountry c1
                WHERE qtd = (
                    SELECT MAX(qtd)
                    FROM CompetitionsEachCountry c2
                    WHERE c1.id = c2.id
                )
            ) AS cecMaxCountry on p.id = cecMaxCountry.id
    WHERE
        p.countryId = 'Brazil' AND
        cecMaxCountry.countryId = 'Brazil' AND
        cesMaxState.name IS NOT NULL
;
ALTER TABLE StatePerson CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_id ON StatePerson (id);
CREATE INDEX idx_state ON StatePerson (stateName);
CREATE INDEX idx_countryId ON StatePerson (countryId);

DROP TABLE IF EXISTS ResultsByState;
CREATE TABLE ResultsByState AS
    SELECT
        r.personId AS personId,
        r.personName AS personName,
        r.eventId AS eventId,
        sp.stateName AS stateName,
        MIN(NULLIF(NULLIF(r.average, -1),0)) AS average,
        MIN(NULLIF(NULLIF(r.best, -1),0)) AS single
    FROM
        Results r
            JOIN StatePerson sp
                ON r.personId = sp.id
    GROUP BY r.personId, r.personName, r.eventId, sp.stateName;
;
ALTER TABLE ResultsByState CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_id ON ResultsByState (personId);
CREATE INDEX idx_eventId ON ResultsByState (eventId);
CREATE INDEX idx_state ON ResultsByState (stateName);
CREATE INDEX idx_average ON ResultsByState (average);
CREATE INDEX idx_single ON ResultsByState (single);

DROP TABLE IF EXISTS ResultsByStateRankingSingle;
CREATE TABLE ResultsByStateRankingSingle AS
    SELECT
        rs1.personId AS personId,
        rs1.personName AS personName,
        rs1.eventId AS eventId,
        rs1.stateName AS stateName,
        rs1.single,
        dense_rank() OVER (PARTITION BY rs2.eventId, rs2.stateName ORDER BY rs2.single ASC) AS ranking
    FROM
        ResultsByState rs1
            LEFT JOIN (
                SELECT
                    personId,
                    eventId,
                    stateName,
                    COALESCE(single, 999999) AS single
                FROM
                    ResultsByState
            ) AS rs2
                ON rs1.personId = rs2.personId AND rs1.eventId = rs2.eventId AND rs1.stateName = rs2.stateName
;
ALTER TABLE ResultsByStateRankingSingle CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_personId ON ResultsByStateRankingSingle (personId);
CREATE INDEX idx_eventId ON ResultsByStateRankingSingle (eventId);
CREATE INDEX idx_state ON ResultsByStateRankingSingle (stateName);

DROP TABLE IF EXISTS ResultsByStateRankingAverage;
CREATE TABLE ResultsByStateRankingAverage AS
    SELECT
        rs1.personId AS personId,
        rs1.personName AS personName,
        rs1.eventId AS eventId,
        rs1.stateName AS stateName,
        rs1.average,
        dense_rank() OVER (PARTITION BY rs2.eventId, rs2.stateName ORDER BY rs2.average ASC) AS ranking
    FROM
        ResultsByState rs1
            LEFT JOIN (
                SELECT
                    personId,
                    eventId,
                    stateName,
                    COALESCE(average, 999999) AS average
                FROM
                    ResultsByState
            ) AS rs2
                ON rs1.personId = rs2.personId AND rs1.eventId = rs2.eventId AND rs1.stateName = rs2.stateName
;
ALTER TABLE ResultsByStateRankingAverage CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
CREATE INDEX idx_personId ON ResultsByStateRankingAverage (personId);
CREATE INDEX idx_eventId ON ResultsByStateRankingAverage (eventId);
CREATE INDEX idx_state ON ResultsByStateRankingAverage (stateName);
