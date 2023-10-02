import { ObjectId } from 'mongodb';
import { promises as fsPromises } from 'fs';
import { v4 as uuidv4 } from 'uuid';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class FilesController {
  static async postUpload(req, res) {
    const authToken = req.header('X-Token');
    if (!authToken) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const userId = await redisClient.get(`auth_${authToken}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const {
      name, type, parentId, isPublic, data,
    } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'Missing name' });
    }

    if (!type || !['folder', 'file', 'image'].includes(type)) {
      return res.status(400).json({ error: 'Missing type' });
    }

    if (!data && type !== 'folder') {
      return res.status(400).json({ error: 'Missing data' });
    }

    if (parentId) {
      const parentFile = await dbClient.db.collection('files').findOne({ _id: ObjectId(parentId) });

      if (!parentFile) {
        return res.status(400).json({ error: 'Parent not found' });
      }

      if (parentFile.type !== 'folder') {
        return res.status(400).json({ error: 'Parent is not a folder' });
      }
    }

    const file = {
      userId: ObjectId(userId),
      name,
      type,
      isPublic: isPublic || false,
      parentId: parentId || '0',
    };

    try {
      if (type === 'folder') {
        const result = await dbClient.db.collection('files').insertOne(file);
        file._id = result.insertedId;

        return res.status(201).json(file);
      }
      const fileData = Buffer.from(data, 'base64');
      const fileName = uuidv4();
      const filePath = `${process.env.FOLDER_PATH || '/tmp/files_manager'}/${fileName}`;

      await fsPromises.writeFile(filePath, fileData);

      file.localPath = filePath;
      const result = await dbClient.db.collection('files').insertOne(file);
      file._id = result.insertedId;

      return res.status(201).json(file);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default FilesController;
