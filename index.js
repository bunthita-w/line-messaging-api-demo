const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

/* Map images for imagemap type */

app.get( '/images/imagemap_example/1040' , function(req,res){
  res.sendFile(__dirname + '/public/images/imagemap_example/1040.png');
});

app.get( '/images/imagemap_example/700' , function(req,res){
    res.sendFile(__dirname + '/public/images/imagemap_example/700.png');
});

app.get( '/images/imagemap_example/460' , function(req,res){
    res.sendFile(__dirname + '/public/images/imagemap_example/460.png');
});

app.get( '/images/imagemap_example/300' , function(req,res){
    res.sendFile(__dirname + '/public/images/imagemap_example/300.png');
});

app.get( '/images/imagemap_example/240' , function(req,res){
    res.sendFile(__dirname + '/public/images/imagemap_example/240.png');
});

/* end Map images for imagemap type */

app.get('/', (req, res) => {
    res.send('Welcome to LINE messaging API DEMO');
});

app.post('/webhook', (req, res) => {
    console.log("events: ",req.body.events[0]);
    const events = req.body.events;
    if(events.length > 0){
        if(events[0].type == "follow"){
            greetText(events);
        }else if(events[0].type == "unfollow"){
            console.log("User blocked this channel.")
        }else{
            replyMessage(events);
        }
    }
    res.sendStatus(200)
});

app.listen(port, () => {
    console.log(`Start server at port ${port}.`)
});

function greetText(events){
    let message = [{
        "type": "text",
        "text": "Hello and welcome to our test channel! 😊",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/lollipop.png`,
              "action": {
                "type": "message",
                "label": "Flex example",
                "text": "Flex example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/bat.png`,
              "action": {
                "type": "message",
                "label": "Template example",
                "text": "Template example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/ghost.png`,
              "action": {
                "type": "message",
                "label": "Imagemap example",
                "text": "Imagemap example"
              }
            }
          ]
        }
    }]
    replyRequest(events[0].replyToken, message);
}

function replyMessage(events){
    switch(events[0].message.type) {
        case 'text':
            replyText(events);
            break;
        case 'sticker':
            replySticker(events);
            break;
        case 'image':
            replyImage(events);
            break;
        case 'audio':
            replyAudio(events);
            break;
        case 'video':
            replyVideo(events);
            break;
        case 'location':
            replyLocation(events);
            break;
        default:
            console.log("not match any current events: ", events)
    }
}

function replyText(events){
    switch(events[0].message.text) {
        case 'Flex example':
            createFlexMessage(events);
            break;
        case 'Template example':
            createTemplateMessage(events);
            break;
        case 'Imagemap example':
            createImagemapMessage(events);
            break;
        default:
            createTextMessage(events);
    }
}

function createFlexMessage(events){
    let message = [{
        "type": "flex",
        "altText": "Q1. Which is the API to create chatbot?",
        "contents": {
            "type": "carousel",
            "contents": [
              {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "image",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip1.jpg",
                      "size": "full",
                      "aspectMode": "cover",
                      "aspectRatio": "2:3",
                      "gravity": "top"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Brown's T-shirts",
                              "size": "xl",
                              "color": "#ffffff",
                              "weight": "bold"
                            }
                          ]
                        },
                        {
                          "type": "box",
                          "layout": "baseline",
                          "contents": [
                            {
                              "type": "text",
                              "text": "¥35,800",
                              "color": "#ebebeb",
                              "size": "sm",
                              "flex": 0
                            },
                            {
                              "type": "text",
                              "text": "¥75,000",
                              "color": "#ffffffcc",
                              "decoration": "line-through",
                              "gravity": "bottom",
                              "flex": 0,
                              "size": "sm"
                            }
                          ],
                          "spacing": "lg"
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "filler"
                            },
                            {
                              "type": "box",
                              "layout": "baseline",
                              "contents": [
                                {
                                  "type": "filler"
                                },
                                {
                                  "type": "icon",
                                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip14.png"
                                },
                                {
                                  "type": "text",
                                  "text": "Add to cart",
                                  "color": "#ffffff",
                                  "flex": 0,
                                  "offsetTop": "-2px"
                                },
                                {
                                  "type": "filler"
                                }
                              ],
                              "spacing": "sm"
                            },
                            {
                              "type": "filler"
                            }
                          ],
                          "borderWidth": "1px",
                          "cornerRadius": "4px",
                          "spacing": "sm",
                          "borderColor": "#ffffff",
                          "margin": "xxl",
                          "height": "40px",
                          "action": {
                            "type": "message",
                            "label": "Add to cart",
                            "text": "Add to cart"
                          }
                        }
                      ],
                      "position": "absolute",
                      "offsetBottom": "0px",
                      "offsetStart": "0px",
                      "offsetEnd": "0px",
                      "backgroundColor": "#03303Acc",
                      "paddingAll": "20px",
                      "paddingTop": "18px"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "SALE",
                          "color": "#ffffff",
                          "align": "center",
                          "size": "xs",
                          "offsetTop": "3px"
                        }
                      ],
                      "position": "absolute",
                      "cornerRadius": "20px",
                      "offsetTop": "18px",
                      "backgroundColor": "#ff334b",
                      "offsetStart": "18px",
                      "height": "25px",
                      "width": "53px"
                    }
                  ],
                  "paddingAll": "0px"
                }
              },
              {
                "type": "bubble",
                "body": {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "image",
                      "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip2.jpg",
                      "size": "full",
                      "aspectMode": "cover",
                      "aspectRatio": "2:3",
                      "gravity": "top"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "text",
                              "text": "Cony's T-shirts",
                              "size": "xl",
                              "color": "#ffffff",
                              "weight": "bold"
                            }
                          ]
                        },
                        {
                          "type": "box",
                          "layout": "baseline",
                          "contents": [
                            {
                              "type": "text",
                              "text": "¥35,800",
                              "color": "#ebebeb",
                              "size": "sm",
                              "flex": 0
                            },
                            {
                              "type": "text",
                              "text": "¥75,000",
                              "color": "#ffffffcc",
                              "decoration": "line-through",
                              "gravity": "bottom",
                              "flex": 0,
                              "size": "sm"
                            }
                          ],
                          "spacing": "lg"
                        },
                        {
                          "type": "box",
                          "layout": "vertical",
                          "contents": [
                            {
                              "type": "filler"
                            },
                            {
                              "type": "box",
                              "layout": "baseline",
                              "contents": [
                                {
                                  "type": "filler"
                                },
                                {
                                  "type": "icon",
                                  "url": "https://scdn.line-apps.com/n/channel_devcenter/img/flexsnapshot/clip/clip14.png"
                                },
                                {
                                  "type": "text",
                                  "text": "Add to cart",
                                  "color": "#ffffff",
                                  "flex": 0,
                                  "offsetTop": "-2px"
                                },
                                {
                                  "type": "filler"
                                }
                              ],
                              "spacing": "sm"
                            },
                            {
                              "type": "filler"
                            }
                          ],
                          "borderWidth": "1px",
                          "cornerRadius": "4px",
                          "spacing": "sm",
                          "borderColor": "#ffffff",
                          "margin": "xxl",
                          "height": "40px",
                          "action": {
                            "type": "message",
                            "label": "Add to cart",
                            "text": "Add to cart"
                          }
                        }
                      ],
                      "position": "absolute",
                      "offsetBottom": "0px",
                      "offsetStart": "0px",
                      "offsetEnd": "0px",
                      "backgroundColor": "#9C8E7Ecc",
                      "paddingAll": "20px",
                      "paddingTop": "18px"
                    },
                    {
                      "type": "box",
                      "layout": "vertical",
                      "contents": [
                        {
                          "type": "text",
                          "text": "SALE",
                          "color": "#ffffff",
                          "align": "center",
                          "size": "xs",
                          "offsetTop": "3px"
                        }
                      ],
                      "position": "absolute",
                      "cornerRadius": "20px",
                      "offsetTop": "18px",
                      "backgroundColor": "#ff334b",
                      "offsetStart": "18px",
                      "height": "25px",
                      "width": "53px"
                    }
                  ],
                  "paddingAll": "0px"
                }
              }
            ]
          }
    },{
        "type": "text",
        "text": "Do you want to do anything else? 😊",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/lollipop.png`,
              "action": {
                "type": "message",
                "label": "Flex example",
                "text": "Flex example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/bat.png`,
              "action": {
                "type": "message",
                "label": "Template example",
                "text": "Template example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/ghost.png`,
              "action": {
                "type": "message",
                "label": "Imagemap example",
                "text": "Imagemap example"
              }
            }
          ]
        }
    }];
    replyRequest(events[0].replyToken, message);
}

function createTemplateMessage(events){
    let message = [{
        "type": "template",
        "altText": "This is a carousel template",
        "template": {
          "type": "carousel",
          "columns": [
            {
              "thumbnailImageUrl": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
              "imageBackgroundColor": "#FFFFFF",
              "title": "Item 1",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "https://www.google.com/"
              },
              "actions": [
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "https://developers.line.biz/en/reference/messaging-api/#template-messages"
                }
              ]
            },
            {
              "thumbnailImageUrl": "https://scdn.line-apps.com/n/channel_devcenter/img/fx/01_1_cafe.png",
              "imageBackgroundColor": "#000000",
              "title": "Item 2",
              "text": "description",
              "defaultAction": {
                "type": "uri",
                "label": "View detail",
                "uri": "https://www.google.com/"
              },
              "actions": [
                {
                  "type": "uri",
                  "label": "View detail",
                  "uri": "https://developers.line.biz/en/reference/messaging-api/#template-messages"
                }
              ]
            }
          ],
          "imageAspectRatio": "rectangle",
          "imageSize": "cover"
        }
      },{
        "type": "text",
        "text": "Do you want to do anything else? 😊",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/lollipop.png`,
              "action": {
                "type": "message",
                "label": "Flex example",
                "text": "Flex example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/bat.png`,
              "action": {
                "type": "message",
                "label": "Template example",
                "text": "Template example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/ghost.png`,
              "action": {
                "type": "message",
                "label": "Imagemap example",
                "text": "Imagemap example"
              }
            }
          ]
        }
    }];
    replyRequest(events[0].replyToken, message);
}

function createImagemapMessage(events){
    let message = [{
        "type": "imagemap",
        "baseUrl": `${process.env.DOMAIN}/images/imagemap_example`,
        "altText": "This is an imagemap example",
        "baseSize": {
          "width": 1040,
          "height": 644
        },
        "actions": [
          {
            "type": "message",
            "area": {
              "x": 67,
              "y": 43,
              "width": 442,
              "height": 234
            },
            "text": "Text Area 1"
          },
          {
            "type": "message",
            "area": {
              "x": 541,
              "y": 41,
              "width": 411,
              "height": 234
            },
            "text": "Text Area 2"
          },
          {
            "type": "uri",
            "area": {
              "x": 64,
              "y": 316,
              "width": 438,
              "height": 259
            },
            "linkUri": "https://developers.line.biz/en/reference/messaging-api/#imagemap-message"
          },
          {
            "type": "message",
            "area": {
              "x": 539,
              "y": 321,
              "width": 417,
              "height": 252
            },
            "text": "Text Area 4"
          }
        ]
    },{
        "type": "text",
        "text": "Do you want to do anything else? 😊",
        "quickReply": {
          "items": [
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/lollipop.png`,
              "action": {
                "type": "message",
                "label": "Flex example",
                "text": "Flex example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/bat.png`,
              "action": {
                "type": "message",
                "label": "Template example",
                "text": "Template example"
              }
            },
            {
              "type": "action",
              "imageUrl": `${process.env.DOMAIN}/images/ghost.png`,
              "action": {
                "type": "message",
                "label": "Imagemap example",
                "text": "Imagemap example"
              }
            }
          ]
        }
    }];
    replyRequest(events[0].replyToken, message);
}

function createTextMessage(events){
    let message = [{
        "type": "text",
        "text": events[0].message.text
    }];
    replyRequest(events[0].replyToken, message);
}

function replySticker(events){
    let packageId = 446;
    let arrStickerId = [1988, 1994, 1999, 2005, 2006, 2021, 2022, 2020, 2009];//https://developers.line.biz/en/docs/messaging-api/sticker-list/#sticker-definitions
    let message = [{
        "type": "sticker",
        "packageId": packageId,
        "stickerId": arrStickerId[Math.floor((Math.random()*arrStickerId.length))]
    }];
    replyRequest(events[0].replyToken, message);
}

function replyImage(events){
    //https://api-data.line.me/v2/bot/message/${events[0].message.id}/content 
    //if you want to manage something from image you have to use get message content API from LINE to get the image binary and use it to do next thing.
    let message = [{
        type: 'image',
        originalContentUrl: `${process.env.DOMAIN}/images/cat_meme.png`,
        previewImageUrl: `${process.env.DOMAIN}/images/cat_meme.png`,
    }];
    replyRequest(events[0].replyToken, message);
}

function replyAudio(events){
    //if you want to access content of the audio file, use this API https://api-data.line.me/v2/bot/message/${events[0].message.id}/content
    let message = [{
        type: "audio",
        originalContentUrl: "https://mokmoon.com/audios/line.mp3",
        duration: 1000
    }]
    replyRequest(events[0].replyToken, message);
}

function replyVideo(events){
    //if you want to access content of the video file, use this API https://api-data.line.me/v2/bot/message/${events[0].message.id}/content
    let message = [{
        type: "video",
        originalContentUrl: `${process.env.DOMAIN}/videos/LINE-video.mp4`,
        previewImageUrl: `${process.env.DOMAIN}/images/LINE-video-cover.jpg`
    }]
    replyRequest(events[0].replyToken, message);
}

function replyLocation(events){
    let message = [
        {
            type: "text",
            text: `Your location: \nlat: ${events[0].message.latitude}\nlon: ${events[0].message.longitude}\nAddress: ${events[0].message.address}`,
        },
        {
            type: "text",
            text: "Here is my location",
        },{
            type: "location",
            title: "LINE COMPANY (THAILAND)",
            address: "127 Ratchadamri Rd, Lumphini, Pathum Wan, Bangkok 10330",
            latitude: 13.7459941,
            longitude: 100.5382883
        }
    ]
    replyRequest(events[0].replyToken, message);
}

function replyRequest(replyToken, message){
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
    }
    let body = JSON.stringify({
        replyToken: replyToken,
        messages: message
    })
    request.post({
        url: 'https://api.line.me/v2/bot/message/reply',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status: ' + res.statusCode);
    });
}

function generateUniqueId(){
    const timestamp = new Date().getTime();
    const uniqueId = `${timestamp}_${Math.floor(Math.random() * 1000)}`;
    return uniqueId;
}

app.post('/pushMessage', (req, res) => {
    let lineId = req.body.lineId;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
        'X-Line-Retry-Key': generateUniqueId()
    }
    let body = {
        to: lineId,
        messages: [{
            "type": "text",
            "text": "This message comes from Push API."
        }]
    }
    request.post({
        url: 'https://api.line.me/v2/bot/message/push',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status: ' + res.statusCode);
    });
});

app.post('/muticastMessage', (req, res) => {
    let lineIds = req.body.lineId;
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
        'X-Line-Retry-Key': generateUniqueId()
    }
    let body = {
        to: lineIds,
        messages: [{
            "type": "text",
            "text": "This message comes from Multicast API."
        }]
    }
    request.post({
        url: 'https://api.line.me/v2/bot/message/multicast',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status: ' + res.statusCode);
    });
});

app.post('/narrowcastMessage', (req, res) => {
    //to do
});

app.post('/broadcastMessage', (req, res) => {
    let headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`,
        'X-Line-Retry-Key': generateUniqueId()
    }
    let body = {
        messages:[{
            "type":"text",
            "text":"This message comes from Broadcast API."
        }]
    }
    request.post({
        url: 'https://api.line.me/v2/bot/message/broadcast',
        headers: headers,
        body: body
    }, (err, res, body) => {
        console.log('status: ' + res.statusCode);
    });
});