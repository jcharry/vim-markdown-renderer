#!/usr/bin/env node
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { spawn, exec } = require('child_process');
const program = require('commander');

program
  .version('0.1.0')
  .option('--file <path>', 'file to watch')
  .parse(process.argv);

const file = program.file || path.resolve(__dirname, 'default.md');
const basePort = 9723;

const isPortOpen = (port, fn) => {
  return new Promise((resolve, reject) => {
    const net = require('net')
    const tester = net.createServer()
      .once('error', function (err) {
        console.log('port had an error', err);
        reject(err);
      })
      .once('listening', function() {
        tester.once('close', function() {
          console.log('will resolve');
          resolve(port);
        }).close()
      })
      .listen(port)
  });
}

let attempts = 0;
const openPort = () => {
  attempts++;
  let port = basePort + Math.floor(Math.random() * 1000);
  isPortOpen(port).then(() => {
    console.log('opening port', port, file);
    spawn(
      'node', [ `${__dirname}/server.js`, `--file`, `${file}`, `--PORT`, `${port}` ],
      { detached: true },
      (err, stdout, stderr) => {
        console.log(err, stdout, stderr);
      }
    );
    exec(`open http://localhost:${port}`);
    return;
  }).catch((err) => {
    if (attempts < 5) {
      openPort();
    }
  });
}

openPort();
