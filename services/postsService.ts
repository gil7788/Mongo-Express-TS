import { Request, Response, NextFunction } from 'express';
import { connect } from '../db/connect';
import { ObjectId } from 'mongodb';

export async function getPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await connect();
    const collection = db.collection("posts");
    const results = await collection.find({}).limit(50).toArray();
    res.send(results).status(200);
  } catch (error) {
    next(error);
  }
}

export async function getLatestPosts(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await connect();
    const collection = db.collection("posts");
    const results = await collection.aggregate([
      { "$project": { "author": 1, "title": 1, "tags": 1, "date": 1 }},
      { "$sort": { "date": -1 }},
      { "$limit": 3 }
    ]).toArray();
    res.send(results).status(200);
  } catch (error) {
    next(error);
  }
}

export async function getSinglePost(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await connect();
    const collection = db.collection("posts");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.findOne(query);

    if (!result) res.status(404).send("Not found");
    else res.send(result).status(200);
  } catch (error) {
    next(error);
  }
}

export async function addNewPost(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await connect();
    const collection = db.collection("posts");
    const newDocument = req.body;
    newDocument.date = new Date();
    const result = await collection.insertOne(newDocument);
    res.status(204).send(result);
  } catch (error) {
    next(error);
  }
}

export async function addCommentToPost(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await connect();
    const collection = db.collection("posts");
    const query = { _id: new ObjectId(req.params.id) };
    const updates = { $push: { comments: req.body } };
    const result = await collection.updateOne(query, updates);
    res.send(result).status(200);
  } catch (error) {
    next(error);
  }
}

export async function deletePostById(req: Request, res: Response, next: NextFunction) {
  try {
    const db = await connect();
    const collection = db.collection("posts");
    const query = { _id: new ObjectId(req.params.id) };
    const result = await collection.deleteOne(query);
    res.send(result).status(200);
  } catch (error) {
    next(error);
  }
}


/*
import { Response, NextFunction } from 'express';
import { CustomRequest } from '../types'; // Ensure this path is correct
import { ObjectId } from 'mongodb';

export async function getPosts(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const collection = req.db.collection('posts');
    const posts = await collection.find({}).toArray();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getLatestPosts(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const collection = req.db.collection('posts');
    const posts = await collection.find({}).sort({ date: -1 }).limit(3).toArray();
    res.json(posts);
  } catch (error) {
    next(error);
  }
}

export async function getSinglePost(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const collection = req.db.collection('posts');
    const post = await collection.findOne({ _id: new ObjectId(req.params.id) });
    if (!post) {
      return res.status(404).send('Post not found');
    }
    res.json(post);
  } catch (error) {
    next(error);
  }
}

export async function addNewPost(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const collection = req.db.collection('posts');
    const result = await collection.insertOne(req.body);
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

export async function addCommentToPost(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const collection = req.db.collection('posts');
    const updateResult = await collection.updateOne(
      { _id: new ObjectId(req.params.id) },
      { $push: { comments: req.body } }
    );
    res.json(updateResult);
  } catch (error) {
    next(error);
  }
}

export async function deletePostById(req: CustomRequest, res: Response, next: NextFunction) {
  try {
    const collection = req.db.collection('posts');
    const deleteResult = await collection.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json(deleteResult);
  } catch (error) {
    next(error);
  }
}


*/