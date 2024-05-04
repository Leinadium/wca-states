use actix_web::http::StatusCode;
use mysql::{params, prelude::*};
use derive_more::{Display, Error, From};

use crate::models::*;

#[derive(Debug, Display, Error, From)]
pub enum DatabaseError {
    NotFound,
    MysqlError(mysql::Error),
}

impl actix_web::ResponseError for DatabaseError {
    fn status_code(&self) -> StatusCode {
        match self {
            DatabaseError::NotFound => StatusCode::BAD_REQUEST,
            DatabaseError::MysqlError(_) => {
                StatusCode::INTERNAL_SERVER_ERROR
            }
        }
    }
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
        "SELECT * FROM Person WHERE id = :id",
        params! {"id" => person_id},
    ) {
        Ok(Some(row)) => {
            let (id, name, country_id) = mysql::from_row(row);
            Ok(Person { id, name, country_id })
        }
        Ok(None) => Err(DatabaseError::NotFound),
        Err(e) => Err(DatabaseError::MysqlError(e)),
    }
}
