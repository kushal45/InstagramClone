# Changelog

# [1.0.0]
1. Login 
2. Register
3. Post 
4. Comment (Basic create/view comment / view comments)
5. single tag with enums defining predefined tags
6. like on Post with like count 
7. Basic caching on user level

## [Unreleased]

## [1.0.1]
1. migration of existing content to support new structure
2. User profile
  i) tags interested - multiple
  ii) user id
  iii)Contact Information
  iv) Name
  v) Profile picture
  vi)Language preferences 
  vii) followers count , following count

3. Pass userId from the jwt token's signature instead of request body in Users,posts, comments, likes,follow

3. Followers and Following 
4. Redis Caching for posts, comments, followers, following




## [1.0.3]

1. Make errors not to propagate to the client 
2. Adding proper logs for debugging  and integrating logging layer 
3. Post with multiple tags
4. Feeds

### Fixed
- NA 

## [1.0.0] 
- Initial release.