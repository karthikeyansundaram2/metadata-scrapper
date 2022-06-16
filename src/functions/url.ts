import { APIGatewayProxyCallback, APIGatewayProxyEvent } from 'aws-lambda';
import urlMetadata from 'url-metadata';
export const handler = async (event:APIGatewayProxyEvent, context, callback:APIGatewayProxyCallback) => {
    try {
        const reqBody = event?.body;
        const reqData = JSON.parse(reqBody);
        if (reqData.url) {
           await urlMetadata(reqData?.url).then(
                function (metadata) { // success handler
                    console.log("meta", JSON.stringify(metadata))
                    callback(null, {
                        statusCode: 200,
                        body: JSON.stringify(metadata)
                    })
                    // return;
                },
                function (error) { // failure handler
                    console.log(error)
                    callback(error)
                })
        } else {
            callback(null,{
                statusCode: 400,
                body: "Url Not given as input"
            });
        }
    } catch (e) {
        console.log("error", e)
        callback(e);
    }
}