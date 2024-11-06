const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

app.get('/location', async (req, res) => {
  const ip = req.query.ip || req.ip; // Use provided IP or request IP as fallback

  try {
    // Call GeoJS API to get location data
    const response = await axios.get(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
    
    // Send the response data back to the client
    res.json({
      ip: response.data.ip,
      country: response.data.country,
      region: response.data.region,
      city: response.data.city,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      organization: response.data.organization,
    });
  } catch (error) {
    console.error("Error fetching location data:", error);
    res.status(500).json({ error: "Failed to fetch location data" });
  }
});

app.listen(PORT, () => {
  console.log(`Geo-IP Location Service is running on port ${PORT}`);
});
