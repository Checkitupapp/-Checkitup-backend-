const AppError = require('../utils/appError');
// other error to operational errors functions
const handleCastErrorDB = (err) => {
  const message = `invalid ${err.path}: ${err.value}`;

  return new AppError(message, 400);
};
const handleDuplicateValueErrorDB = (err) => {
  const message = `Duplicate Value Error: ${err.message.match(/\{([^}]+)\}/g)}`;
  return new AppError(message, 400);
};
const handleValidationErrorsDB = (err) => {
  const errObj = err.errors;
  let message = `validation Errors: `;
  for (err in errObj) {
    message = message + `-> ${errObj[err].properties.message}`;
  }

  return new AppError(message, 400);
};
const handleTwilioError = (err) => {
  const message = err.message;
  return new AppError(message, 400);
};
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).send({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};
const sendErrorProd = (err, res) => {
  // trusted operational errors

  if (err.isOperational) {
    res.status(err.statusCode).send({
      status: err.status,
      message: err.message,
    });
  }
  // Programming errors: dont leak additional info to client
  else {
    console.log('unexpected error 💥: ', err);
    res.status(500).send({
      status: 'error',
      message: 'something went wrong!',
    });
  }
};

//main global error handler
module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    //mark errors by mongoose as operational err, to send meaningful res to client
    // let error = { ...err }; syntax not working
    //CastErrors
    if (err.name === 'CastError') err = handleCastErrorDB(err);
    // Duplicate Key Errors
    if (err.code === 11000) err = handleDuplicateValueErrorDB(err);
    //validation Errors
    if (err.name === 'ValidationError') err = handleValidationErrorsDB(err);
    //Twilio Error
    if (err.code === 21211) err = handleTwilioError(err);

    sendErrorProd(err, res);
  }
};
