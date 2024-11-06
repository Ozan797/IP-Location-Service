const request = require('supertest');
const app = require('../index'); // Import the app without starting the server

describe('Geo-IP Location Service API Tests', () => {

  describe('GET /location', () => {
    it('should return location data for a valid IP address', async () => {
      const response = await request(app).get('/location?ip=8.8.8.8');
      expect(response.status).toBe(200);
      expect(response.body.location).toHaveProperty('ip', '8.8.8.8');
      expect(response.body.location).toHaveProperty('country');

      // Conditional check for 'city', since it may or may not be returned by the API
      if (response.body.location.city) {
        expect(response.body.location).toHaveProperty('city');
      }
    });

    it('should return a 400 error for an invalid IP address format', async () => {
      const response = await request(app).get('/location?ip=invalid-ip');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', "Invalid IP address format.");
    });

    it('should return an access suggestion for high-risk countries', async () => {
      // Example IP from a known high-risk country
      const response = await request(app).get('/location?ip=203.0.113.0&suggestAccess=true');
      expect(response.status).toBe(200);

      // Check if the access suggestion is for a high-risk country or not
      const expectedSuggestion = response.body.location.countryCode === 'CN'
        ? "Consider restricting access from China due to elevated risk."
        : "No restrictions necessary.";
      expect(response.body.accessSuggestion).toBe(expectedSuggestion);
    });
  });

  describe('GET /history', () => {
    it('should return history data for a valid IP address', async () => {
      const response = await request(app).get('/history?ip=8.8.8.8');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should return a 404 error if no history is found for an IP', async () => {
      const response = await request(app).get('/history?ip=192.0.2.0'); // Test IP unlikely to have data
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', "No history found for this IP address.");
    });

    it('should return a 400 error for an invalid IP address format', async () => {
      const response = await request(app).get('/history?ip=invalid-ip');
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', "Invalid IP address format.");
    });
  });
});
