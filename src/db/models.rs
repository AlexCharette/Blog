
use super::schema::{posts, images, post_refs, post_images};
use diesel::sql_types::Text;
//use serde::{Serialize, Deserialize};

#[derive(Clone, Serialize, Deserialize, Queryable)]
pub struct Post {
    pub id: i32,
    pub title: String,
    pub pub_date: chrono::NaiveDate, 
    pub author: String,
    pub icon_id: i32,
    pub category: String,
    pub body: String,
    pub published: bool,
}

#[derive(Insertable)]
#[table_name="posts"]
pub struct NewPost<'a> {
    pub title: &'a str,
    pub author: &'a str,
    pub icon_id: &'a i32,
    pub category: &'a str,
    pub body: &'a str,
    pub published: &'a bool,
}

#[derive(Queryable)]
pub struct Image {
    pub id: i32,
    pub source: String,
    pub caption: String,
}

#[derive(Queryable)]
pub struct PostRef {
    pub post_id: i32,
    pub ref_id: i32,
}

#[derive(Insertable)]
#[table_name="post_refs"]
pub struct NewPostRef<'a> {
    pub post_id: &'a i32,
    pub ref_id: &'a i32,
}

#[derive(Queryable)]
pub struct PostImage {
    pub post_id: i32,
    pub image_id: i32,
}

#[derive(Insertable)]
#[table_name="post_images"]
pub struct NewPostImage<'a> {
    pub post_id: &'a i32,
    pub image_id: &'a i32,
}