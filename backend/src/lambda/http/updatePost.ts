import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updatePost } from '../../businessLogic/posts'
import { UpdatePostRequest } from '../../requests/UpdatePostRequest'
import { getUserId } from '../utils'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const postId = event.pathParameters.postId
    const updatedPost: UpdatePostRequest = JSON.parse(event.body)   
    const userId = getUserId(event)

    await updatePost(userId, postId, updatedPost)

    return {
            statusCode: 204,
            body: ""
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
