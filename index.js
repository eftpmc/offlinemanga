const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/get-images', async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET');

  const url = req.query.url;

  if (!url) {
    return res.status(400).json({ error: 'Please provide a URL to fetch' });
  }

  // Determine the root URL
  const rootUrl = getRootUrl(url);

  // Generate the file path based on the root URL
  const filePath = path.join(__dirname, 'responses', `${rootUrl}.js`);

  try {
    // Check if the response file exists
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Response not found' });
    }

    // Execute the response file as a function and await the response
    const response = await require(filePath)(url);
    if (typeof response !== 'object' || response === null) {
      throw new Error('Invalid response');
    }

    console.log('Response:', response); // Debugging: Log the response object

    return res.status(200).json(response);
  } catch (error) {
    console.log('Error:', error); // Debugging: Log the error

    return res.status(500).json({ error: 'Error fetching the response' });
  }
});

// Helper function to extract the root URL
function getRootUrl(url) {
  const match = url.match(/^(?:https?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:/\n]+)/im);
  return match ? match[1] : '';
}
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});