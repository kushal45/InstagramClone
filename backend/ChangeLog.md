# Changelog

This document provides a comprehensive log of all notable changes made to the project. It's structured to offer clear insights into each version's enhancements, new features, and fixes, ensuring technical stakeholders can easily understand the project's evolution.

## [Unreleased]

## [1.0.3] - YYYY-MM-DD (Branch:`instagramV3`)
### Enhancements
- **Error Handling** : Improved error handling to prevent errors from propagating to the client, enhancing user experience and system stability.
- **Error File context** : Added ErrorWithContext module with wrap functionality which captures stacktrace from the child function upto the parent function 
with relecant context and filePath method name added to it 
- **Fetch top n user follower with Sorted Set** - fetching top n user list having most followers using Sorted Set functionality 
by storing the follower list in the sorted set during the startup and viewing top n follower list during new follower addition with follower consumer using 
kafka

-**finetuning Sequelize join params** - finetuning and optimizing squelize join parameters to return only relevant attributes instead of returning
 all which is not recommended (if we return all the coloums which are redundant the query time increases which results in slower queries)

-**Response Formatter** - Adding Response Formatter class which would be used to return consistent response format in both success and error responses of various endpoints

-**Pool Config in Sequelize ORM** - integrating pgbouncer pool config to use connection pooling in the ORM

-**Integrating Transaction and rollback in ORM** - integrating transaction and rollback function of sequelize ORM to make the operations ACID compliant.

-**Pagination Integration** - Using Cursor implementation for paginating the fetch response for fetching lardge datasets of fetch endpoints.
(skip offset functionality of pagination withing db queries has been removed since those are not recommended for large datasets since in that case we do full table scans even if skip with offset is used so cursor implementation needs to be done such that we jump to that particular cursor if valid cursor string is provided which makes the query effecient and optimized)

-**assertion and plugins used in load testing** - adding ensure and assertion plugins of artillery load testing to assert checks for each endpoint 
and adding threshold response ms of p95 and p99 requests


### New Features
**Prometheus integration** : Added prometheus integration to alert for any anomalies like response time threshold / app server down in the 
prometheus alert manager 

**dlq topic** : added dlq topic integration in case of failed follower topic consumption 

- **initial cdc logic integration (POC)** - adding CDC functionality with debezium connector whenever any schema changes happen in 
user,post,follower,like tables corresponding  stream is appended in the debezium connector and corresponding stream is ingested for consumption 
to create documents in the corresponding mongodb tables (topics corresponding to tables are already created in the connector and consumed to be created 
as separate table in mongo db).

-**implementation of basic upload functionality** - implementing basic upload functionality of image,video items locally for completeness
(ideally we should be using AWS S3 for upload functionality for scalability reasons)



### Fixes
- Placeholder for future fixes.


## [1.0.2] - 2024-08-03 (Branch:`instagramV2`)
### Enhancements
- **strategy pattern of assetConsumer** - Added initial strategy patter between filtering tags either using generic NLP algorithm or chagpt implementation(chat gpt implementation was a WIP with no fallback mechanism)


### New Features

-***load testing** : added load testing configurations using artillery to tests various scenarios of the user register, user login,
updating user profile by adding relevant tags interested,creating posts, get all posts for the user, get feeds

-***metrics**:Integrating influx db for fetching metrics of request , response times taken by each endpoint by integrating it as middleware
and thus capturing it in grafana

- **Posts**: Introduced the ability to tag posts with multiple categories, allowing for more nuanced categorization and discovery.

-***feeds api** : Integration of feeds api endpoint which fetches feeds based on the agrregation of user following posts and post's tags interested(tags filtered internally by assetConsumer api from the posts)

-**test cases** : adding test cases for  user,post,like,comment modules (controller,service ) using jest

-**fetch follower consumer** : added kafka consumer fetching top n users having most followers

-**pgbouncer integration** : integrated pgbouncer for postgres connection pooling 

-**addition of raw query feature** - addition of raw query consuming pgbouncer connection pooling where join queries were consuming lot of time as an initial optimization . 

-**redis caching** - added caching layer in post,follower,feeds fetch endpoints to avoid fetching same data again from db (which avoids consuming db resource for same db call)

-**logger module** - adding logger module using winston library which is used to log events in file (with debug,error )

-**elk feature** - added elk integration which consumes log from the file logged by winston logger


## Bug Fix

- fixing bug in PostService when tags can be null and optimizing load test yml file for get posts api, integration of chatGpt assetConsumer fetching tags from chatGpt prompt passing the asset text

## [1.0.1] - 2024-07-23 (Branch: `intagragramV1`)
### Enhancements
- **User Profile**: Overhauled the user profile structure to include a richer set of information, such as multiple interested tags for viewing feeds, contact details, and language preferences, thereby enriching the user experience.
- **Authentication**: Refined the authentication process to leverage JWT token signatures for user identification, enhancing security and simplifying the API design.

### New Features 
- **Social Graph**: Implemented a comprehensive followers and following system, enabling users to build their network within the platform.
-**load testing** Implmented load testing framework with artiller  by building scenarios with user register / login, user post creation , fetch posts , comment creation on post 

-**dao and service** Implemented dao - service integration so that controller talks to service layer which then talks to dao layer instead of communicating directly to the data store directly from service layer

-**modular components** Implemented  user,post,like,comment modules having its own controller , routes component


## [1.0.0] - 2024-07-04 (Branch: `main`)
### Initial Release
- **Core Features**:
  - **Authentication**: Launched with basic login and registration capabilities.
  - **Content Creation**: Enabled users to create and view posts, along with basic commenting functionality.
  - **Engagement**: Introduced a like feature for posts and implemented basic user-level caching to optimize performance.