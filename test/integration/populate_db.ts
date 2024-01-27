import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000';

export async function createPost(title: string, author: string) {
  try {
    const response = await axios.post(`${API_BASE_URL}/posts`, { title, author, date: new Date() });
    return response.data;
  } catch (error) {
    console.error('Error creating post:', error);
    throw error;
  }
}

export async function addCommentToPost(postId: string, comment: string) {
  try {
    await axios.patch(`${API_BASE_URL}/posts/comment/${postId}`, { text: comment, date: new Date() });
  } catch (error) {
    console.error('Error adding comment:', error);
    throw error;
  }
}

export async function generateData() {
  const posts = [];
  for (let i = 0; i < 10; i++) {
    const post = await createPost(`Post ${i + 1}`, `Author ${i + 1}`);
    if (post) {
      posts.push(post);
    }
  }

  for (let i = 0; i < 100; i++) {
    const postIndex = Math.floor(Math.random() * posts.length);
    await addCommentToPost(posts[postIndex]._id, `Comment ${i + 1}`);
  }

  console.log('Data generation complete.');
}
