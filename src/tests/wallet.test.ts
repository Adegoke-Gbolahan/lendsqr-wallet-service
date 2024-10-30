import request from 'supertest';
import app from '../app';


const userData = {
  "nin":"80451134700",
  "email":"adegokegbolahan24@gmail.com",
  "bvn":"22412063989",
  "phone_number":"2348069159748",
  "password":"sam2323@2dffnkd"
};

let authToken = ''; 

describe('Authentication and Wallet API Tests', () => {
  
  // Test User Registration
  it('should register a new user', async () => {
    const res = await request(app)
      .post('/api/register-user')
      .send(userData);

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('message', 'User registered successfully');
  });

  // Test User Login
  it('should log in an existing user', async () => {
    const res = await request(app)
      .post('/api/login')
      .send({
        email: userData.email,
        password: userData.password
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    authToken = res.body.token; 
  });

  // Wallet Funding Test
  describe('Wallet API', () => {
    it('should fund wallet successfully', async () => {
      const token = 
        ''; 

      const res = await request(app)
        .post('/api/fund-wallet')
        .set('Authorization', `Bearer ${token}`)
        .send({ userId: 8, amount: 1000 });

      expect(res.statusCode).toEqual(200);
      expect(res.body.message).toBe('Wallet funded successfully');
    });

    // Test Wallet Withdrawal
    it('should withdraw money from the wallet', async () => {
      const res = await request(app)
        .post('/api/wallet-withdrawal')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ userId: 8, amount: 1000 });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Withdrawal is successful');
      expect(res.body).toHaveProperty('balance');
    });

    // Test Money Transfer
    it('should transfer money to another user', async () => {
      const res = await request(app)
        .post('/api/transfer-fund')
        .set('Authorization', `Bearer ${authToken}`)
        .send({
          senderId: 8,
          recipientId: 9,
          amount: 20,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('message', 'Transfer successful.');
      expect(res.body).toHaveProperty('balance');
    });
  });
});
