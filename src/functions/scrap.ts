// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("request");
import { APIGatewayProxyCallback, APIGatewayProxyEvent } from "aws-lambda";
import * as cheerio from "cheerio";
// eslint-disable-next-line @typescript-eslint/no-var-requires
const AWS = require("aws-sdk");
const dynamo = new AWS.DynamoDB.DocumentClient();
import { uid } from 'uid';

export const handler = async (event: APIGatewayProxyEvent, context, callback: APIGatewayProxyCallback) => {
    try {
        const reqBody = event?.body
        const parsedBody = JSON.parse(reqBody);
        if (parsedBody?.url) {
            await getHtml(parsedBody?.url).then(async (html: string) => {
                // getting response from the scrapped data
                const response = await getScrappedData(parsedBody?.url, html)
                // returning response
                callback(null, {
                    statusCode: 200,
                    body: JSON.stringify(response)
                })
            }).catch((err) => {
                callback(err);
            })
        
    } else {
        callback(null, {
            statusCode: 400,
            body: "Input Not given"
        });
    }
} catch (e) {
    callback(e);
}
}

export async function getScrappedData(url: string, html: string) {
    const response = {}
    const $ = cheerio.load(html),
        //create a reference to the meta elements
        $title = $('head title').text(),
        $desc = $('meta[name="description"]').attr('content'),
        $kwd = $('meta[name="keywords"]').attr('content'),
        $ogTitle = $('meta[property="og:title"]').attr('content'),
        $ogImage = $('meta[property="og:image"]').attr('content'),
        $ogkeywords = $('meta[property="og:keywords"]').attr('content'),
        $images = $('img');

    if ($title) {
        response["title"] = $title;
    }
    if ($desc) {
        response["desc"] = $desc;
    }
    if ($ogTitle) {
        response["description"] = $ogTitle;
    }
    if ($kwd) {
        response["kwd"] = $title;
    }
    if ($ogkeywords) {
        response["keywords"] = $ogkeywords
    }
    if ($images && $images.length) {
        response["images"] = []
        for (let i = 0; i < $images.length; i++) {
            response["images"].push($($images[i]).attr('src'));
        }
    }
    if ($ogImage) {
        response["ogImage"] = $ogImage
    }
    const userStatusParams = {
        TableName: "metadata",
        KeyConditionExpression: "#url = :url",
        ExpressionAttributeNames: {
            "#url": "url",
        },
        ExpressionAttributeValues: {
            ":url": (url),
        },
        FilterExpression: "#url = :url"
    };
    console.log("url", url)
    await dynamo.scan(userStatusParams,async function (err, data) {
        if (err) console.log("err while getting ", err)
        if (data)
           console.log("success", data)
     else {   
    await dynamo
        .put({
            TableName: "metadata",
            Item: {
                id: uid(),
                url: url,
                title: $title,
                description: $desc,
                images: $ogImage ? $ogImage : "",
            }
        })
        .promise();
    }
})
return response;
}
export function getHtml(url: string) {
            // calling promise to fetch html    
    return new Promise((resolve, reject) => {
        request(url, function (error: object, response: object, responseHtml: object) {
            //if there was an error
            if (error) {
                reject(error)
            }
            // responseHtml 
            if (responseHtml) {
                resolve(responseHtml)
            }


        })
    })
}