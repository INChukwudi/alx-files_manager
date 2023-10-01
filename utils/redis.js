import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    this.client.on('error', (error) => {
      console.error('Redis Error:', error);
    });

    this.client.getAsync = promisify(this.client.get).bind(this.client);
    this.client.setAsync = promisify(this.client.set).bind(this.client);
    this.client.delAsync = promisify(this.client.del).bind(this.client);
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
    return await this.client.getAsync(key);
  }

  async set(key, value, duration) {
    return await this.client.setAsync(key, value, 'EX', duration);
  }

  async del(key) {
    return await this.client.delAsync(key);
  }
}

const redisClient = new RedisClient();

export default redisClient;
