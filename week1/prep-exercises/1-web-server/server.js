const http = require('http');
const fs = require('fs');

let server = http.createServer((req, res) => {
  if (req.url === '/') {
    fs.readFile('index.html','utf-8', function (err, htmlContent) {
      if (err) {
        res.statusCode = 500; 
        res.end('Error reading index.html');
        return;
      }
        res.setHeader('Content-Type', 'text/html'); 
        res.write(htmlContent); 
        res.end(); 
    });
  }else if(req.url === '/index.js'){

     fs.readFile('index.js', 'utf-8', function (err, jsContent) {
      if (err) {
        res.statusCode = 500; 
        res.end('Error reading index.js');
        return;
      }
      res.setHeader('Content-Type', 'application/javascript'); 
      res.write(jsContent); 
      res.end();
    });

    
  }else if (req.url === '/style.css') {
    // Serve the CSS file
    fs.readFile('style.css', 'utf-8', function (err, cssContent) {
      if (err) {
        res.statusCode = 500; // Internal server error
        res.end('Error reading style.css');
        return;
      }
      res.setHeader('Content-Type', 'text/css');
      res.write(cssContent); 
      res.end(); 
    });

    
  }else{
  
  res.statusCode = 404;
  res.end('Page not found');
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
