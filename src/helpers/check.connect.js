'use strict';
import mongoose from 'mongoose';
import os from 'os';
import process from 'process';
const _SECONDS = 5000;
//count Connect
const countConnect = () => {
  const numConnect = mongoose.connections.length;
  console.log(`Number of connections:: ${numConnect}`);
};

//check over load
const checkOverLoad = () => {
  setInterval(() => {
    const numConnection = mongoose.connections.length;
    const numCores = os.cpus.length;
    const memoryUsage = process.memoryUsage().rss;
    // EX maximum number of connections base on number of cores
    const maxConnections = numCores * 5;
    console.log(`Active connections:${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024} MB`);

    if (numConnection > maxConnections) {
      console.log(`Connection overload detected`);
      //notify.send(.....)
    }
  }, _SECONDS); // Monitor every 5 seconds
};
export { countConnect, checkOverLoad };
