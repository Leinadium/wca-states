use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Person {
    pub id: String,
    pub name: String,
    pub country_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Competition {
    pub id: String,
    pub name: String,
    pub city_name: String,
    pub country_id: String,
    pub start_date: String,
    pub end_date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompetitionResult {
    pub competition_id: String,
    pub person_id: String,
    pub country_id: String,
    pub result: String,
    pub date: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Events {
    pub name: String,
    pub rank: i32,
    pub format: String,
    pub cell_name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CountryState {
    pub id: String,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompetitionsEachState {
    pub id: String,
    pub name: String,
    pub qtd: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct CompetitionsEachCountry {
    pub id: String,
    pub country_id: String,
    pub qtd: i32,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StatePerson {
    pub id: String,
    pub state_name: String,
    pub country_id: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResultsByState {
    pub person_id: String,
    pub person_name: String,
    pub event_id: String,
    pub state_name: String,
}