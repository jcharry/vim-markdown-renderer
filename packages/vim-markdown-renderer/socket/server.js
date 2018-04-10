const io = require('socket.io')();
const path = require('path');
const fs = require('fs');
const config = require('../config');

io.on('connection', (client) => {
  client.on('init', (path) => {
    // If the markdown file changes
    fs.watch(path, { encoding: 'utf-8' }, (eventType, filename) => {
      client.emit('newMarkdown', fs.readFileSync(path, 'utf-8'));
    });
    // Do it once right away
    client.emit('newMarkdown', fs.readFileSync(path, 'utf-8'));
  });

  // If the client asks for updated markdown
  client.on('requestMarkdown', (path) => {
    const source = fs.readFile(path, 'utf-8', (err, source) => {
      client.emit('newMarkdown', source);
    });
  });

  client.on('disconnect', () => {
  });
});

io.listen(config.SOCKET_PORT);
