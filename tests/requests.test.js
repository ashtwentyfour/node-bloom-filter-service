const request = require('supertest');
const app = require('../app.js');

describe('PUT Endpoints', () => {
    it('should insert into Bloom Filter', async () => {
        const res = await request(app)
            .put('/api/insert')
            .send({
                'item': 'testitem',
            });
        expect(res.statusCode).toEqual(201);
  });
});

describe('GET Endpoints', () => {
    it('should lookup an item in Bloom Filter', async () => {
        const res = await request(app)
            .get('/api/testitem');
        expect(res.statusCode).toEqual(200);
        expect(res.body.body.message).toBe('testitem is probably present');
    });
});