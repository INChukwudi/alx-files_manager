import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import sha1 from 'sha1';
import server from '../../../server';
import dbClient from '../../../utils/db';
import UsersController from '../../../controllers/UsersController';

chai.use(chaiHttp);

describe('POST /users', () => {
  let collectionStub;

  beforeEach(() => {
    collectionStub = sinon.stub(dbClient.db, 'collection');
  });

  afterEach(() => {
    collectionStub.restore();
  });

  it('should create a new user in DB', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    collectionStub.withArgs('users').returns({
      findOne: sinon.stub().resolves(null),
      insertOne: sinon.stub().resolves({ insertedId: 'user123' }),
    });

    const response = await chai
      .request(server)
      .post('/users')
      .send(userData);

    expect(response).to.have.status(201);
    expect(response.body).to.deep.equal({ email: userData.email });
    collectionStub.restore();
  });

  it('should return an error Missing email with a status code 400 if email is missing', async () => {
    const userData = {
      password: 'password123',
    };

    const response = await chai
      .request(server)
      .post('/users')
      .send(userData);

    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal({ error: 'Missing email' });
  });

  it('should return an error Missing password with a status code 400 if password is missing', async () => {
    const userData = {
      email: 'test@example.com',
    };

    const response = await chai
      .request(server)
      .post('/users')
      .send(userData);

    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal({ error: 'Missing password' });
  });

  it('should return an error Already exist with a status code 400 if email already exists in DB', async () => {
    const userData = {
      email: 'existing@example.com',
      password: 'password123',
    };

    collectionStub.withArgs('users').returns({
      findOne: sinon.stub().resolves({ email: userData.email })
    });

    const response = await chai
      .request(server)
      .post('/users')
      .send(userData);

    expect(response).to.have.status(400);
    expect(response.body).to.deep.equal({ error: 'Already exist' });
  });

  it('should handle errors when adding a new user to the DB', async () => {
    const userData = {
      email: 'test@example.com',
      password: 'password123',
    };

    collectionStub.withArgs('users').returns({
      findOne: sinon.stub().resolves(null),
      insertOne: sinon.stub().rejects('Db Error'),
    });

    const response = await chai
      .request(server)
      .post('/users')
      .send(userData);

    expect(response).to.have.status(500);
    expect(response.body).to.deep.equal({ error: 'Internal Server Error' });
  });
});

