import Queue from 'bull';
import { promises as fsPromises } from 'fs';
import imageThumbnail from 'image-thumbnail';
import { ObjectId } from 'mongodb';
import dbClient from './utils/db';

const fileQueue = new Queue('fileQueue');

fileQueue.process(async (job, done) => {
  const { userId, fileId } = job.data;

  if (!fileId) {
    done(new Error('Missing fileId'));
  }

  if (!userId) {
    done(new Error('Missing userId'));
  }

  try {
    const imageFile = await dbClient.db.collection('files').findOne({
      _id: ObjectId(fileId),
      userId,
    });

    if (!imageFile) {
      done(new Error('File not found'));
    }

    const sizes = [500, 250, 100];
    const promises = sizes.map(async (size) => {
      const fileContent = await fsPromises.readFile(imageFile.localPath);
      const binaryData = Buffer.from(fileContent, 'base64');
      const thumbnailData = await imageThumbnail(binaryData, { width: size });
      const thumbnailPath = `${imageFile.localPath}_${size}`;
      return fsPromises.writeFile(thumbnailPath, thumbnailData, 'base64');
    });

    await Promise.all(promises);

    done();
    return { success: true };
  } catch (error) {
    console.error(`Error processing queue: ${error.message}`);
    done(error);
    return { error };
  }
});
