const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

const app = express();
require('dotenv').config();
const port = process.env.PORT || 8080;
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.send('Welcome to LINE messaging API DEMO');
});

app.post('/webhook', (req, res) => {
    //console.log("events: ",req.body.events[0]);
    const events = req.body.events;
    if(events.length > 0){
        if(events[0].type == "follow"){
            let lineUserId = events[0].source.userId;
            collectLineId(lineUserId);
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

function collectLineId(lineUserId){
    request.get({
        url: `${process.env.JSON_SERVER_URL}/users`,
        json: true
    },(error, response, body) => {
        if (error) {
            console.error('error:', error);
        } else {
            let existingUser = body.find(user => user.lineUserId === lineUserId);
            console.log("existingUser: ",existingUser)
            if(!existingUser){
                createUser(lineUserId);
            }
        }
    });
}

function createUser(lineUserId){
    const newData = {
        lineUserId: lineUserId,
    };
    request.post({
        url: `${process.env.JSON_SERVER_URL}/users`,
        json: true,
        body: newData,
    },(error, response, body) => {
        if (error) {
            console.error('error:', error);
        } else {
            console.log('success:', body);
        }
    });
}

function greetText(events){
    let message = [{
        "type": "text",
        "text": "Hello and welcome to our test channel! 😊"
    }];
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

// function getUserProfile(lineUserId){
//     let headers = {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${process.env.CHANNEL_ACCESS_TOKEN}`
//     }
//     request.get({
//         url: `https://api.line.me/v2/bot/profile/${lineUserId}`,
//         headers: headers
//     }, (err, res, body) => {
//         console.log('profiless: ' + body);
//         return body;
//     });
// }

// function checkLINEname(){

// }

// function startsWithM(name) {
//     return name.toLowerCase().startsWith('m');
// }

// function addUserToAudienceGroup(lineUserId){
//     let userProfile = getUserProfile(lineUserId);
//     console.log("userss", userProfile)
// }

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