# Weather App
**Deployed to Heroku and MongoDB Atlas Cloud**

**View application here:**
[Weather App](https://palmetto-weather-app-a0d4be754f7c.herokuapp.com/)

## Overview

This Weather App is designed to provide users with weather information for their current location, as well as for locations they choose to save. The app leverages various modern technologies, including Google Maps API for location services and the OpenWeatherMap API for weather data. The app also employs a user tracking system using cookies, with a fallback to IP address tracking if cookies are not available.

## Features

### User Tracking
- **Cookie-Based Tracking**: The app primarily uses cookies to identify and track users.
- **IP Address Fallback**: If cookies are not available, the app falls back to tracking users by their IP address.

### Location Services
- **Current Location**: Users can retrieve weather information for their current location using Google's geolocation services.
- **City and State**: Users can manually enter a city and state to get the weather information for that location.
- **Google Places API**: Users can use the Google Places API for more accurate location searching and selection.

### Favorite Locations
- **Save Locations**: Users can save up to 10 favorite locations to quickly access weather information for those places.
- **Delete Locations**: Users can delete locations from their saved favorites.

## Technologies Used

### Frontend
- **React**
- **Google Places and Google Geolocator**

### Backend
- **Node.js**
- **Express**
- **MongoDB**
- **Mongoose**

### APIs
- **OpenWeatherMap API**
- **Google Places API**

### Testing
- **Jest**
- **Supertest**

## Instructions to Run the App

1. **Clone the Repository**:
    ```bash
    git clone git@github.com:BigPhatNerd/p_metto_weather_app.git
    cd weather-app
    ```

2. **Install Dependencies**:
    ```bash
    npm install
    ```

3. **Environment Variables**:
    - **Create a `.env` file in the root directory**:
      ```plaintext
      MONGO_URI=your_mongodb_uri
      ```
    - **Create a `.env` file in the client directory**:
      ```plaintext
      OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
      GOOGLE_MAPS_API_KEY=your_google_maps_api_key
      ```

4. **Run the Entire App**:
    ```bash
    npm run dev
    ```

5. **Test Backend**:
    ```bash
    npm run test:backend
    ```

6. **Test Frontend**:
    ```bash
    cd app/client
    npm run test
    ```

7. **View the App**:
    Open your browser and go to [http://localhost:5173/](http://localhost:5173/)
