import * as AWS from 'aws-sdk'

import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { Post } from '../models/Post'
import { PostUpdate } from '../models/PostUpdate';



const AWSXRay = require('aws-xray-sdk')
const XAWS = AWSXRay.captureAWS(AWS)
const logger = createLogger('PostsAccess')
const s3Bucket = process.env.ATTACHMENT_S3_BUCKET

export class PostDataAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly postsTable = process.env.POSTS_TABLE) {
    }



    async createPost(post: Post): Promise<Post> {
        logger.info("Creating new post")

        await this.docClient.put({
            TableName: this.postsTable,
            Item: post
        }).promise()

        return post
    }

    async deletePost(postId: string, userId: string): Promise<void> {
        logger.info("Deleting  Post having Id" + postId + "by user id" + userId)

        await this.docClient.delete({
            TableName: this.postsTable,
            Key: {
                userId: userId,
                postId: postId
            }
        }).promise()

    }

    async putAttachment(userId: string, postId: string): Promise<void> {
        logger.info("saving  Post attachment Url having Id" + postId + "by user id" + userId)
        await this.docClient.update({
            TableName: this.postsTable,
            Key: {
                userId: userId,
                postId: postId
            },
            UpdateExpression: "set attachmentUrl = :attachmentUrl",
            ExpressionAttributeValues: {
                ":attachmentUrl": `https://${s3Bucket}.s3.amazonaws.com/${postId}`
            }
        }).promise()
    }

    async getPostsForUser(userId: string): Promise<Post[]> {
        logger.info("Getting all posts for user id" + userId)

        const result = await this.docClient.query({
            TableName: this.postsTable,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
                ':userId': userId
            },
            ScanIndexForward: false
        }).promise()

        return result.Items as Post[]
    }
    async updatePost(userId: string, postId: string, updatedPost: PostUpdate) {
        logger.info("Updating Posts with id" + postId + "for user id" + userId)

        await this.docClient.update({
            TableName: this.postsTable,
            Key: {
                userId: userId,
                postId: postId
            },
            UpdateExpression: "set #name = :n, #date = :due",
            ExpressionAttributeNames: {
                "#name": "name",
                "#date": "date"               
            },
            ExpressionAttributeValues: {
                ":n": updatedPost.name,
                ":due": updatedPost.date
               
            },
        }).promise()
    }

}

function createDynamoDBClient() {
    if (process.env.IS_OFFLINE) {
        logger.log({ level: "Info", message: "Creating a local DynamoDB instance" })

        return new XAWS.DynamoDB.DocumentClient({
            region: 'localhost',
            endpoint: 'http://localhost:8000'
        })
    }

    return new XAWS.DynamoDB.DocumentClient()
}