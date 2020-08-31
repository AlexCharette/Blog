table! {
    icons (id) {
        id -> Int4,
        name -> Varchar,
    }
}

table! {
    images (id) {
        id -> Int4,
        source -> Varchar,
        caption -> Nullable<Varchar>,
    }
}

table! {
    post_images (post_id, image_id) {
        post_id -> Int4,
        image_id -> Int4,
    }
}

table! {
    post_refs (post_id, ref_id) {
        post_id -> Int4,
        ref_id -> Int4,
    }
}

table! {
    posts (id) {
        id -> Int4,
        title -> Varchar,
        pub_date -> Date,
        author -> Varchar,
        icon_id -> Int4,
        category -> Varchar,
        body -> Text,
        published -> Bool,
    }
}

table! {
    admins (username, password) {
        username -> Varchar,
        email -> Varchar,
        password -> Varchar,
    }
}

joinable!(post_images -> images (image_id));
joinable!(post_images -> posts (post_id));
joinable!(posts -> icons (icon_id));

allow_tables_to_appear_in_same_query!(
    icons,
    images,
    post_images,
    post_refs,
    posts,
    admins,
);
