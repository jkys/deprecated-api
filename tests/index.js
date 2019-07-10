const express = require('express');
const http = require('http');
const request = require('supertest');

const apiDeprecated = require('../src/index.js');

const deprecatedHeaderGeneral = 'x-api-deprecated';
const deprecatedHeaderDate = 'x-api-deprecation-date';
const deprecatedHeaderMessage = 'x-api-deprecation-message';

const createServer = (option1, option2) => {
  const app = express();
  app.use(apiDeprecated(option1));

  if (option2) {
    app.use(apiDeprecated(option2));
  }

  app.use('/', (req, res) => res.sendStatus(200));
  return http.createServer(app);
};

describe('apiDeprecated', () => {
  describe('when there is a message and date attached', () => {
    it('should add all the deprecation data to the response headers', async () => {
      const message = 'This api is being upgraded to V2';
      const date = '1970-01-01';
      const server = createServer({ message, date });

      const { header } = await request(server)
        .get('/')
        .expect(200);

      expect(header[deprecatedHeaderGeneral]).toBe('true');
      expect(header[deprecatedHeaderDate]).toBe(date);
      expect(header[deprecatedHeaderMessage]).toBe(message);

      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderGeneral)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderMessage)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderDate)).toBe(true);
    });
  });

  describe('when there is no message attached', () => {
    it('there should be no x-api-deprecation-message header', async () => {
      const date = '1970-01-01';
      const server = createServer({ date });

      const { header } = await request(server)
        .get('/')
        .expect(200);

      expect(header[deprecatedHeaderGeneral]).toBe('true');
      expect(header[deprecatedHeaderDate]).toBe(date);
      expect(header[deprecatedHeaderMessage]).toBe(undefined);

      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderGeneral)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderMessage)).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderDate)).toBe(true);
    });
  });

  describe('when there is no date attached', () => {
    it('there should be no x-api-deprecation-date header', async () => {
      const message = 'This api is being upgraded to V2';
      const server = createServer({ message });

      const { header } = await request(server)
        .get('/')
        .expect(200);

      expect(header[deprecatedHeaderGeneral]).toBe('true');
      expect(header[deprecatedHeaderDate]).toBe(undefined);
      expect(header[deprecatedHeaderMessage]).toBe(message);

      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderGeneral)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderMessage)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderDate)).toBe(false);
    });
  });

  describe('when there is no message or date attached', () => {
    it('there should be no x-api-deprecation-date header', async () => {
      const server = createServer();

      const { header } = await request(server)
        .get('/')
        .expect(200);

      expect(header[deprecatedHeaderGeneral]).toBe('true');
      expect(header[deprecatedHeaderDate]).toBe(undefined);
      expect(header[deprecatedHeaderMessage]).toBe(undefined);

      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderGeneral)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderDate)).toBe(false);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderMessage)).toBe(false);
    });
  });

  describe('when there are multiple api deprecated middlewares on one route', () => {
    it('it will concat the messages to display all of them', async () => {
      const option1 = {
        message: 'This api is being upgraded to V2',
        date: '1970-01-01',
      };

      const option2 = {
        message: 'This api is being moved to /api',
        date: '1970-01-02',
      };

      const server = createServer(option1, option2);

      const { header } = await request(server)
        .get('/')
        .expect(200);

      expect(header[deprecatedHeaderGeneral]).toBe('true');

      expect(header[deprecatedHeaderMessage].includes(option1.message)).toBe(true);
      expect(header[deprecatedHeaderMessage].includes(option2.message)).toBe(true);

      expect(header[deprecatedHeaderDate].includes(option1.date)).toBe(true);
      expect(header[deprecatedHeaderDate].includes(option2.date)).toBe(true);

      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderGeneral)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderMessage)).toBe(true);
      expect(Object.prototype.hasOwnProperty.call(header, deprecatedHeaderDate)).toBe(true);
    });
  });
});
