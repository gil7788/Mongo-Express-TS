"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePostById = exports.addCommentToPost = exports.addNewPost = exports.getSinglePost = exports.getLatestPosts = exports.getPosts = void 0;
const connect_1 = require("../db/connect");
const mongodb_1 = require("mongodb");
function getPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connect_1.connect)();
            const collection = db.collection("posts");
            const results = yield collection.find({}).limit(50).toArray();
            res.send(results).status(200);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getPosts = getPosts;
function getLatestPosts(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connect_1.connect)();
            const collection = db.collection("posts");
            const results = yield collection.aggregate([
                { "$project": { "author": 1, "title": 1, "tags": 1, "date": 1 } },
                { "$sort": { "date": -1 } },
                { "$limit": 3 }
            ]).toArray();
            res.send(results).status(200);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getLatestPosts = getLatestPosts;
function getSinglePost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connect_1.connect)();
            const collection = db.collection("posts");
            const query = { _id: new mongodb_1.ObjectId(req.params.id) };
            const result = yield collection.findOne(query);
            if (!result)
                res.status(404).send("Not found");
            else
                res.send(result).status(200);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.getSinglePost = getSinglePost;
function addNewPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connect_1.connect)();
            const collection = db.collection("posts");
            const newDocument = req.body;
            newDocument.date = new Date();
            const result = yield collection.insertOne(newDocument);
            res.status(204).send(result);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addNewPost = addNewPost;
function addCommentToPost(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connect_1.connect)();
            const collection = db.collection("posts");
            const query = { _id: new mongodb_1.ObjectId(req.params.id) };
            const updates = { $push: { comments: req.body } };
            const result = yield collection.updateOne(query, updates);
            res.send(result).status(200);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.addCommentToPost = addCommentToPost;
function deletePostById(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const db = yield (0, connect_1.connect)();
            const collection = db.collection("posts");
            const query = { _id: new mongodb_1.ObjectId(req.params.id) };
            const result = yield collection.deleteOne(query);
            res.send(result).status(200);
        }
        catch (error) {
            next(error);
        }
    });
}
exports.deletePostById = deletePostById;
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
