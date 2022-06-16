import { APIGatewayProxyCallback, APIGatewayProxyEvent } from 'aws-lambda';
import urlMetadata from 'url-metadata';
export const handler = async (event:APIGatewayProxyEvent, context, callback:APIGatewayProxyCallback) => {
    try {
      
        const reqBody = event?.body;
        const reqData = JSON.parse(reqBody);
        const response={}
        if (reqData.url) {
            // using url metadata
           await urlMetadata(reqData?.url).then(
                function (metadata) { // success handler
                    // storing in response
                    response["title"]=metadata?.['og:title']?metadata?.['og:title']:metadata?.title,
                    response["description"]=metadata?.['og:description']?metadata?.['og:description']:metadata?.description
                    response["keywords"]=metadata?.keywords
                    response["images"]=metadata?.image
                    response["type"]=metadata?.['og:type']
                    response["ogImage"]=metadata?.['og:image']

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
        } else {
            // handling no input error 
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

