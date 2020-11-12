
const express = require('express');
const app = express();
const ws = require('ws');
const PORT = process.env.PORT || 9000;

//body parser middleware
app.use(express.json());

app.use(express.static(__dirname + '/public'))

//route handler will send index.html
app.get('/', (req, res, next) => {
    res.sendFile(__dirname + '/index.html')
})

//route handler for post request
const messArray = [];
app.post('/api/chat', (req, res, next) => {
  try{
    const mess = { ...req.body, id: Math.round(Math.random() * 1000) };
    messArray.push(mess)
    console.log('messArr', messArray)
    res.send(mess);
  } catch(err) {
    next(err)
  }
});

//route handler for get request
app.get('/api/chat', (req, res, next) => {
  try{
    //const messages = {...messArray};
    //console.log('hi ', messages)
    res.send(messArray)
  } catch(err){
    console.log(err)
  }
})


const server = app.listen( PORT, () => {
    console.log( `app listening on port: ${PORT}`)
});


//create socket server using express server instance
const socketServer = new ws.Server( { server } );

let socketsArr = [];
  socketServer.on('connection', (socket, req )=> {
    const ip = req.socket.remoteAddress;
    console.log('ip ', ip)
    socket.ip = ip;
    socketsArr.push(socket);
    
    //send message to client on browser
    //socket.send('what it is?') this appears in browser
    //console.log('connected on socket') this appeats in terminal

    //listening for 'message' on socket
    socket.on( 'message', e => {
      console.log('listening on server: ', e)
      // e is received as a string

      //send in socket all sockets in soketArr 
      socketsArr.forEach( s => s.send(e)) 
    })
  })












// const express = require('express');
// const app = express();
// const http = require('http').createServer(app);

// //initialize a new instance of socket.io by passing the http(HTTP server) object
// const io = require('socket.io')(http);
// const PORT = process.env.PORT || 9000;

// //route handler will send index.html
// app.get('/', (req, res) => {
//   res.sendFile(__dirname + '/index.html');
// });

// //listening on the connection event for incoming sockets
// io.on('connection', (socket) => {
//     //console.log('a user connected')
   
//         socket.emit('chat message, baby ', msg)
    
// });


// http.listen(PORT, () => {
//   console.log(`listenting on port: ${PORT}`);
// });

// // FROM socket.io webpage:

// //     Socket.IO is composed of two parts:

// //     A server that integrates with (or mounts on) the Node.JS HTTP Server socket.io
// //     A client library that loads on the browser side socket.io-client
// //     During development, socket.io serves the client automatically for us.