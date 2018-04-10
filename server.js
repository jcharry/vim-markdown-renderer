#!/usr/bin/env node
const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');
const program = require('commander');

program
  .version('0.1.0')
  .option('--file <path>', 'file to watch')
  .option('--PORT <n>', 'server port', parseInt)
  .parse(process.argv);

const PORT = program.PORT || 9723;
const file = program.file || path.resolve(__dirname, 'default.md');

app.use(express.static(path.join(__dirname, 'dist')));

app.get('/', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
});

app.get('/filename', (req, res) => {
  res.send(file);
});

app.listen(PORT, () => {
  console.log('listening on port', PORT);
});
