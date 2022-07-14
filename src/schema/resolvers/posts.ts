import { Post } from "../../models";
import checkAuth from "../../utils/check-auth";
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const getPosts = async () => {
  try {
    const posts = await Post.find().sort({ createdAt: -1 });
    return posts;
  } catch (err) {
    throw new Error(err as string);
  }
};

const getPost = async (_, { postId }: { postId: string }) => {
  try {
    const post = await Post.findById(postId);
    if (!post) {
      throw new Error("Post not found");
    }
    return post;
  } catch (err) {
    throw new Error(err as string);
  }
};

const createPost = async (_, { body }: { body: string }, context) => {
  const user = checkAuth(context);
  try {
    const newPost = Post.create({
      body,
      username: user.username,
      createdAt: new Date().toISOString(),
    });
    pubsub.publish("NEW_POST", {
      newPost,
    });
    return newPost;
  } catch (err) {
    throw new Error(err as string);
  }
};

const deletePost = async (_, { postId }: { postId: string }, context) => {
  const user = checkAuth(context);
  try {
    const deletePost = await Post.findById(postId);
    if (!deletePost) {
      throw new Error("Post not found");
    }
    if (deletePost.username !== user.username) {
      throw new Error("Not authorized");
    }
    await deletePost.remove();
    return "Post deleted successfully";
  } catch (err) {
    throw new Error(err as string);
  }
};

const newPost = {
  subscribe: () => pubsub.asyncIterator("NEW_POST"),
};

export const postsQueries = {
  getPosts,
  getPost,
};

export const postsMutations = {
  createPost,
  deletePost,
};

export const postSubscriptions = {
  newPost,
};
