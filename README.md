This is a udagram app where user can create posts with caption and image.
To run the client application on local use npm run start script.
This application is created using serverless architecture.Reference taken from Module 4 project.


The application allows users to create, update, delete posts. The application allows users to upload image for the post.

The application only displays items for a logged in user.

AUTH0 is used to implement authentication and and does not allow unauthenticated access.


The code is split into multiple layers separating business logic from I/O related code.

All resources in the application are defined in the "serverless.yml" file.

Each function has its own set of permissions.

HTTP requests are validated by using the serverless-reqvalidator-plugin or by providing request schemas in function definitions.

Data is stored in DynamoDB table Posts  with a composite key (UserId and PostId). Where UserId and PostId has 1:M relationship.

Posts are fetched using the "query()" method and not "scan()" method (which is less efficient on large datasets). 

Distributed tracing is enabled.

CloudWatch is using for logging.

