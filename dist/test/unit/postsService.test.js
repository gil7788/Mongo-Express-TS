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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_mocks_http_1 = __importDefault(require("node-mocks-http"));
const postsService_1 = require("../../src/services/postsService");
const connect_1 = require("../../src/db/connect");
// Create mock data
const mockPosts = new Array(50).fill({}).map((_, index) => ({ title: `Post ${index + 1}`, author: `Author ${index + 1}` }));
const mockLatestPosts = mockPosts.slice(0, 3);
// Mock the connect function and closeConnection function
jest.mock('../../src/db/connect', () => ({
    connect: jest.fn().mockImplementation(() => ({
        collection: () => ({
            find: jest.fn().mockImplementation(() => ({
                limit: jest.fn().mockImplementation((num) => {
                    if (num === 50) {
                        return { toArray: jest.fn().mockResolvedValue(mockPosts) };
                    }
                    else if (num === 3) {
                        return { toArray: jest.fn().mockResolvedValue(mockLatestPosts) };
                    }
                    return { toArray: jest.fn().mockResolvedValue([]) };
                }),
            })),
            aggregate: jest.fn().mockImplementation((pipeline) => {
                // Check if the pipeline includes a limit stage for 3 documents
                const isLimitThree = pipeline.some((stage) => stage.$limit === 3);
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
        it('should fetch and send a list of 50 posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = node_mocks_http_1.default.createRequest();
            const res = node_mocks_http_1.default.createResponse();
            const next = jest.fn();
            yield (0, postsService_1.getPosts)(req, res, next);
            const responseData = res._getData();
            expect(responseData).toHaveLength(50);
            expect(res.statusCode).toBe(200);
        }));
    });
    describe('getSinglePost', () => {
        it('should fetch and send a single post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = node_mocks_http_1.default.createRequest({ params: { id: 'mocked-id' } });
            const res = node_mocks_http_1.default.createResponse();
            const next = jest.fn();
            yield (0, postsService_1.getSinglePost)(req, res, next);
            expect(res._getData()).toEqual("");
            expect(res.statusCode).toBe(200);
        }));
    });
    describe('getLatestPosts', () => {
        it('should fetch and send the latest 3 posts', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = node_mocks_http_1.default.createRequest();
            const res = node_mocks_http_1.default.createResponse();
            const next = jest.fn();
            yield (0, postsService_1.getLatestPosts)(req, res, next);
            const responseData = res._getData();
            expect(responseData).toHaveLength(3);
            expect(res.statusCode).toBe(200);
        }));
    });
    describe('addNewPost', () => {
        it('should add a new post and return the result', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = node_mocks_http_1.default.createRequest({ body: { title: 'Test Post', content: 'This is a test' } });
            const res = node_mocks_http_1.default.createResponse();
            const next = jest.fn();
            yield (0, postsService_1.addNewPost)(req, res, next);
            expect(res.statusCode).toBe(200);
        }));
    });
    describe('addCommentToPost', () => {
        it('should add a comment to a post', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = node_mocks_http_1.default.createRequest({ params: { id: '123' }, body: { comment: 'Nice post!' } });
            const res = node_mocks_http_1.default.createResponse();
            const next = jest.fn();
            yield (0, postsService_1.addCommentToPost)(req, res, next);
            expect(res.statusCode).toBe(200);
        }));
    });
    describe('deletePostById', () => {
        it('should delete a post by ID', () => __awaiter(void 0, void 0, void 0, function* () {
            const req = node_mocks_http_1.default.createRequest({ params: { id: '123' } });
            const res = node_mocks_http_1.default.createResponse();
            const next = jest.fn();
            yield (0, postsService_1.deletePostById)(req, res, next);
            expect(res.statusCode).toBe(200);
        }));
    });
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, connect_1.closeConnection)();
    }));
});
