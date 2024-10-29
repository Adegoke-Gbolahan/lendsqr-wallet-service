import request from 'supertest';
import app from '../app';

describe('Wallet API', () => {
  it('should fund wallet successfully', async () => {
    const res = await request(app)
      .post('/api/fund')
      .send({ userId: 1, amount: 1000 });

    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toBe('Wallet funded successfully');
  });
});

