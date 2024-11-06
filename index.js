const express = require('express');
const axios = require('axios');

const app = express();
const PORT = 3000;

// Helper function to validate IP address format
function isValidIP(ip) {
  const ipv4Regex = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
  
  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

// Geo-IP Location endpoint
app.get('/location', async (req, res, next) => {
  const ip = req.query.ip || req.ip; // Use query IP or request IP as fallback

  // Validate IP format
  if (!isValidIP(ip)) {
    return res.status(400).json({ error: "Invalid IP address format." });
  }

  try {
    // Call GeoJS API to get location data
    const response = await axios.get(`https://get.geojs.io/v1/ip/geo/${ip}.json`);
    
    // Return the data from GeoJS API
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
    // Pass any error to the error-handling middleware
    next(error);
  }
});

// Error-handling middleware
app.use((error, req, res, next) => {
  console.error("Error:", error.message || error);

  // Handle specific error cases
  if (error.response && error.response.status === 404) {
    return res.status(404).json({ error: "IP location data not found." });
  }
  
  // Handle network or third-party API issues
  if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
    return res.status(503).json({ error: "GeoJS service is currently unavailable. Please try again later." });
  }

  // Default to 500 Internal Server Error for other cases
  res.status(500).json({ error: "Internal server error. Please try again later." });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Geo-IP Location Service is running on port ${PORT}`);
});
