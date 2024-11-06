const express = require("express");
const axios = require("axios");
const db = require("./db");
const app = express();
const PORT = 3000;

const highRiskCountries = [
  "CN", // China
  "RU", // Russia
  "KP", // North Korea
  "IR", // Iran
  "SY", // Syria
];

function isValidIP(ip) {
  const ipv4Regex =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}([0-9a-fA-F]{1,4}|:)$/;

  return ipv4Regex.test(ip) || ipv6Regex.test(ip);
}

app.get("/location", async (req, res, next) => {
  const ip = req.query.ip || req.ip;
  const suggestAccess = req.query.suggestAccess === 'true';

  if (!isValidIP(ip)) {
    return res.status(400).json({ error: "Invalid IP address format." });
  }

  try {
    const response = await axios.get(
      `https://get.geojs.io/v1/ip/geo/${ip}.json`
    );
    const locationData = {
      ip: response.data.ip,
      country: response.data.country,
      region: response.data.region,
      city: response.data.city,
      countryCode: response.data.country_code,
      latitude: response.data.latitude,
      longitude: response.data.longitude,
      timezone: response.data.timezone,
      organization: response.data.organization,
    };

    let accessSuggestion = "No restrictions necessary.";
    if (suggestAccess && highRiskCountries.includes(locationData.countryCode)) {
      accessSuggestion = `Consider restricting access from ${locationData.country} due to elevated risk.`;
    }

    db.get(
      `SELECT * FROM lookup WHERE ip = ? AND country = ? AND region = ? AND city = ? ORDER BY timestamp DESC LIMIT 1`,
      [
        locationData.ip,
        locationData.country,
        locationData.region,
        locationData.city,
      ],
      (err, row) => {
        if (err) {
          return next(err);
        }

        if (!row) {
          db.run(
            `INSERT INTO lookup (ip, country, region, city, latitude, longitude, timezone, organization) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              locationData.ip,
              locationData.country,
              locationData.region,
              locationData.city,
              locationData.latitude,
              locationData.longitude,
              locationData.timezone,
              locationData.organization,
            ],
            (err) => {
              if (err) return next(err);
            }
          );
        }
      }
    );

    res.json({ location: locationData, accessSuggestion });
  } catch (error) {
    next(error);
  }
});

app.get("/history", (req, res) => {
  const ip = req.query.ip;

  if (!isValidIP(ip)) {
    return res.status(400).json({ error: "Invalid IP address format." });
  }

  db.all(
    `SELECT * FROM lookup WHERE ip = ? ORDER BY timestamp DESC`,
    [ip],
    (err, rows) => {
      if (err) {
        return res.status(500).json({ error: "Error retrieving IP history." });
      }

      if (rows.length === 0) {
        return res
          .status(404)
          .json({ error: "No history found for this IP address." });
      }

      res.json(rows);
    }
  );
});

app.listen(PORT, () => {
  console.log(`Geo-IP Location Service running on port ${PORT}`);
});
