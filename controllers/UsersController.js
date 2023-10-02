import sha1 from 'sha1';
import dbClient from '../utils/db';

class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    const userExists = await dbClient.db.collection('users').findOne({ email });
    if (userExists) {
      return res.status(400).json({ error: 'Already exist' });
    }

    const hashedPassword = sha1(password);
    const newUser = {
      email,
      password: hashedPassword,
    };

    try {
      await dbClient.db.collection('users').insertOne(newUser);
    } catch (error) {
      console.error('Error adding user:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    return res.status(201).json({ email: newUser.email, id: newUser._id });
  }
}

export default UsersController;
