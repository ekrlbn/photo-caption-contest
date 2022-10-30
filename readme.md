# Photo Caption

Main goal of this project is to implement what I learned about APIs, yaml documentation and crud operations with multipart/form-data.

This API provides several paths to create profiles, post images and adding captions to other profile's images.

You can see deployed project from here:
https://photo-caption-1.herokuapp.com/

---

## Quick Start

1. Clone git repository:

   `git clone https://github.com/ekrlbn/photo-caption-contest.git`

2. Download dependencies:

   `npm install`

3. Create a Postgres database

4. Create .env file:

   `touch .env`

5. Fill the .env file according to sample.env file

6. Run script to start server

   `npm run start`

---

## Paths

### GET /api-docs

Access more detailed API documentation with Swagger UI from this path

### POST /api/user

Create new user with username and password. Responds with JWT token which authorizes users to access other paths

### POST /api/token

Request new JWT token from this path with your username and password

### GET /images

Request all the images and usernames of people who posted them

### GET /images/:id

Request any image with id of that image

### POST /images

Post a new image

### DELETE /images/:id

Delete the image with the given id

### GET /caption/:imageID

Request all the captions related to image with the given id

### POST /caption

Post a new caption

### DELETE /caption/:id

Delete the caption with the given id

---

## ERD

![ERD](ERD.png)
