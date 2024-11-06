const app = require('./index'); // Import the app from index.js

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Geo-IP Location Service running on port ${PORT}`);
});
