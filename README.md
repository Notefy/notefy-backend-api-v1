# Noto - Note taking app - Backend

Link to front end

## Description

This is the backend of the Noto app. It is a simple note taking app that allows users to create, edit, and delete notes.

## Prerequisites

-   [Node.js](https://nodejs.org/en/)
-   [MongoDB](https://www.mongodb.com/)

## Installation

1. Download the repo
2. Run `npm install` to install the required packages
3. Add the .env variable in file
4. Run `npm start` to start the server
5. Open http://localhost:5000/ to view the API

## Usage

### Authentication

For registration and login, use the following endpoints:

**Register User:**

-   `POST /api/v2/auth/register` - will register a new user

    With the following body:

    ```
    {
        "name":"[username]",
        "email":"[email]",
        "password":"[password]"
    }
    ```

    We will return the following object if successful:

    ```
    {
        "user": {
            "name": "[username]",
            "email": "[email]",
            "theme": "dark"
        },
        "token": "xxx"
    }
    ```

    Currently we only support registering with email and password.

    We support two themes: `dark` and `light`.

<!-- We only have one user with same email in the database, so we will return the following error if the user already exists: -->

**Login User:**

-   `POST /api/v2/auth/login` - will login a user

    With the following body:

    ```
    {
        "email":"[email]",
        "password":"[password]"
    }
    ```

    We will return the following object if successful:

    ```
    {
        "user": {
            "name": "[username]",
            "email": "[email]",
            "theme": "dark"
        },
        "token": "xxx"
    }
    ```

**Update User:**

-   `PATCH /api/v2/auth/user` - will update a user

    With the following body:

    ```
    {
        "name": "[username]",
        "email":"[email]",
        "password":"[password]"
    }
    ```

    We will return the following object if successful:

    ```
    {
        "user": {
            "name": "[username]",
            "email": "[email]",
            "theme": "dark"
        },
        "token": "xxx"
    }
    ```

    **Delete User:**

-   `DELETE /api/v2/auth/user` - will update a user

    With the following body:

    ```
    {
        "password":"[password]"
    }
    ```

    We will return the following object if successful:

    ```
    {
        "msg": "[username] deleted"
    }
    ```

### Files

**Create File:**

-   `POST /api/v2/file` - will create a file

    With the following body:

    ```
    {
        "name":"test",
        "type":"folder",
        "path": ""
    }
    ```

    We will return the following object if successful:

    ```
    {
        "folder": {
            "folder": {
            "name": "test",
            "tags": [],
            "path": [""],
            "color": "amber",
            "createdBy": "[user]",
            "_id": "[id]",
            "createdAt": "[Time]",
            "updatedAt": "[Time]",
            "__v": 0
            }
        }
    }
    ```

    For file type we only have `folder` and `note`.

    For path if you want to create a folder or note at root then path as empty string, else path should the path of the folder preceded by a `/`.

    -   In root = `{path: ""}`
    -   In folder1 = `{path: "/folder1"}`
    -   In folder1 in folder2 = `{path: "/folder1/folder2"}`

**Get File At Root:**

-   `GET /api/v2/file` - will get all files at root folder.

    We will return the following object if successful:

    ```
    {
        "folders": [
            {
            "_id": "[id]",
            "name": "work",
            "tags": [],
            "path": [""],
            "color": "amber",
            "createdBy": "[user]",
            "createdAt": "[Time]",
            "updatedAt": "[Time]",
            "__v": 0
            }
        ],
        "notes": [],
        "count": {
            "folders": 1,
            "notes": 0
        }
    }
    ```

    `folders` and `notes` are arrays of folder and notes.

**Get File:**

-   `GET /api/v2/file/:id` - will get the file based on `id`.

    For `folders` we will return the folder datails and the list of folders and notes under the folder.

    For `notes` we will return the note details.

**Update File:**

-   `PATCH /api/v2/file/:id` - will update the file based on `id`.

    The file URL decides the type of file to update. The propeties of the update are based on the type of file.

    -   For `folder` we will update the folder `name`, `tags` and `color`.
    -   For `note` we will update the note `title`, `data`, `tags` and `path`.

**Delete File:**

-   `DELETE /api/v2/file/:id` - will delete the file based on `id`.

    We will return the following object if successful:

    ```
    {
        "result": {
            "status": "success",
            "msg": "Note Deleted"
        }
    }
    ```
