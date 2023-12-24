# MovieVerse
Welcome to MovieVerse, an innovative full-stack application that revolutionizes the way users interact with movies. Dive into an immersive movie browsing experience powered by The Movie DB's public APIs.

## Features

* **Movie Details:** Access comprehensive movie details including synopses, cast information, runtime, and directorial insights directly from the intuitive user interface.

* **Authentication:** Seamless Google OAuth integration via Passport.js ensures secure and hassle-free user login with their google account.

* **Review System:** Write and view detailed movie reviews, creating a vibrant community within the platform.

* **Watchlist:** Effortlessly track movies you intend to watch, maintaining a curated list for easy reference.

* **Custom Lists:** Create personalized lists to categorize and organize favorite movies based on preferences.

* **Data Management:** Users have complete control over their data, with the ability to modify, delete, or enhance their content within MovieVerse.

## [Demo Video](https://drive.google.com/drive/folders/1wb9zmC1krbIloWP-VyzXGDzafHVyW9g6)

## Tech Stack

* **Frontend:** React with Tailwind CSS
* **Backend:** Node.js with Express
* **Database:** MongoDB

## Getting Started

Clone the repository
`git clone https://github.com/pai-aditya/MovieVerse.git`

### Update .env file


This project utilizes an .env file to manage environment-specific configuration settings. Ensure the following variables are properly set in your .env file in your backend folder:

- `MONGO_CONNECTION:` Connection string to your MongoDB cluster where user data for MovieVerse is stored. Please follow [This tutorial](https://dev.to/dalalrohit/how-to-connect-to-mongodb-atlas-using-node-js-k9i) to create your mongoDB connection url, which you'll use as your MONGO_CONNECTION.


- `CLIENT_ID and CLIENT_SECRET:` Google OAuth credentials required for authentication within the application. To get your Google ClientID for authentication, go to the [credential Page ](https://console.cloud.google.com/apis/credentials) (if you are new, then [create a new project first](https://console.cloud.google.com/projectcreate) and follow the following steps).


- `CLIENT_URL:` The URL where the frontend of MovieVerse is hosted. (e.g., http://localhost:5173)

- `SERVER_URL:` The URL where the backend server of MovieVerse is hosted. (e.g., http://localhost:5555)

**Server side**


```
cd backend
```

```
npm i
```

```
nodemon index.js
```

The server will start running on localhost:5555.

***Client Side***


```
cd frontend
```

```
npm i
```

```
npm run dev
```

The client will start running on localhost:5173.

## Author

- Github: [pai-aditya](https://github.com/pai-aditya)
- Linkedin: [Aditya Pai](https://www.linkedin.com/in/aditya-pai-581b2621a/)
- Email: [pai.aditya2011@gmail.com](mailto:pai.aditya2011@gmail.com)