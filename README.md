# IP Location Service

The **IP Location Service** is a Node.js application that provides location and security related information based on an IP address. This service integrates geolocation and security features, including country-based access restriction suggestions.

## Features

- **Location Lookup**: Retrieve detailed location data for a specified IP address.
- **IP History Tracking**: Store and retrieve historical location data for IP addresses.
- **Country-Based Access Suggestions**: Suggest access restrictions for high-risk countries.
- **Security-Focused**: Designed for cybersecurity applications, providing insights for IP-based risk management.

---

## Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/Ozan797/IP-Location-Service.git
   cd IP-Location-Service
   
2. **Install Dependencies**:
   ```bash
   npm install
3. **Set Up Database**:
   - Ensure **sqlite3** is installed for managing the local SQLite database. This is handled automatically in the project setup.
4. **Start the Server**:
   ```bash
   node index.js

## API Endpoints

### 1. **Location Lookup**
   Retrieve location details for a given IP address.

   - **URL**: `/location`
   - **Method**: `GET`
   - **Query Parameters**:
     - `ip` (optional): IP address to lookup. If not provided, the request's own IP will be used.
     - `suggestAccess` (optional): Set to `true` to enable country-based access restriction suggestions.
   - **Response**:
     ```json
     {
       "location": {
         "ip": "8.8.8.8",
         "country": "United States",
         "region": "California",
         "city": "Mountain View",
         "latitude": "37.386",
         "longitude": "-122.0838",
         "timezone": "America/Los_Angeles",
         "organization": "Google LLC"
       },
       "accessSuggestion": "No restrictions necessary."
     }

     {
       "location": {
         "ip": "221.192.199.49",
        "country": "China",
        "countryCode": "CN",
        "latitude": "34.7732",
        "longitude": "113.722",
        "timezone": "Asia/Shanghai",
        "organization": "AS4837 CHINA UNICOM China169 Backbone"
       },
        "accessSuggestion": "Consider restricting access from China due to elevated risk."
     }
     ```

     
   - **Example**:
     ```
     GET http://localhost:3000/location?ip=8.8.8.8&suggestAccess=true
     ```

   - **Access Suggestion**:
     - If the IP’s country is on a predefined high-risk list, the response will include a suggestion to restrict access from that region.
     - High-risk countries are: China, Russia, North Korea, Iran, and Syria.

### 2. **IP History**
   Retrieve historical location records for a specified IP address.

   - **URL**: `/history`
   - **Method**: `GET`
   - **Query Parameters**:
     - `ip` (required): The IP address for which to retrieve history.
   - **Response**:
     ```json
     [
       {
         "id": 1,
         "ip": "8.8.8.8",
         "country": "United States",
         "region": "California",
         "city": "Mountain View",
         "latitude": "37.386",
         "longitude": "-122.0838",
         "timezone": "America/Los_Angeles",
         "organization": "Google LLC",
         "timestamp": "2024-11-06T12:34:56.789Z"
       },
       ...
     ]
     ```
   - **Example**:
     ```
     GET http://localhost:3000/history?ip=8.8.8.8
     ```

---

## Project Structure

- **`index.js`**: Main application file containing endpoint logic.
- **`db.js`**: SQLite setup and connection configuration.
- **`README.md`**: Project documentation.

---

## Dependencies

- **Express**: Web framework for Node.js.
- **Axios**: Promise-based HTTP client for making API requests.
- **SQLite3**: Lightweight database to store IP history.
- **GeoJS API**: Third-party geolocation service for retrieving location data.

---

## Future Enhancements

- **Real-Time IP Monitoring**: Allow users to monitor IPs and receive alerts if flagged.
- **Weather Data Integration**: Provide weather information for IP location.
- **User Authentication**: Add authentication to secure access to certain features, especially IP history.

---

## License

This project is licensed under the MIT License.

---

## Acknowledgments

This project integrates data from the [GeoJS API](https://www.geojs.io/) for geolocation services.
