use serde::Serialize;
use sqlx::types::Uuid;

#[derive(Debug, Serialize)]
pub struct Metrics {
    pub total_users: i64,
    pub users_by_role_status: Vec<(String, String, i64)>,
    pub new_users_7d: i64,
    pub new_users_30d: i64,
    pub total_publications: i64,
    pub publications_by_status_visibility: Vec<(String, String, i64)>,
    pub new_publications_7d: i64,
    pub new_publications_30d: i64,
    pub total_conferences: i64,
    pub upcoming_conferences_30d: i64,
    pub publications_per_conference: Vec<(Uuid, String, i64)>,
    pub top_users_by_publications: Vec<(Uuid, String, i64)>,
}
