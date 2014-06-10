Livestream-Directors-API
========================

  API designed to register and list movie directors that have accounts on Livestream

* **URL**

  /api/directors

* **Method:**

  `GET`

* **Success Response:**

    **Content:** `{ directors : directorList }`

* **Error Response:**

    **Content:** `{ error : "No directors in the list or error fetching" }`

---

* **URL**

  /api/directors/:id

* **Method:**

  `GET`

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

    **Content:** `{ error : "No directors in the list or error fetching" }`

    ---
* **URL**

  /api/directors

* **Method:**

  `POST`

* **Data Params**

    ```
    livestream_id = numeric string
    camera = string
    movies = string with comma separated values
    ```

* **Success Response:**

    **Content Example:**
    ```
    director: {
        full_name: "Martin Scorsese",
        dob: "1975-10-22T00:00:00.000Z",
        favorite_camera: "Sony",
        favorite_movies: "Lost in Translation, Ted"
    }
    ```

* **Error Response:**

    **Content:** `{ error : "Error saving director if account already exists or server error" }`

    ---