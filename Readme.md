# COMMT: Chat SDK for NodeJS

![npm](https://img.shields.io/npm/dw/%40commt%2Fnode-sdk)
![npm](https://img.shields.io/npm/v/%40commt%2Fnode-sdk)
![NPM](https://img.shields.io/npm/l/%40commt%2Fnode-sdk?color=blue)


<p align="center">
<img src="./src/assets/node-js-logo.png" width="300" />
</p>
<br />

Welcome to Commt's NodeJS package – the heart of secure chat functionalities for your NodeJS applications!
Commt is a versatile chat plugin designed to seamlessly integrate secure and customizable chat functionalities into your applications. Commt ensures a secure and reliable real-time communication experience for your users.



## Features
- Written in **TypeScript**
- Fully customizable pre-build components with plugins
- Multiple projects support with only one client configuration
- AES encryption as default and end-to-end (E2E) support
- Webhooks usage flexibility
- Customizable and easy to manage system messages
- `Typing`, `user online` and `message read` indicators
- Emoji keyboard and all emoji types support with plugins
- Hooks usage flexibility

## Installation

- NPM: `npm i -S @commt/node-sdk`
- Yarn: `yarn add @commt/node-sdk`

For detailed installation instructions and configuration options, please refer to our [documentation](https://commt.co/doc/nodejs#installation).

## Usage

Get started with Commt in just a few steps:

- Initialize Commt: Import the Commt module and init it in index file of your application then you can have a global instance of it by using `with` method.
- Access From Everywhere: Define once in the beginning of your application and set it as global to access all over the files of your application.
- Implement Secure Chat: Decrypt messages in your codebase, since Commt sends messages with encrypted format!

Check out our [documentation](https://commt.co/doc/nodejs#introduction) for comprehensive usage examples and API reference.

## Example

You can get client configs info from [Commt Dashboard](https://dashboard.commt.co)

**index.ts**
```
import { Commt } from "@commt/node-sdk";

// Initiate Commt in your app/index file
Commt.init({
  apiKey: "123456789?",
  subscriptionKey: "0987654321?",
  secret: "4k4hum6rfuvxorul94zimh55",
});

global.commt = Commt.with(); // Define it as a global variable
```

**chat.js**
```
router.post('/save-message', async (req, res) => {
    try {
        // Get encrypted message from req.body
        const { message: cipher, iv } = req.body;

        // Decrypt it by using commt and parse it to object
        const result = JSON.parse(commt.decrypt({ cipher, iv }));

        // Get required parameters from decrypted result
        const {roomId, message} = result;


        // Save message to your database
        await MessageModel.create({
            roomId,
            type: message.type,
            senderId: message.senderId,
            createdAt: message.createdAt,
            message: message.text,
        });

        // Return 200 status code
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});
```
**room.ts**
```
router.post('/create-room', async (req, res) => {
    try {
        // Get array of string participants
        const { participants } = req.body;

        // Inform commt for newly created room by passing array of chatAuthIds of the users and get chatRoomAuthId field in return
        const chatRoomAuthId = commt.createRoom(participants.chatAuthIds);

        // Create new room with given data
        await RoomModel.create({
            roomId,
            chatRoomAuthId,
            participants: participants.ids,
            ...(communityAvatar && communityName && { communityAvatar, communityName})
        });

        // Return 200 status code
        res.status(200).send();
    } catch (err) {
        res.status(500).send(err.message);
    }
});
```

## Compatibility

Commt is compatible with:

- [React Native](https://commt.co/doc#react-native)
- [ReactJS](https://commt.co/doc#reactjs)
- [NodeJS](https://commt.co/doc#nodejs)

## Support and Feedback

For any questions, feedback or issues, feel free to reach out to us via <contact@commt.co>.

## License

[MIT](https://github.com/commt/commt-nodejs/blob/master/LICENSE)