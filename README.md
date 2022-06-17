# metadata-scrapper
To scrape the webpage metadata and OG data from the given url

Implemented Metadata-scrapping with the help of Lambda function with dynamo Db and In Memory cache 

Configured Dynamo Accelerator for the Dynamo Db

Implemented 2 functions 


  - /url 


    Using url-metadata package 
    Reads the metadata of the Head tag 
    Sent the necessary metadata in response 
    Added In memory Cache to handle the latency problems 
    Pushed data into Dynamo Db
    
  - /scrap


    Using cheerio package
    Parsed the entire HTML file and sent to cheerio
    From cheerio gathered all the required metadata and added to response
    Data added to dynamo Db
    Verified data is there or not before adding to Dynamo Db
    Configured DAX on the Dynamo Db
    
    <img width="1274" alt="Screenshot 2022-06-16 at 9 02 04 PM" src="https://user-images.githubusercontent.com/44942025/174106478-7e0d8d51-090c-4e23-8d89-ba5b0212cb88.png">


  
<img width="1276" alt="Screenshot 2022-06-16 at 9 08 44 PM" src="https://user-images.githubusercontent.com/44942025/174108559-994e7be3-c9d7-46e0-99d5-80abe05a8ee7.png">
