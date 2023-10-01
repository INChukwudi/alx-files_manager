import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();
    this.client.on('error', (error) => {
      console.log('Redis client not connected to the server:', error.message);
    });
  }

  isAlive() {
    try {
      this.client.ping('Redis');
      return true;
    } catch (error) {
      return false;
    }
  }

  async get(key) {
    const asyncGet = promisify(this.client.get).bind(this.client);
    return asyncGet(key);
  }

  async set(key, value, duration) {
    const asyncSet = promisify(this.client.set).bind(this.client);
    return asyncSet(key, value, 'EX', duration);
  }

  async del(key) {
    const asyncDel = promisify(this.client.del).bind(this.client);
    return asyncDel(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
