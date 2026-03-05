const http = require('node:http');
const { requestHandler } = require('./app');

const PORT = process.env.PORT || 3000;

const server = http.createServer(requestHandler);
server.listen(PORT, () => {
  console.log(`JWT demo server running at http://localhost:${PORT}`);
});
