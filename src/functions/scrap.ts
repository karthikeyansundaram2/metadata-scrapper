// eslint-disable-next-line @typescript-eslint/no-var-requires
const request = require("request");
import { APIGatewayProxyCallback, APIGatewayProxyEvent } from "aws-lambda";
import * as cheerio from "cheerio";


export const handler= (event:APIGatewayProxyEvent, context, callback:APIGatewayProxyCallback)=>{
    try {
        const reqBody= event?.body
        const parsedBody=JSON.parse(reqBody);
       
        if(parsedBody?.url) {
            // calling promise to fetch html    
            getHtml(parsedBody?.url).then(async (html:string)=>{
                // getting response from the scrapped data
              const response=getScrappedData(html)
              // returning response
              callback(null, {
                  statusCode: 200,
                  body: JSON.stringify(response)
                })
            }).catch((err)=>{
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

export function getScrappedData(html:string) {
    const response={}
    const $ = cheerio.load(html),
    //create a reference to the meta elements
    $title = $('head title').text(),
    $desc = $('meta[name="description"]').attr('content'),
    $kwd = $('meta[name="keywords"]').attr('content'),
    $ogTitle = $('meta[property="og:title"]').attr('content'),
    $ogImage = $('meta[property="og:image"]').attr('content'),
    $ogkeywords = $('meta[property="og:keywords"]').attr('content'),
    $images = $('img');

    if($title) {
        response["title"]=$title;
    }
    if($desc) {
        response["desc"]=$desc;
    }
    if($ogTitle) {
        response["description"]=$ogTitle;
    }
    if($kwd) {
        response["kwd"]=$title;
    }
    if($ogkeywords) {
        response["keywords"]=$ogkeywords
    }
    if($images&&$images.length) {
        response["images"]=[]
        for (let i = 0; i < $images.length; i++) {
            response["images"].push($($images[i]).attr('src'));
        }
    }
    if ($ogImage) {
        response["ogImage"]=$ogImage
    }
    return response;
}
export function getHtml(url:string) {
    return new Promise ((resolve, reject)=>{
        request(url,function (error:object, response:object, responseHtml:object) {
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