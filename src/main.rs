#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate diesel;
#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde;
extern crate dotenv;

use rocket::request::{ Form, FromFormValue };
// use rocket::http::String;
use rocket_contrib::json::{ Json, JsonValue };
use serde_json::from_str;
use std::convert::TryFrom;
use std::mem;

mod db;

use db::models::*;

#[derive(Deserialize)]
struct PostForm {
    title: String,
    author: String,
    icon_id: i32,
    category: String,
    body: String,
    images: Vec<String>,
    refs: Vec<i32>,
    published: bool,
}

#[derive(Deserialize)]
struct Credentials {
    username: String,
    password: String,
}

#[post("/login", format = "json", data = "<credentials>")]
fn login(conn: db::DbConn, credentials: Json<Credentials>) {
    
}

#[post("/submit-post", format = "json", data = "<new_post>")]
fn submit_post_form(conn: db::DbConn, new_post: Json<PostForm>) {
    // Call create post
    let post = NewPost {
        title: new_post.title.as_str(),
        author: new_post.author.as_str(),
        icon_id: &new_post.icon_id,
        category: new_post.category.as_str(),
        body: new_post.body.as_str(),
        published: &new_post.published,
    };

    // Get ID of newest post
    let new_post_id_result = db::create_post(conn, &post);
    let new_post_id: i32;
    // Add image links
    match new_post_id_result {
        Ok(id) => new_post_id = id,
        Err(err) => {
            println!("{}", err);
            new_post_id = -1
        }
    };
    println!("new post id: {}", new_post_id);

    let mut new_conn: db::DbConn;

    if !new_post.images.is_empty() {
        let image_paths = &new_post.images;
        let image_paths: Vec<&str> = image_paths.iter().map(|path| path.as_ref()).collect();

        unsafe {
            new_conn = mem::transmute::<diesel::r2d2::PooledConnection<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>, db::DbConn>(db::create_db_pool().get().ok().unwrap());
        }

        // Get IDs of all mentioned images
        let image_ids_result = db::get_image_ids_by_name(new_conn, &image_paths);
        let image_ids = image_ids_result.ok().unwrap().into_inner();
        let mut new_post_images: Vec<NewPostImage> = Vec::new();
        for id in image_ids.iter() {
            new_post_images.push(NewPostImage {
                post_id: &new_post_id,
                image_id: &id,
            });
        }
        for new_post_image in new_post_images {
            unsafe {
                new_conn = mem::transmute::<diesel::r2d2::PooledConnection<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>, db::DbConn>(db::create_db_pool().get().ok().unwrap());
            }
            db::create_image_link(new_conn, &new_post_image);
        }
    }

    if !new_post.refs.is_empty() {
        let refs = &new_post.refs;
        //let refs: Vec<i32> = refs.iter().map(|curr_ref| i32::try_from(curr_ref.as_i64().unwrap()).unwrap()).collect();
        let mut new_post_refs: Vec<NewPostRef> = Vec::new();
        for id in refs.iter() {
            new_post_refs.push(NewPostRef {
                post_id: &new_post_id,
                ref_id: &id,
            });
        }
        for new_post_ref in new_post_refs {
            unsafe {
                new_conn = mem::transmute::<diesel::r2d2::PooledConnection<diesel::r2d2::ConnectionManager<diesel::pg::PgConnection>>, db::DbConn>(db::create_db_pool().get().ok().unwrap());
            }
            db::create_post_ref(new_conn, &new_post_ref);
        }
    }
}

#[get("/posts")]
fn all_posts(conn: db::DbConn) -> Option<Json<Vec<db::models::Post>>> {
    let result = db::get_all_posts(conn);
    match result {
        Ok(posts) => Some(posts),
        Err(_) => return None
    }
}

#[get("/")]
fn index() -> &'static str {
    "Hello, world!"
}

fn main() {
    // use db::schema::posts::dsl::*;

    rocket::ignite()
        .manage(db::create_db_pool())
        .mount("/", routes![index, all_posts, submit_post_form])
        .launch();
}
