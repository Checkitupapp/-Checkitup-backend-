const express = require('express');
const morgan = require('morgan');
const compression = require('compression');
const cors = require('cors');
const testRoute = require('./routes/testRoute');
const userRouter = require('./routes/userRoute');

const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/globalErrorController');

const app = express();
//implement cors
app.use(cors());
app.options('*', cors());

app.use(express.json());
//use morgan only in dev
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use('/test', testRoute);

app.use('/api/users', userRouter);

// for any routes that were not defined -> must be at the end
app.all('*', (req, res, next) => {
  // const err = new Error(
  //   `No route defined for the the following route: (${req.originalUrl})`
  // );
  // err.status = 'fail';
  // err.statusCode = 404;
  const err = new AppError(
    `No route defined for the the following route: (${req.originalUrl})`,
    404
  );
  next(err);
});

//gzip compression
app.use(compression());

// global error handling middleware: with 4 args: err, req, res, next; express auto recognizes it as error handling middleware
app.use(globalErrorController);

module.exports = app;
