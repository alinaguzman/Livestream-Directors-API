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

* **URL**

  /api/directors/:id

* **Method:**

  `GET`

* **Success Response:**

    **Content:** `{ directors : director }`
    ```
    {
    director: {
    full_name: "Heather Bradshaw",
    dob: "1975-10-22T00:00:00.000Z",
    favorite_camera: "sony",
    favorite_movies: [
    "lost in translation",
    " ted"
    ]
    }
    }
    ```

* **Error Response:**

    **Content:** `{ error : "No directors in the list or error fetching" }`