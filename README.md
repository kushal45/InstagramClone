# Instagram Clone API

An Instagram-like social media API built with **Node.js**, **Express**, and **MongoDB**. This project allows users to upload, like, and comment on photos, follow other users, and view a feed of posts from the people they follow.

## Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [API Documentation](#api-documentation)
- [Folder Structure](#folder-structure)
- [Caching & Optimization](#caching--optimization)
- [Testing](#testing)

## Project Overview

This Instagram clone aims to replicate core functionalities of Instagram, such as:

- User authentication (Sign up, login)
- CRUD operations for posts (create posts ,fetch all posts)
- Liking, commenting, and following functionality
- Feed generation based on followed users' posts

The API is designed to be scalable and modular, allowing for future feature expansion.

## Features

- User registration and authentication
- Password encryption using bcrypt
- Uploading images using a file storage service (e.g., AWS S3, Cloudinary)
- Follower and following system
- Likes and comments on posts
- Feed showing posts of followed users and based on user interested tags
- Pagination and search functionality(To be implemented)
- Data caching for improved performance
- API rate-limiting for security

## Tech Stack

- **Backend**: Node.js, Express
- **Database**: PostgresSQL, MongoDb(for CDC capture POC)
- **Authentication**: JWT
- **File Storage**: local storage
- **Cache**: Redis (for caching user sessions, feed, etc.)
- **Other Tools**: Docker, Swagger for API documentation,Jest to unit testing

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v14.x or higher)
- [PostgresSQL](https://postgresql.org/) (local or hosted)
- [Redis](https://redis.io/) (for caching)
- [Docker](https://www.docker.com/) (optional, for containerization)

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/kushal45/InstagramClone.git
   cd InstagramClone/backend
   ```

2. Create a .env file and configure your environment variables based on .env.example

3. Perform cd .. to go back to 'InstagramClone' directory

Note: Ensure docker is up and running

4. execute :
```bash
 ./backend_dockerize_up.sh
```
this internally takes care of calling the dependent docker services and setting up the project

## API Documentation

You can explore the API using Swagger or Postman. The Swagger documentation is available at /api-docs when the server is running at localhost:3000.

### Endpoints

- `POST /auth/register`: Register a new user
- `POST /auth/login`: Login user and receive a token
- `POST /posts`: Create a new post (Authenticated)
- `GET /posts`: Get all posts (Paginated with cursor)
- `GET /posts/:id`: Get a specific post
- `DELETE /posts/:id`: Delete a post (Authenticated) (Todo)
- `POST /like`: Like a post (Authenticated)
- `POST /comments`: Comment on a post (Authenticated)
- `GET /users`: Follow a user (Authenticated)
- `GET /feeds`: Get posts from followed users / based on interest tags of post(s) (Authenticated)

## Folder Structure

## Folder Structure

```bash
InstagramClone/
├── Instagram_Glyph_Gradient.png
├── README.md
├── backend
│   ├── ChangeLog.md
│   ├── Dockerfile
│   ├── pycache
│   │   └── flask.cpython-312.pyc
│   ├── alerts
│   │   └── alertmanager.yml
│   ├── app.py
│   ├── asset
│   │   ├── dao
│   │   │   └── AssetDao.js
│   │   ├── model
│   │   │   ├── Asset.js
│   │   │   └── AssetPool.js
│   │   ├── services
│   │   │   └── AssetService.js
│   │   ├── tests
│   │   │   ├── services
│   │   │   │   └── AssetService.test.js
│   │   │   └── util
│   │   │       ├── assetConsumerGenNLPStrat.test.js
│   │   │       └── extractTags.test.js
│   │   └── util
│   │       ├── assetConsumerGenNLPStrat.js
│   │       ├── assetConsumerGptStrat.js
│   │       ├── extractTags.js
│   │       └── generalTagsExtraction.js
│   ├── clinic-output
│   ├── comment
│   │   ├── controllers
│   │   │   └── CommentController.js
│   │   ├── dao
│   │   │   └── CommentDao.js
│   │   ├── models
│   │   │   └── Comment.js
│   │   ├── routes.js
│   │   ├── services
│   │   │   └── CommentService.js
│   │   ├── tests
│   │   │   ├── controllers
│   │   │   │   └── CommentController.test.js
│   │   │   └── services
│   │   │       └── CommentService.test.js
│   │   └── validations
│   │       └── Comment.js
│   ├── config
│   │   ├── config.json
│   │   ├── db.js
│   │   └── multer.js
│   ├── config.js
│   ├── connectorConsumer.js
│   ├── consumer.js
│   ├── cronJob
│   │   └── sinkConnectorCronJob.js
│   ├── dao
│   │   └── index.js
│   ├── database
│   │   ├── confDebeziumConnector.js
│   │   ├── connectionPool.js
│   │   ├── cursor.js
│   │   ├── index.js
│   │   └── postgresql.conf
│   ├── doc
│   │   └── swaggerConfig.js
│   ├── docker-compose-elk.yml
│   ├── docker-compose-inflx-grafana.yml
│   ├── docker-compose.yml
│   ├── docker-composer-db.yml
│   ├── entrypoint.js
│   ├── errors
│   │   ├── BadRequestError.js
│   │   ├── ErrorContext.js
│   │   ├── InternalServerError.js
│   │   ├── NotFoundError.js
│   │   └── index.js
│   ├── example.txt
│   ├── feed
│   │   ├── controller
│   │   │   └── FeedController.js
│   │   ├── routes.js
│   │   ├── service
│   │   │   ├── FeedService.js
│   │   │   └── InternalFeedCursorService.js
│   │   ├── tests
│   │   │   ├── controller
│   │   │   │   └── FeedController.test.js
│   │   │   └── service
│   │   │       └── FeedService.test.js
│   │   └── validation
│   │       └── Feed.js
│   ├── follower
│   │   ├── controllers
│   │   │   └── FollowerController.js
│   │   ├── dao
│   │   │   └── FollowerDao.js
│   │   ├── models
│   │   │   ├── Follower.js
│   │   │   └── FollowerPool.js
│   │   ├── routes.js
│   │   ├── services
│   │   │   └── FollowerService.js
│   │   ├── tests
│   │   │   ├── controllers
│   │   │   │   └── FollowerController.test.js
│   │   │   └── services
│   │   │       └── FollowerService.test.js
│   │   └── util
│   │       ├── failureFollowerConsumer.js
│   │       ├── getFollowerList.js
│   │       ├── topFollowerConsumer.js
│   │       └── viewFollowerResult.js
│   ├── init-db.sql
│   ├── kafka
│   │   ├── Consumer.js
│   │   └── Producer.js
│   ├── like
│   │   ├── controllers
│   │   │   └── LikeController.js
│   │   ├── dao
│   │   │   └── LikeDao.js
│   │   ├── models
│   │   │   └── Like.js
│   │   ├── routes.js
│   │   ├── services
│   │   │   └── LikeService.js
│   │   ├── tests
│   │   │   ├── controllers
│   │   │   │   └── LikeController.test.js
│   │   │   └── services
│   │   │       └── LikeService.test.js
│   │   └── validations
│   │       └── Like.js
│   ├── logger
│   │   ├── alert_rules.yml
│   │   ├── kibana.yml
│   │   ├── logger.js
│   │   ├── logstash.conf
│   │   ├── logstash.yml
│   │   └── prometheus.yml
│   ├── logs
│   │   ├── combined.log
│   │   ├── dead_letter_queue
│   │   ├── error.log
│   │   ├── plugins
│   │   │   └── inputs
│   │   │       └── file
│   │   ├── queue
│   │   └── uuid
│   ├── middleware
│   │   ├── CorrelationIdHandler.js
│   │   ├── ErrorHandler.js
│   │   ├── MetricsMiddleWare.js
│   │   ├── PrometheusMiddleWare.js
│   │   ├── Redis.js
│   │   └── RedisCache.js
│   ├── migrations
│   │   ├── 20240704133031-create-user.js
│   │   ├── 20240704152537-create-assets.js
│   │   ├── 20240704152639-create-posts.js
│   │   ├── 20240704152752-create-comments.js
│   │   ├── 20240705191919-create-likes.js
│   │   ├── 20240708143514-add-new-columns-to-users.js
│   │   ├── 20240715135002-modify-tag-column-assets.js
│   │   ├── 20240717111209-modify-tag-to-tags.js
│   │   └── 20240727152306-create-follower-table.js
│   ├── models
│   │   └── index.js
│   ├── mongo
│   │   ├── init-mongo.js
│   │   ├── mongo-keyfile
│   │   ├── mongoClient.js
│   │   ├── mongod.conf
│   │   ├── observer
│   │   │   ├── debeziumMongoObserver.js
│   │   │   ├── kafkaTopicNotifier.js
│   │   │   ├── observer.js
│   │   │   └── subject.js
│   │   └── util
│   │       ├── mongoConsumer.js
│   │       └── mongoTablesConsumer.js
│   ├── mongotest.js
│   ├── newrelic-infra.dockerfile
│   ├── newrelic-infra.yml
│   ├── package-lock.json
│   ├── package.json
│   ├── pgbouncer
│   │   ├── pgbouncer.ini
│   │   └── userlist.txt
│   ├── post
│   │   ├── controllers
│   │   │   └── PostController.js
│   │   ├── dao
│   │   │   └── PostDao.js
│   │   ├── models
│   │   │   ├── Post.js
│   │   │   └── PostPool.js
│   │   ├── routes.js
│   │   ├── services
│   │   │   ├── InternalPostCursorService.js
│   │   │   └── PostService.js
│   │   ├── tests
│   │   │   ├── controllers
│   │   │   │   └── PostController.test.js
│   │   │   └── services
│   │   │       └── PostService.test.js
│   │   └── validations
│   │       └── Post.js
│   ├── routes
│   │   └── index.js
│   ├── run-migrations.js
│   ├── runStartScript.js
│   ├── server.js
│   ├── tests
│   │   ├── load-testing.yml
│   │   ├── postIds.json
│   │   ├── postsData.json
│   │   ├── processor.js
│   │   ├── report.html
│   │   ├── results.json
│   │   ├── sample-summary.txt
│   │   └── token.json
│   ├── upload
│   │   ├── controller
│   │   ├── routes.js
│   │   ├── service
│   │   └── tests
│   │       ├── test-files
│   │       └── upload.test.js
│   ├── user
│   │   ├── controllers
│   │   │   ├── AuthController.js
│   │   │   └── UserController.js
│   │   ├── dao
│   │   │   └── UserDao.js
│   │   ├── middleware
│   │   │   └── Auth.js
│   │   ├── models
│   │   │   ├── User.js
│   │   │   └── UserPool.js
│   │   ├── routes.js
│   │   ├── services
│   │   │   └── UserService.js
│   │   ├── tests
│   │   │   ├── controllers
│   │   │   │   ├── AuthController.test.js
│   │   │   │   └── UserController.test.js
│   │   │   ├── services
│   │   │   │   └── UserService.test.js
│   │   │   └── utils
│   │   │       └── Utility.test.js
│   │   ├── utils
│   │   │   └── Utility.js
│   │   └── validations
│   │       ├── Auth.js
│   │       └── User.js
│   └── util
│       ├── Metrics.js
│       ├── ResponseFormatter.js
│       └── Utility.js
├── backend_dockerize_down.sh
├── backend_dockerize_up.sh
├── login.css
├── login.html
├── package-lock.json
├── package.json
└── uploads
    ├── 1723215569035-test-image.jpg
    ├── 1723215674674-test-image.jpg
    ├── 1723215678369-test-video.mp4
    ├── 1723215707075-test-image.jpg
    ├── 1723215707121-test-video.mp4
    ├── 1723215734748-test-image.jpg
    ├── 1723215734794-test-video.mp4
    ├── 1723215763167-test-image.jpg
    ├── 1723215763211-test-video.mp4
    ├── 1723216136131-test-image.jpg
    └── 1723216136194-test-video.mp4
```

## Caching & Optimization

- **Redis Caching**: Implemented Redis to cache frequently accessed data such as user sessions, feed data, and user profiles, reducing database load and improving response times.
- **Query Optimization**: Optimized Postgres queries to ensure efficient data retrieval, reducing latency and improving performance.
- **Pagination**: Implemented pagination for endpoints that return large datasets to minimize memory usage and improve response times.
This was achieved by using cursors which query from the last valid id of the entity if cursor is non-empty and valid.
- **Rate Limiting**: Added API rate limiting to prevent abuse and ensure fair usage of resources.
- **Compression**: Enabled Gzip compression for API responses to reduce payload size and improve network performance.
- **Connection Pooling**: Configured connection pooling for Postgres /Sequelize ORM by using Pgbouncer to manage database connections efficiently and improve throughput.

## Testing

- **Jest**: Used for writing unit and integration tests.
