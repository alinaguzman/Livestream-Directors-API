Livestream-Directors-API
========================

  API designed to register and list movie directors that have accounts on Livestream. Uses Postgres database directors.

* **URL and Method**

  `GET` /api/directors

* **Success Response:**

    **Content:** `{ directors : directorList }`

* **Error Response:**

    **Content:** `{ error : "No directors in the list or error fetching" }`

---

* **URL and Method**

  `GET` /api/directors/:id

* **Success Response:**

    **Content Example:**
    ```
    director: {
        full_name: "Martin Scorsese",
        dob: "1975-10-22T00:00:00.000Z",
        favorite_camera: "Sony",
        favorite_movies: [
            "Lost in Translation",
            " Ted"
        ]
    }
    ```

* **Error Response:**

    **Content:** `{ error : "No director with this id" }`

    ---
* **URL and Method**

  `POST` /api/directors

* **Data Params**

    ```
    livestream_id = numeric string
    camera = string
    movies = string with comma separated values
    ```

* **Success Response:**

    * **Code:** 200 <br />

* **Error Response:**

    **Content:** `{ error : "Error saving director if account already exists or server error" }`

    ---

* **URL and Method**

  `POST` /api/directors/:id

* **Authorization Header:**

  Uses a bearer token to check for authorization before updating


* **Data Params**

    ```
    camera = string
    movies = string with comma separated values
    ```

* **Success Response:**

    * **Code:** 200 <br />

    * **Content Example:**
    ```
    director: {
        full_name: "Martin Scorsese",
        dob: "1975-10-22T00:00:00.000Z",
        favorite_camera: "Sony",
        favorite_movies: "Lost in Translation, Ted"
    }
    ```

* **Error Response:**

    **Content:** `{ error : "Error updating director unauthorized" }`

* **Conditions:**

   **Updates only favorite_camera or favorite_movies attributes.**

