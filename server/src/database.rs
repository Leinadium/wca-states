use actix_web::http::StatusCode;
use mysql::{params, prelude::*};
use derive_more::{Display, Error, From};
use serde::{Deserialize, Serialize};

use crate::models::*;

#[derive(Debug, Display, Error, From)]
pub enum DatabaseError {
    NotFound,
    MysqlRowError(mysql::FromRowError),
    MysqlError(mysql::Error),
}

impl actix_web::ResponseError for DatabaseError {
    fn status_code(&self) -> StatusCode {
        match self {
            DatabaseError::NotFound => StatusCode::BAD_REQUEST,
            DatabaseError::MysqlError(_)
            | DatabaseError::MysqlRowError(_) => {
                StatusCode::INTERNAL_SERVER_ERROR
            }
        }
    }
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseRankingPersonEvents {
    pub event_id: String,
    pub ranking: i32,
    pub average: Option<f32>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct ResponseRankingPerson {
    pub person_id: String,
    pub name: String,
    pub state_name: String,
    pub rankings: Vec<ResponseRankingPersonEvents>,
}

pub fn get_conn_builder(
    db_user: String,
    db_password: String,
    db_host: String,
    db_port: u16,
    db_name: String,
) -> mysql::OptsBuilder {
    mysql::OptsBuilder::new()
        .ip_or_hostname(Some(db_host))
        .tcp_port(db_port)
        .db_name(Some(db_name))
        .user(Some(db_user))
        .pass(Some(db_password))
}

pub fn select_person(
    pool: &mysql::Pool,
    person_id: String,
) -> Result<Person, DatabaseError> {
    match pool.get_conn()?.exec_first(
        "SELECT id, name, countryId FROM Persons WHERE id = :id",
        params! {"id" => person_id},
    ) {
        Ok(Some(row)) => {
            let (id, name, country_id) = mysql::from_row_opt(row)?;
            Ok(Person { id, name, country_id })
        }
        Ok(None) => Err(DatabaseError::NotFound),
        Err(e) => Err(DatabaseError::MysqlError(e)),
    }
}


pub fn select_ranking_person(
    pool: &mysql::Pool,
    person_id: String,
) -> Result<ResponseRankingPerson, DatabaseError> {
    let mut conn = pool.get_conn()?;

    let result = conn.exec_iter(
        "
        SELECT eventId, ranking, average, stateName, personName
        FROM ResultsByStateRankingAverage WHERE personId = :person_id
        ",
        params! {"person_id" => person_id.clone()}
    )?;

    let mut f_person_name: Option<String> = None;
    let mut f_state_name: Option<String> = None;

    let mut rankings: Vec<ResponseRankingPersonEvents> = Vec::new();
    for row in result {
        let (
            event_id,
            ranking,
            average,
            state_name,
            person_name
        ): (String, i32, Option<i32>, String, String) = mysql::from_row_opt(row?)?;

        rankings.push(ResponseRankingPersonEvents {
            event_id: event_id,
            ranking: ranking,
            average: match average {
                Some(avg) => Some((avg as f32) / 100.0),
                None => None,
            },
        });
        f_person_name = Some(person_name);
        f_state_name = Some(state_name);
    }

    if rankings.is_empty() {
        return Err(DatabaseError::NotFound);
    }

    if f_person_name.is_none() || f_state_name.is_none(){
        return Err(DatabaseError::NotFound);
    }

    Ok(ResponseRankingPerson {
        person_id: person_id,
        name: f_person_name.unwrap_or_default(),
        state_name: f_state_name.unwrap_or_default(),
        rankings,
    })
   
}