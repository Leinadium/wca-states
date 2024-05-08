use actix_web::{get, web, HttpResponse, Responder};

use crate::database::{select_person, select_ranking_person};


#[get("/person")]
pub async fn get_person(data: web::Data<mysql::Pool>) -> actix_web::Result<impl Responder> {
    let res = web::block(move || select_person(&data, "2018GUIM02".to_string())).await??;
    Ok(HttpResponse::Ok().json(res))
}


#[get("/person/{person_id}")]
pub async fn get_ranking_person(
    path: web::Path<(String,)>,
    data: web::Data<mysql::Pool>,
) -> actix_web::Result<impl Responder> {
    let res = web::block(move || select_ranking_person(&data, path.0.to_string())).await??;
    Ok(HttpResponse::Ok().json(res))
}