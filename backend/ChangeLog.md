# Changelog

This document serves as a detailed log of all significant changes made to the project, organized by version. It aims to provide clear insights into the enhancements, new features, and fixes implemented across various releases, ensuring that technical stakeholders can easily track the project's progress.

## [Unreleased]

---

## [1.0.3] - YYYY-MM-DD (Branch: `instagramV3`)

### Enhancements
- **Error Handling**: Enhanced error management to prevent propagation to the client, improving user experience and system stability.
- **Error Context Module**: Introduced the `ErrorWithContext` module with wrap functionality, capturing stack traces from the child function up to the parent function. It includes relevant context, file paths, and method names.
- **Top N User Followers with Sorted Set**: Implemented functionality to fetch the top N users with the most followers using a sorted set. This includes storing the follower list during startup and dynamically updating it with new followers using Kafka.
- **Sequelize Optimization**: Fine-tuned Sequelize join parameters to return only relevant attributes, reducing query time and enhancing performance.
- **Response Formatter**: Added a `Response Formatter` class to ensure consistent response formats across both success and error responses.
- **Sequelize ORM Pool Configuration**: Integrated `pgbouncer` for connection pooling in Sequelize ORM, improving database performance.
- **Transaction and Rollback in ORM**: Integrated transaction and rollback capabilities within Sequelize ORM, ensuring operations are ACID-compliant.
- **Pagination with Cursor Implementation**: Replaced skip-offset pagination with a cursor-based approach for handling large datasets, avoiding full table scans and optimizing query efficiency.
- **Load Testing Enhancements**: Added `ensure` and assertion plugins in Artillery load testing to validate endpoint responses. Implemented P95 and P99 response time thresholds for performance monitoring.

### New Features
- **Prometheus Integration**: Integrated Prometheus for anomaly detection, such as response time thresholds and application server downtime, with alerts managed in Prometheus Alertmanager.
- **Dead Letter Queue (DLQ) Integration**: Added DLQ support for failed follower topic consumption in Kafka.
- **CDC Logic (POC)**: Implemented Change Data Capture (CDC) with Debezium for schema changes in user, post, follower, and like tables. Streams are ingested into MongoDB for further processing.
- **Basic Upload Functionality**: Developed basic image and video upload functionality locally. For scalability, AWS S3 integration is recommended.

### Fixes
- **Placeholder for future fixes**: Preparing for upcoming patches and fixes.

---

## [1.0.2] - 2024-08-03 (Branch: `instagramV2`)
[#1]https://github.com/kushal45/InstagramClone/pull/1 - Changes implemented in this version
### Enhancements
- **Asset Consumer Strategy Pattern**: 
  - Introduced a strategy pattern for asset filtering.
  - Implemented two filtering strategies:
    - A generic NLP algorithm.
    - A ChatGPT-based implementation (lacked a fallback mechanism).

### New Features
- **Load Testing**: Configured Artillery for load testing various scenarios, including user registration, login, profile updates, post creation, and feed retrieval.
- **Metrics Integration**: Integrated InfluxDB for capturing request and response time metrics, visualized through Grafana.
- **Post Tagging**: Enabled multi-category tagging for posts, improving content discovery.
- **Feeds API**: Developed a feeds API to aggregate user-followed posts and relevant tags, filtered internally by the asset consumer API.
- **Test Cases**: Added unit tests for user, post, like, and comment modules using Jest.
- **Kafka Consumer for Followers**: Implemented a Kafka consumer to fetch the top N users with the most followers.
- **Pgbouncer Integration**: Integrated `pgbouncer` for PostgreSQL connection pooling.
- **Raw Query Optimization**: Introduced raw query support with `pgbouncer` for performance optimization of complex join queries.
- **Redis Caching**: Implemented Redis caching for posts, followers, and feeds to reduce database load.
- **Logging Module**: Integrated a logging module using the `winston` library, capturing debug and error logs in files.
- **ELK Stack Integration**: Added ELK stack support to aggregate and analyze logs produced by the `winston` logger.

---

## [1.0.1] - 2024-07-23 (Branch: `instagramV1`)

### Enhancements
- **User Profile Enhancements**: Revamped user profiles to include richer details like multiple tags for feed customization, contact information, and language preferences.
- **JWT Authentication**: Enhanced authentication by implementing JWT tokens for user identification, improving security and simplifying API design.

### New Features
- **Social Graph**: Launched a comprehensive followers and following system, enabling network building within the platform.
- **Load Testing Framework**: Implemented a load testing framework with Artillery, covering scenarios like user registration, login, post creation, and comment management.
- **DAO-Service Architecture**: Established a DAO-Service integration, ensuring that the service layer interacts with the DAO layer rather than directly with the datastore.
- **Modular Components**: Structured the application into modular components—user, post, like, and comment—each with its own controller and routes.

---

## [1.0.0] - 2024-07-04 (Branch: `main`)

### Initial Release
- **Core Features**:
  - **Authentication**: Basic login and registration capabilities.
  - **Content Creation**: Features for creating and viewing posts, along with basic commenting functionality.
  - **User Engagement**: Implemented a like feature for posts and introduced basic caching at the user level for performance optimization.