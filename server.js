import app from './src/app.js';

const port = 3055;

const server = app.listen(port, () => {
  console.log(`WSV eCommerce start with ${port}`);
});

// process.on('SIGINT', () => {
//   server.close(() => console.log(`Exit Server Express`));
//   // notify.send(ping...)
// });
