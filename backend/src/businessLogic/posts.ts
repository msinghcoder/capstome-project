import { PostDataAccess } from '../dataLayer/postsAcess'
import { AttachmentUtils } from '../helpers/attachmentUtils';
import { Post } from '../models/Post'
import { CreatePostRequest } from '../requests/CreatePostRequest'
import { UpdatePostRequest } from '../requests/UpdatePostRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'

//Implement businessLogic
const postDataAccess = new PostDataAccess()
const attachmentUtils = new AttachmentUtils()
const logger = createLogger('PostDataAccess')

export async function createPost(post: CreatePostRequest, userId: string): Promise<Post> {
    logger.info("creating new post", { post: post, userId: userId })
    const postId = uuid.v4()

    const newPost = {
        postId: postId,
        userId: userId,
        ...post
    }
    return await postDataAccess.createPost(newPost);
}
export async function deletePost(postId: string, userId: string): Promise<void> {
    logger.info("delete post", { PostId: postId, UserId: userId })

    return await postDataAccess.deletePost(postId, userId);
}

export async function createAttachmentPresignedUrl(postId: string, userId: string): Promise<string> {
    logger.info("create attachment  presigned url for post", { PostId: postId, UserId: userId })

    const uploadUrl = attachmentUtils.getSignedURL(postId)
    logger.info("Upload Url" + uploadUrl)
    await postDataAccess.putAttachment(userId, postId)
    return uploadUrl;

}
export async function getPostsForUser(userId: string): Promise<Post[]> {
    logger.info("Getting all posts for user id", { UserId: userId })

    return await postDataAccess.getPostsForUser(userId);
}
export async function updatePost(userId: string, postId: string, updatedPost: UpdatePostRequest) {
    logger.info("Updating post for user id", { UserId: userId, PostId: postId, UpdatePostRequest: updatedPost })

    return await postDataAccess.updatePost(userId, postId, updatedPost);
}
