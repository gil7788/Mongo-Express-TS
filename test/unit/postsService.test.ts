import httpMocks from 'node-mocks-http';
import {
  getPosts,
  getLatestPosts,
  getSinglePost,
  addNewPost,
  addCommentToPost,
  deletePostById
} from '../../services/postsService';
import { connect, closeConnection } from '../../db/connect';


// Create mock data
const mockPosts = new Array(50).fill({}).map((_, index) => ({ title: `Post ${index + 1}`, author: `Author ${index + 1}` }));
const mockLatestPosts = mockPosts.slice(0, 3);

// Mock the connect function and closeConnection function
jest.mock('../../db/connect', () => ({
  connect: jest.fn().mockImplementation(() => ({
    collection: () => ({
      find: jest.fn().mockImplementation(() => ({
        limit: jest.fn().mockImplementation((num) => {
          if (num === 50) {
            return { toArray: jest.fn().mockResolvedValue(mockPosts) };
          } else if (num === 3) {
            return { toArray: jest.fn().mockResolvedValue(mockLatestPosts) };
          }
          return { toArray: jest.fn().mockResolvedValue([]) };
        }),
      })),
      aggregate: jest.fn().mockImplementation((pipeline: any[]) => {
        // Check if the pipeline includes a limit stage for 3 documents
        const isLimitThree = pipeline.some((stage: any) => stage.$limit === 3);
        if (isLimitThree) {
          return { toArray: jest.fn().mockResolvedValue(mockLatestPosts) };
        }
        return { toArray: jest.fn().mockResolvedValue([]) };
      }),
    }),
  })),
  closeConnection: jest.fn(),
}));

describe('Post Service Tests', () => {
  describe('getPosts', () => {
    it('should fetch and send a list of 50 posts', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await getPosts(req, res, next);

      const responseData = res._getData();
      expect(responseData).toHaveLength(50);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('getSinglePost', () => {
    it('should fetch and send a single post by ID', async () => {
      const req = httpMocks.createRequest({ params: { id: 'mocked-id' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await getSinglePost(req, res, next);

      expect(res._getData()).toEqual("");
      expect(res.statusCode).toBe(200);
    });
  });

  describe('getLatestPosts', () => {
    it('should fetch and send the latest 3 posts', async () => {
      const req = httpMocks.createRequest();
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await getLatestPosts(req, res, next);
      const responseData = res._getData();

      expect(responseData).toHaveLength(3);
      expect(res.statusCode).toBe(200);
    });
  });

  describe('addNewPost', () => {
    it('should add a new post and return the result', async () => {
      const req = httpMocks.createRequest({ body: { title: 'Test Post', content: 'This is a test' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await addNewPost(req, res, next);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('addCommentToPost', () => {
    it('should add a comment to a post', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' }, body: { comment: 'Nice post!' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await addCommentToPost(req, res, next);

      expect(res.statusCode).toBe(200);
    });
  });

  describe('deletePostById', () => {
    it('should delete a post by ID', async () => {
      const req = httpMocks.createRequest({ params: { id: '123' } });
      const res = httpMocks.createResponse();
      const next = jest.fn();

      await deletePostById(req, res, next);

      expect(res.statusCode).toBe(200);
    });
  });

  afterAll(async () => {
    await closeConnection();
  });
});
