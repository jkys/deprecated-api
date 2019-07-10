/**
 * Set a header with the given value and if the header already exists with a value, then to contact
 * the value into a comma-delimited string.
 *
 * @param {Object} res the express response object
 * @param {String} header the name of the http header to be set
 * @param {String} option the value of the header to be set
 */
const addHeader = (res, header, option) => {
  if (option) {
    if (res.get(header)) {
      const headers = [option];
      res.set(header, headers.concat(res.get(header)));
    } else {
      res.set(header, option);
    }
  }
};

/**
 * The main middleware to add headers and set values for the express response object.
 *
 * @param {Object} options the deprecation date and message for the middleware to use
 */
module.exports = options => (req, res, next) => {
  res.set('x-api-deprecated', true);

  if (!options) {
    return next();
  }

  addHeader(res, 'x-api-deprecation-date', options.date);
  addHeader(res, 'x-api-deprecation-message', options.message);

  return next();
};
