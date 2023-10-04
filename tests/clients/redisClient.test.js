import { expect } from 'chai';
import sinon from 'sinon';
import redisClient from '../../utils/redis';

describe('RedisClient', () => {
  describe('isAlive', () => {
    it('should return true when Redis is alive', () => {
      const pingStub = sinon.stub(redisClient.client, 'ping').callsFake(() => true);
      const result = redisClient.isAlive();

      expect(result).to.equal(true);
      pingStub.restore();
    });

    it('should return false when Redis is not alive', () => {
      const pingStub = sinon.stub(redisClient.client, 'ping').throws(new Error('Redis is down'));
      const result = redisClient.isAlive();

      expect(result).to.equal(false);
      pingStub.restore();
    });
  });

  describe('get', () => {
    it('should get a value from Redis', async () => {
      const key = 'sample_key';
      const value = 'sample_value';
      const getStub = sinon.stub(redisClient.client, 'get').callsFake((k, callback) => {
        callback(null, value);
      });

      const result = await redisClient.get(key);
      expect(result).to.equal(value);
      getStub.restore();
    });

    it('should handle errors when getting a value from Redis', async () => {
      const key = 'nonexistentKey';
      const getStub = sinon.stub(redisClient.client, 'get').callsFake((k, callback) => {
        callback(new Error('Key not found'));
      });

      try {
        await redisClient.get(key);
      } catch (error) {
        expect(error.message).to.equal('Key not found');
      }

      getStub.restore();
    });
  });

  describe('set', () => {
    it('should set a value in Redis', async () => {
      const key = 'sample_key';
      const value = 'sample_value';
      const duration = 60;
      const setStub = sinon.stub(redisClient.client, 'set').callsFake((k, v, ex, d, callback) => {
        callback(null, 'OK');
      });

      const result = await redisClient.set(key, value, duration);
      expect(result).to.equal('OK');
      setStub.restore();
    });

    it('should handle errors when setting a value in Redis', async () => {
      const key = 'sample_key';
      const value = 'sample_value';
      const duration = 60;
      const setStub = sinon.stub(redisClient.client, 'set').callsFake((k, v, ex, d, callback) => {
        callback(new Error('Error setting value'));
      });

      try {
        await redisClient.set(key, value, duration);
      } catch (err) {
        expect(err.message).to.equal('Error setting value');
      }
    });
  });

  describe('del', () => {
    it('should delete a key from Redis', async () => {
      const key = 'sample_key';
      const delStub = sinon.stub(redisClient.client, 'del').callsFake((k, callback) => {
        callback(null, 1);
      });

      const result = await redisClient.del(key);
      expect(result).to.equal(1);
      delStub.restore();
    });

    it('should handle errors when deleting a key from Redis', async () => {
      const key = 'sample_non_existent_key';
      const delStub = sinon.stub(redisClient.client, 'del').callsFake((k, callback) => {
        callback(new Error('Error deleting key'));
      });

      try {
        await redisClient.del(key);
      } catch (error) {
        expect(error.message).to.equal('Error deleting key');
      }

      delStub.restore();
    });
  });
});

