// TODO: Once your application is deployed, copy an API id here so that the frontend could interact with it
const apiId = 'bfilfxwxn3'
export const apiEndpoint = `https://${apiId}.execute-api.us-east-1.amazonaws.com/dev`

export const authConfig = {  
  domain: 'dev-abwq04mbkommu8fp.us.auth0.com',            // Auth0 domain
  clientId: 'PM3nrtHH5s9aDiq572Q8LvvAcql92Vgl',          // Auth0 client id
  callbackUrl: 'http://localhost:3000/callback'
}
