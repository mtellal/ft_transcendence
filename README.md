# ft_transcendence

<hr/>

## FRONTEND 
`http://localhost:8080`

## Docs:

### CSS 
- https://github.com/suitcss/suit - suitCSS - naming convention used by twitter 
  ##### BEM
  - https://yandex.com/dev/bem/ - BEM naming convention 
  - https://webuild.envato.com/blog/how-to-scale-and-maintain-legacy-css-with-sass-and-smacss/ 
  - https://www.york.ac.uk/pattern-library/about/css.html 

#### AJAX / HTTP POLLING
- https://advancedweb.hu/how-to-use-async-functions-with-array-map-in-javascript/ - Async map array of promises + explications async/sync processes
- https://stackoverflow.com/questions/12555043/my-understanding-of-http-polling-long-polling-http-streaming-and-websockets

#### Typescript 
- https://mattbatman.com/typescript-and-webpack-and-images - import resolve tsc and webpack

#### Web sockets
- https://javascript.info/websocket -Websocket API

#### Session / Local / Cookies
- https://blog.logrocket.com/storing-retrieving-javascript-objects-localstorage/ - Local Storage / Sessions Storage / Cookies
- https://stackoverflow.com/questions/19183180/how-to-save-an-image-to-localstorage-and-display-it-on-the-next-page - Serialize an image (in canvas) into Local Storage
- https://dev.to/rdegges/please-stop-using-local-storage-1i04 - Bad use cases of Local Storage 
  ##### More docs (security / XSS / local storage / session / cookies)
  - https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html#Local_Storage
  - https://jwt.io/ - javascript web token (encode data structure into a jwt)
  - https://blog.codinghorror.com/protecting-your-cookies-httponly/ - cookies and xss attack
  - https://michalzalecki.com/why-using-localStorage-directly-is-a-bad-idea/ - local storage errors safari / chrome and others ...

<hr/>


## BACKEND 
`http://localhost:3000`

## Docs:

#### General NestJS documentation
- [Nestjs Docs](https://docs.nestjs.com/)

#### Building a REST API
- [Build a REST API with NestJS and Prisma](https://www.youtube.com/watch?v=LMjj1_EK4y8) - Used to create a basic User module with CRUD endpoints

#### Uploading
- [Blog Project - NestJS](https://www.youtube.com/playlist?list=PLVfq1luIZbSnytbsm2i8Ocf_hyUHTsqbZ) - Great playlist about creating a blog using NestJS. Very useful infos about image uploading, using AuthGuard to protect endpoints

#### Authentification
- [Authentification using Prisma and NestJS](https://www.prisma.io/blog/nestjs-prisma-authentication-7D056s1s0k3l) - Implementing authentification in a REST API

#### Realtime Chat with Websockets
- [Realtime Chat App](https://www.youtube.com/playlist?list=PLVfq1luIZbSkICzoA8EuvTskPEROS68i9) - Playlist about creating a realtime chat app using NestJS.
- [Real-time chat with WebSockets](https://wanago.io/2021/01/25/api-nestjs-chat-websockets/)
- [Socket.io JWT](https://www.npmjs.com/package/socketio-jwt)

## Sockets:

### Events

#### Backend

The backend listens to these events: 
- 'message': Takes the channelId and the content of the message in the dto. Message will be emited only to the users of that room.
- 'createChannel': Takes a name (optional), a type, a password (optional), a member list and an administrator list (both optional). Creates a channel with the given type and name, adds the specified users to the channel at its creation.
- 'joinChannel': Takes a channelId and a password (optional). Join the given channel.
- 'leaveChannel': Takes a channelId.
- 'addtoChannel': Takes a channelId and a userId. Only administrators can add someone to a channel.
- 'kickUser', 'banUser': Takes a channelId, userId and a reason (optional). Administrators can use admin actions on members and owner can use admin action on anyone. Emits a notification to the serv when an admin action was taken.
- 'muteUser': Takes a channelId, userId, a duration and a reason (optional). A muted user can't send messages to the given channel.
- 'makeAdmin': Takes a channelId and a userId. Only the owner can make someone else admin.

I added an 'addedtoChannel' event that will be emited to a user that has been newly added to a channel. Let me know if it is useful or not to allow the list of channels of a user to be updated.
Check the dtos in backend/src/chat/dto to see what the server is expecting to receive

<hr/>

