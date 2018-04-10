#!/usr/bin/env node
const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { spawn, spawnSync, exec } = require('child_process');
const program = require('commander');
const config = require('./config');

program
  .version('0.1.0')
  .option('--file <path>', 'file to watch')
  .parse(process.argv);

const file = program.file || path.resolve(__dirname, 'default.md');
const basePort = 9723;

const isPortAvailable = (port, fn) => {
  return new Promise((resolve, reject) => {
    const net = require('net')
    const tester = net.createServer()
      .once('error', function (err) {
        reject(err);
      })
      .once('listening', function() {
        tester.once('close', function() {
          resolve(port);
        }).close()
      })
      .listen(port)
  });
}

let attempts = 0;
let isSocketOpen = false;
const openPort = () => {
  attempts++;
  let port = basePort + Math.floor(Math.random() * 1000);
  if (!isSocketOpen) {
    isSocketOpen = true;
    isPortAvailable(config.SOCKET_PORT).then(() => {
      let socket = spawn('node', [ `${__dirname}/socket/server.js`], {
        detached: true,
        stdio: 'ignore'
      });

      socket.unref();
    }).catch(err => {
      console.log('socket server already running');
    });
  }

  isPortAvailable(port).then(() => {
    console.log(`serving md file on localhost:${port}`);
    let server = spawn('node', [ `${__dirname}/server.js`, `--file`, `${file}`, `--PORT`, `${port}` ], {
      detached: true,
      stdio: 'ignore'
    });

    server.unref();
    exec(`open http://localhost:${port}`);
  }).catch((err) => {
    if (attempts < 5) {
      openPort();
    }
  });
}

// Kick the whole thing off
openPort();
