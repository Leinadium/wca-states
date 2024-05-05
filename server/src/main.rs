use std::{env, io};
use actix_web::{web, App, HttpServer, middleware::Logger};
use env_logger;

mod database;
mod models;
mod routes;


#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenvy::dotenv().ok();

    // enable logging
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // database connection
    let builder = database::get_conn_builder(
        env::var("MYSQL_USER").expect("MYSQL_USER must be set"),
        env::var("MYSQL_PASSWORD").expect("MYSQL_PASSWORD must be set"),
        env::var("MYSQL_HOST").expect("MYSQL_HOST must be set"),
        env::var("MYSQL_PORT").expect("MYSQL_PORT must be set").parse().expect("MYSQL_PORT must be a number"),
        env::var("MYSQL_DATABASE").expect("MYSQL_DATABASE must be set"),
    );
    let pool = mysql::Pool::new(builder).expect("Failed to create connection pool");
    
    // shared data
    let shared_data = web::Data::new(pool);

    println!("Server starting...");
    
    // starting
    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(shared_data.clone())
            .service(routes::get_person)
            .service(routes::get_ranking_person)
    })
        .bind("0.0.0.0:8080")?
        .workers(2)
        .run()
        .await
}
