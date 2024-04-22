CREATE INDEX idx_id ON Competitions (id);
CREATE INDEX idx_countryId ON Competitions (countryId);
CREATE INDEX idx_personId ON Results (personId);
CREATE INDEX idx_competitionId ON Results (competitionId);
CREATE INDEX idx_id ON Persons (id);

---------------------------------
DROP TABLE IF EXISTS States;
CREATE TABLE States AS
    SELECT
        c.id AS id,
        SUBSTRING_INDEX(c.cityName, ', ', -1) AS state,
        SUBSTRING_INDEX(c.cityName, ', ', 1) AS city
    FROM Competitions c
    WHERE c.countryId = 'Brazil'
;
CREATE INDEX idx_cid ON States (id);
CREATE INDEX idx_state ON States (state);
---------------------------------
DROP TABLE IF EXISTS CompetitionsEachState;
CREATE TABLE CompetitionsEachState AS 
    SELECT
        p.id AS id, 
        s.state AS state,
        COUNT(DISTINCT c.id) AS qtd
    FROM
        Persons p,
        Results r,
        States s,
        Competitions c
    WHERE
        p.id = r.personId AND
        c.id = r.competitionId AND
        s.id = c.id AND
        p.countryId = 'Brazil'
    GROUP BY p.id, s.state
;
CREATE INDEX idx_id ON CompetitionsEachState (id);
CREATE INDEX state ON CompetitionsEachState (state);
----------------------------------
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
CREATE INDEX idx_id ON CompetitionsEachCountry (id);
CREATE INDEX idx_countryId ON CompetitionsEachCountry (countryId);
----------------------------------
DROP TABLE IF EXISTS StatePerson;
CREATE TABLE StatePerson AS
    SELECT
        p.id AS id,
        cesMaxState.state AS state,
        cecMaxCountry.countryId AS countryId
    FROM
        Persons p
            LEFT JOIN (
                SELECT id, state
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
        cecMaxCountry.countryId = 'Brazil'
;
CREATE INDEX idx_id ON StatePerson (id);
CREATE INDEX idx_state ON StatePerson (state);
CREATE INDEX idx_countryId ON StatePerson (countryId);
----------------------------------
DROP TABLE IF EXISTS ResultsByState;
CREATE TABLE ResultsByState AS
    SELECT
        r.personId AS id,
        r.personName AS name,
        r.eventId AS eventId,
        sp.state AS state,
        MIN(NULLIF(NULLIF(r.average, -1), 0)) AS average,
        MIN(NULLIF(NULLIF(r.best, -1),0)) AS single
    FROM
        Results r
            JOIN StatePerson sp
                ON r.personId = sp.id
    GROUP BY r.personId, r.personName, r.eventId, sp.state;
;
CREATE INDEX idx_id ON ResultsByState (id);
CREATE INDEX idx_eventId ON ResultsByState (eventId);