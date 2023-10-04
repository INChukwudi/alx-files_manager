import { expect } from 'chai';
import sinon from 'sinon';
import dbClient from '../../utils/db';

describe('DBClient', () => {
  describe('isAlive', () => {
    it('should return true when the DB is alive', () => {
      const isConnectedStub = sinon.stub(dbClient.client, 'isConnected').returns(true);
      const alive = dbClient.isAlive();

      expect(alive).to.be.true;
      isConnectedStub.restore();
    });

    it('should return false when the DB is not alive', () => {
      const isConnectedStub = sinon.stub(dbClient.client, 'isConnected').returns(false);
      const alive = dbClient.isAlive();

      expect(alive).to.be.false;
      isConnectedStub.restore();
    });
  });

  describe('nbUsers', () => {
    it('should return the count of users', async () => {
      const collectionStub = sinon.stub(dbClient.db, 'collection');
      collectionStub.withArgs('users').returns({
        countDocuments: sinon.stub().resolves(10),
      });

      const count = await dbClient.nbUsers();
      expect(count).to.equal(10);
      collectionStub.restore();
    });

    it('should handle errors when counting users', async () => {
      const collectionStub = sinon.stub(dbClient.db, 'collection');
      collectionStub.withArgs('users').returns({
        countDocuments: sinon.stub().rejects(new Error('Database error')),
      });

      try {
        await dbClient.nbUsers();
      } catch (error) {
        expect(error.message).to.equal('Database error');
      }

      collectionStub.restore();
    });
  });

  describe('nbFiles', () => {
    it('should return the count of files', async () => {
      const collectionStub = sinon.stub(dbClient.db, 'collection');
      collectionStub.withArgs('files').returns({
        countDocuments: sinon.stub().resolves(20),
      });

      const count = await dbClient.nbFiles();
      expect(count).to.equal(20);
      collectionStub.restore();
    });

    it('should handle errors when counting files', async () => {
      const collectionStub = sinon.stub(dbClient.db, 'collection');
      collectionStub.withArgs('files').returns({
        countDocuments: sinon.stub().rejects(new Error('Database error')),
      });

      try {
        await dbClient.nbFiles();
      } catch (error) {
        expect(error.message).to.equal('Database error');
      }

      collectionStub.restore();
    });
  });
});
