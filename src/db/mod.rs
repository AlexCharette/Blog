
pub mod schema;
pub mod models;

use self::models::*;
use diesel;
use diesel::prelude::*;
use diesel::result::Error;
use diesel::query_dsl::QueryDsl;
use diesel::dsl::max;
use diesel::pg::PgConnection;
use diesel::r2d2::{ Pool, PooledConnection, ConnectionManager, PoolError };
use rocket::{Outcome, Request, State};
use rocket::http::Status;
use rocket::request::{self, FromRequest};
use rocket_contrib::json::Json;
use dotenv::dotenv;
use std::env;
use std::ops::Deref;
use std::convert::TryFrom;

pub type PgPool = Pool<ConnectionManager<PgConnection>>;
pub struct DbConn(pub PooledConnection<ConnectionManager<PgConnection>>);

impl<'a, 'r> FromRequest<'a, 'r> for DbConn {
    type Error = ();

    fn from_request(request: &'a Request<'r>) -> request::Outcome<DbConn, Self::Error> {
        let pool = request.guard::<State<PgPool>>()?;

        match pool.get() {
            Ok(conn) => Outcome::Success(DbConn(conn)),
            Err(_) => Outcome::Failure((Status::ServiceUnavailable, ())),
        }
    }
}

impl Deref for DbConn {
    type Target = PgConnection;

    fn deref(&self) -> &Self::Target {
        &self.0
    }
}

pub fn get_all_posts(conn: DbConn) -> QueryResult<Json<Vec<Post>>> {
    use schema::posts::dsl::*;
    let results: Result<Vec<Post>, Error> = posts.load::<Post>(&*conn);
    results.map(|result|
        Json(result)
    )
}

pub fn check_admin(conn: DbConn, admin_info: &Admin) -> QueryResult<String> {
    use schema::admins::dsl::*;
    admins.filter(username.eq(&admin_info.username).and(password.eq(&admin_info.password)))
        .select(username)
        .first::<String>(&*conn)
}

// Create post: takes NewPost as param
pub fn create_post(conn: DbConn, new_post: &NewPost) -> QueryResult<i32> {
    use schema::posts::dsl::*;

    diesel::insert_into(posts)
        .values(new_post)
        .returning(id)
        .get_result(&*conn)
}

pub fn get_image_ids_by_name(conn: DbConn, image_paths: &Vec<&str>) -> QueryResult<Json<Vec<i32>>> {
    use schema::images::dsl::*;
    let results: Result<Vec<i32>, Error> = images.filter(source.eq_any(image_paths))
        .select(id)
        .get_results::<i32>(&*conn);
    results.map(|result|
        Json(result)
    )
}

// Create image link
pub fn create_image_link(conn: DbConn, new_post_image: &NewPostImage) {
    use schema::post_images::dsl::*;

    diesel::insert_into(post_images)
        .values(new_post_image)
        .execute(&*conn)
        .expect("Error saving image links");
}

// Create ref
pub fn create_post_ref(conn: DbConn, new_post_refs: &NewPostRef) {
    use schema::post_refs::dsl::*;

    diesel::insert_into(post_refs)
        .values( new_post_refs)
        .execute(&*conn)
        .expect("Error saving post refs");
}

pub fn create_db_pool() -> PgPool {
    dotenv().ok(); // grab env vars

    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<PgConnection>::new(database_url);
    Pool::new(manager).expect("Failed to create pool.")
}
