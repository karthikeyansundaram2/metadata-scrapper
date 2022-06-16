import { APIGatewayProxyCallback, APIGatewayProxyEvent } from 'aws-lambda';
import urlMetadata from 'url-metadata';
// import { uid } from 'uid';

// eslint-disable-next-line @typescript-eslint/no-var-requires
// const AWS = require("aws-sdk");
// const dynamo = new AWS.DynamoDB.DocumentClient();
const inMemCache = new Map();
export const handler = async (event: APIGatewayProxyEvent, context, callback: APIGatewayProxyCallback) => {
    try {

        const reqBody = event?.body;
        const reqData = JSON.parse(reqBody);
        const response = {}
        if (reqData.url) {
           
            if (inMemCache.has(reqData.url)) {
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(inMemCache.get(reqData.url))
                })
            } else {
                // using url metadata
                await urlMetadata(reqData?.url).then(
                    async function (metadata) { // success handler
                        // storing in response
                        response["title"] = metadata?.['og:title'] ? metadata?.['og:title'] : metadata?.title,
                            response["description"] = metadata?.['og:description'] ? metadata?.['og:description'] : metadata?.description
                        response["keywords"] = metadata?.keywords
                        response["images"] = metadata?.image
                        response["type"] = metadata?.['og:type']
                        response["ogImage"] = metadata?.['og:image']

                        // await dynamo
                        //     .put({
                        //         TableName: "metadata",
                        //         Item: {
                        //             id: uid(),
                        //             url: reqData?.url,
                        //             name: metadata?.['og:site_name'] ? metadata?.['og:site_name'] : "",
                        //             title: metadata?.['og:title'] ? metadata?.['og:title'] : metadata?.title,
                        //             description: metadata?.['og:description'] ? metadata?.['og:description'] : metadata?.description,
                        //             images: metadata?.image,
                        //         }
                        //     })
                        //     .promise();
                        inMemCache.set(reqData.url, response);
                        // returning response
                        callback(null, {
                            statusCode: 200,
                            body: JSON.stringify(response)
                        })
                        // return
                    },
                    function (error) { // failure handler
                        callback(error)
                    })
            }
        }
        else {
            // handling no input error 
            callback(null, {
                statusCode: 400,
                body: "Url Not given as input"
            });
        }
    } catch (e) {
        console.log("error", e)
        callback(e);
    }
}

