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
exports.generateData = exports.addCommentToPost = exports.createPost = void 0;
const axios_1 = __importDefault(require("axios"));
const API_BASE_URL = 'http://localhost:3000';
function createPost(title, author) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield axios_1.default.post(`${API_BASE_URL}/posts`, { title, author, date: new Date() });
            return response.data;
        }
        catch (error) {
            console.error('Error creating post:', error);
            throw error;
        }
    });
}
exports.createPost = createPost;
function addCommentToPost(postId, comment) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield axios_1.default.patch(`${API_BASE_URL}/posts/comment/${postId}`, { text: comment, date: new Date() });
        }
        catch (error) {
            console.error('Error adding comment:', error);
            throw error;
        }
    });
}
exports.addCommentToPost = addCommentToPost;
function generateData() {
    return __awaiter(this, void 0, void 0, function* () {
        const posts = [];
        for (let i = 0; i < 10; i++) {
            const post = yield createPost(`Post ${i + 1}`, `Author ${i + 1}`);
            if (post) {
                posts.push(post);
            }
        }
        for (let i = 0; i < 100; i++) {
            const postIndex = Math.floor(Math.random() * posts.length);
            yield addCommentToPost(posts[postIndex]._id, `Comment ${i + 1}`);
        }
        console.log('Data generation complete.');
    });
}
exports.generateData = generateData;
