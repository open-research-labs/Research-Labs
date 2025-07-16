# Research Lab Management Web App

A full-stack web application for managing research publications, groups, and user collaboration within a laboratory environment. Built with **Rust (SQLx)** and **Node.js** on the backend, and **Next.js** on the frontend.

---

## Features

### User Management
- Register and manage user accounts
- Roles: `admin`, `researcher`, `leader`
- Secure password storage using hashes
- Email format validation

### Publications
- Submit, update, and track publication status (`DRAFT`, `WAITING`, `APPROVED`)
- Upload and manage associated files
- Link publications to submitting researchers

### Group Collaboration
- Create and manage research groups
- Assign leaders to groups
- Add users to groups
- Group status: `OPENED`, `CLOSED`, `DELETED`

### Database Schema (PostgreSQL)
- Well-structured tables for users, publications, publication files, and groups
- Foreign key relationships to enforce data integrity

---

## Tech Stack

### Backend
- **Rust**: Safe and performant web backend
- **SQLx**: Async PostgreSQL driver with compile-time SQL checking
- **Actix-Web**: Fast and powerful web framework
- **Node.js**: Optional support for additional backend microservices

### Frontend
- **Next.js**: React-based framework for SSR and SPA capabilities

### Database
- **PostgreSQL**: Reliable and scalable relational database

## Setup & Installation

### Prerequisites
- Rust toolchain
- docker compose
- Node.js
- NPM
- PostgreSQL

## Diagrams

```mermaid
classDiagram
    class User {
        +id: String
        +username: String
        +email: String
        +password_hash: String
        +first_name: String
        +last_name: String
        +bio: String
        +photo_url: String
        +role: String
        +status: String
        +affiliation: String
        +created_at: DateTime
        +updated_at: DateTime
    }

    class Link {
        +id: String
        +type: String
        +link: String
        +user_id: String
    }

    class Publication {
        +id: String
        +title: String
        +journal: String
        +status: String
        +visibility: String
        +submitter_id: String
        +conference_id: String
        +submitted_at: DateTime
    }

    class PublicationFile {
        +id: String
        +file_type: String
        +file_path: String
        +publication_id: String
    }

    class Group {
        +id: String
        +title: String
        +description: String
        +status: String
        +created_at: DateTime
        +leader_id: String
        +publication_id: String
    }

    class GroupUser {
        +user_id: String
        +group_id: String
        +created_at: DateTime
    }

    class Conference {
        +id: String
        +name: String
        +description: String
        +location: String
        +start_date: DateTime
        +end_date: DateTime
    }

    class Speaker {
        +id: Integer
        +user_id: String
        +conference_id: String
        +affiliation: String
        +title: String
        +created_at: DateTime
        +updated_at: DateTime
    }

    class Message {
        +id: String
        +message: String
        +created_at: DateTime
        +status: String
        +sender_id: String
        +receiver_id: String
    }

    class Notification {
        +id: String
        +message: String
        +created_at: DateTime
        +read_status: Boolean
        +user_id: String
    }

    User "1" --> "*" Link : possesses
    User "1" --> "*" Publication : submits
    User "1" --> "*" GroupUser : participates in
    User "1" --> "*" Message : sends/receives
    User "1" --> "*" Notification : receives
    Group "1" --> "*" GroupUser : is composed of
    Group "1" --> "1" User : has leader
    Publication "1" --> "*" PublicationFile : contains
    Publication "1" --> "*" Group : belongs to
    Conference "1" --> "*" Speaker : organizes
    Publication "1" --> "*" Conference : is associated with
