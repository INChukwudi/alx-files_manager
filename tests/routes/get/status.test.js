import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../../../server';
import redisClient from '../../../utils/redis';
import dbClient from '../../../utils/db';

chai.use(chaiHttp);

describe('getStatus', () => {
  it('should return status { "redis": true, "db": true } when both Redis and DB are alive', async () => {
    sinon.stub(redisClient, 'isAlive').returns(true);
    sinon.stub(dbClient, 'isAlive').returns(true);

    const response = await chai
      .request(server)
      .get('/status');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ redis: true, db: true });

    sinon.restore();
  });

  it('should return status { "redis": false, "db": true } when Redis is not alive', async () => {
    sinon.stub(redisClient, 'isAlive').returns(false);
    sinon.stub(dbClient, 'isAlive').returns(true);

    const response = await chai
      .request(server)
      .get('/status');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ redis: false, db: true });

    sinon.restore();
  });

  it('should return status { "redis": true, "db": false } when db is not alive', async () => {
    sinon.stub(redisClient, 'isAlive').returns(true);
    sinon.stub(dbClient, 'isAlive').returns(false);

    const response = await chai
      .request(server)
      .get('/status');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ redis: true, db: false });

    sinon.restore();
  });

  it('should return status { "redis": false, "db": falsee } when Redis and db are not alive', async () => {
    sinon.stub(redisClient, 'isAlive').returns(false);
    sinon.stub(dbClient, 'isAlive').returns(false);

    const response = await chai
      .request(server)
      .get('/status');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ redis: false, db: false });

    sinon.restore();
  });
});
