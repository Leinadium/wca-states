use reqwest;
use std::env;
use serde::Deserialize;
use sqlx::prelude::*;
use sqlx::mysql::MySqlConnectOptions;
use tokio::fs::File;
use tokio::io::AsyncWriteExt;


const WCA_EXPORT_PUBLIC: &'static str = "https://www.worldcubeassociation.org/api/v0/export/public";
const POS_PROCESSING_SQL: &'static str = "pos_processing.sql";

#[derive(Deserialize)]
struct WCAExportResponse {
    export_date: String,
    sql_url: String,
    tsv_url: String,
}

#[derive(Deserialize)]
struct WCAExportDatabase {
    export_date: String,
}


#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    dotenvy::dotenv().ok();

    println!("Starting updater...");

    // connect to database
    let options = MySqlConnectOptions::new()
        .host(env::var("MYSQL_HOST")?.as_str())
        .port(env::var("MYSQL_PORT")?.parse()?)
        .username(env::var("MYSQL_USER")?.as_str())
        .password(env::var("MYSQL_PASSWORD")?.as_str())
        .database(env::var("MYSQL_DATABASE")?.as_str());

    let pool = sqlx::MySqlPool::connect_with(options).await?;

    // getting current export date
    let current_export_date = sqlx::query("SELECT exportDate FROM WCALastExport LIMIT 1")
        .fetch_one(&pool)
        .await?
        .try_get::<String, _>("exportDate")?;

    // first, request do worldcubeassociation to get the last update
    let wca_res = reqwest::get(WCA_EXPORT_PUBLIC)
        .await?
        .json::<WCAExportResponse>()
        .await?;

    // if the export date is the same, we don't need to update the database
    if current_export_date == wca_res.export_date {
        println!("Database is already updated");
        return Ok(());
    }
    
    // if the export date is different, we need to update the database
    println!("Downloading database...");
    let mut response = reqwest::get(&wca_res.sql_url).await?;
    if !response.status().is_success() {
        return Err("Failed to download database".into());
    }
    
    let mut file = File::create("wca_export.sql").await?;
    while let Some(chunk) = response.chunk().await? {
        file.write_all(&chunk).await?;
    }

    // storing
    println!("Storing database...");
    let mut conn = pool.acquire().await?;
    let mut transaction = conn.begin().await?;

    sqlx::query_file!("wca_export.sql")
        .execute(&mut transaction)
        .await?;

    Ok(())
}
