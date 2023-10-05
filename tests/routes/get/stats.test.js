import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import sinon from 'sinon';
import server from '../../../server';
import dbClient from '../../../utils/db';
import AppController from '../../../controllers/AppController';

chai.use(chaiHttp);

describe('getStats', () => {
  let nbUsersStub;
  let nbFilesStub;

  beforeEach(() => {
    nbUsersStub = sinon.stub(dbClient, 'nbUsers');
    nbFilesStub = sinon.stub(dbClient, 'nbFiles');
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should return stats { "users": 12, "files": 1231 } with a status code 200', async () => {
    nbUsersStub.resolves(12);
    nbFilesStub.resolves(1231);

    const response = await chai
      .request(server)
      .get('/stats');

    expect(response).to.have.status(200);
    expect(response.body).to.deep.equal({ users: 12, files: 1231 });
  });

  it('should handle errors when fetching user count', async () => {
    nbUsersStub.rejects(new Error('DB Error'));
    nbFilesStub.resolves(1231);

    const response = await chai
      .request(server)
      .get('/stats');

    expect(response).to.have.status(500);
    expect(response.body).to.have.property('error');
  });

  it('should handle errors when fetching file count', async () => {
    nbUsersStub.resolves(12);
    nbFilesStub.rejects(new Error('DB Error'));

    const response = await chai
      .request(server)
      .get('/stats');

    expect(response).to.have.status(500);
    expect(response.body).to.have.property('error');
  });
});

