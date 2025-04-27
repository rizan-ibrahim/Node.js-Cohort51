const http = require('http');

// Create a server
let server = http.createServer((req, res) => {
  // Set the response HTTP header
  res.writeHead(200, { 'Content-Type': 'text/plain' });

  // Send a response back to the client
  res.write('Hello World!');

  // End the response
  res.end();
});

// The server starts to listen on port 3000
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
