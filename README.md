# deprecated-api

[![NPM Version][npm-version-image]][npm-url]
[![Build status][travis-image]][travis-url]

## Installation

This is a [Node.js](https://nodejs.org/en/) module available through the
[npm registry](https://www.npmjs.com/). Installation is done using the
[`npm install` command](https://docs.npmjs.com/getting-started/installing-npm-packages-locally):

```sh
$ npm install deprecated-api
```

## API

```javascript
var deprecatedApi = require('deprecated-api');
```

### deprecatedApi([options])

Creates a middleware function which adds deprecation messages to the response headers. The only header which is always set is the `x-api-deprecated` in the form of a boolean always set to `true` when the middleware is encountered for a route.

#### options

The parameter passed to the depcratedApi middleware which optionally contains the following object keys. If any of the keys are missing the additional HTTP header will be left unused and will not be attached to the response object. In the case of the middleware being encountered multiple times in one route path, it will contact the message into an array form and displayed as a single string, comma-delimited.

##### message

The value to be set under the `x-api-deprecation-message` header in string form.

##### date

The value to be set under the `x-api-deprecation-date` header in string form.


## examples

When the only one deprecation is used:

```javascript
var options = {
  message: 'This API route is deprecated',
  date: '1970-01-01',
};

app.use(apiDeprecated(options));
```

```javascript
{
  'x-api-deprecated': 'true',
  'x-api-deprecation-date': '1970-01-01',
  'x-api-deprecation-message': 'This API route is deprecated'
}
```

When the deprecation middleware encounters multiple different messages and dates.

```javascript
var option1 = {
  message: 'This API route is deprecated',
  date: '1970-01-01',
};

var option2 = {
  message: 'This API route is deprecated as well',
  date: '1970-01-02',
};

app.use(apiDeprecated(option1));

app.use(apiDeprecated(options));
```

```javascript
{
  'x-api-deprecated': 'true',
  'x-api-deprecation-date': '1970-01-02, 1970-01-01',
  'x-api-deprecation-message': 'This API route is deprecated as well, This api is being upgraded to V2'
}
```


[npm-url]: https://npmjs.org/package/deprecated-api
[npm-version-image]: https://badgen.net/npm/v/deprecated-api
[travis-image]: https://travis-ci.org/jkys/deprecated-api.svg?branch=master
[travis-url]: https://travis-ci.org/jkys/deprecated-api
