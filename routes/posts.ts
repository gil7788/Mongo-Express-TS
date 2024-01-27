import express, { Request, Response, NextFunction } from 'express';
import { connect } from '../db/connect';
import { ObjectId } from 'mongodb';
import * as postsService from '../services/postsService';

const router = express.Router();

async function dbConnect(req: Request, res: Response, next: NextFunction) {
  try {
    req.db = await connect();
    next();
  } catch (error) {
    next(error);
  }
}
router.use(dbConnect);

function errorHandler(err: any, req: Request, res: Response, next: NextFunction) {
  console.error(err);
  res.status(500).send("Internal Server Error");
}


router.get("/", postsService.getPosts);
router.get("/latest", postsService.getLatestPosts);
router.get("/:id", postsService.getSinglePost);
router.post("/", postsService.addNewPost);
router.patch("/comment/:id", postsService.addCommentToPost);
router.delete("/:id", postsService.deletePostById);

router.use(errorHandler);

export default router;
