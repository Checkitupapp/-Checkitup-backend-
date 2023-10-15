const mongoose = require('mongoose');
//server config
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });

const app = require('./app');
const Serverless = require('twilio/lib/rest/Serverless');
//connest mongoDB using DATABASE conection string in env variables
const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DB_PASSWORD);
mongoose
  .connect(DB, {
    // useNewUrlParser: true,
    // useCreateIndex: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log('✔ Connection to database successfull !');
  });
// mongoose.set('strictQuery', true);

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`✔ server Started on port ${PORT}`);
});
process.on('unhandledRejection', (err) => {
  console.log('Unhandled rejection error. 💥 shudding down...');
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
// specific to heroku
process.on('SIGTERM', () => {
  console.log('SIGTERM: shutting down... 👋');

  server.close(() => {
    console.log('process terminated. 💥');
  });
});
