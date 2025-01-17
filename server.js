const path=require('path');
const express= require('express');
const http= require('http');
const app= express();
const socketio=require('socket.io');
const server=http.createServer(app);
const io=socketio(server);
const formatMessage= require('./utils/messages')
const {userJoin, getCurrentUser,getRoomUsers,userLeaves} = require('./utils/users')
const botName='ChatFox Bot'
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

//Set static folder
app.use(express.static(path.join(__dirname,'public')));

//Run when client connects
io.on('connection',socket=>{
    socket.on('joinRoom', ({username,room})=>{

        const user=userJoin(socket.id,username,room);

        socket.join(user.room);
            //Welcome current user
        socket.emit('message',formatMessage(botName,'Welcome to ChatFox!'))

        //Broadcast when a user connects
        socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))
        
        //Send users and room info
        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        })

    })
   //Listen for chatMessage
   socket.on('chatMessage',(msg)=>{
       const user=getCurrentUser(socket.id);
    io.to(user.room).emit('message',formatMessage(user.username,msg));
    })

    //Runs when client disconnects
    socket.on('disconnect', () => {
        const user = userLeaves(socket.id);
    
        if (user) {
          io.to(user.room).emit(
            'message',
            formatMessage(botName, `${user.username} has left the chat`)
          );
    
          // Send users and room info
          io.to(user.room).emit('roomUsers', {
            room: user.room,
            users: getRoomUsers(user.room)
          });
        }
      });

    
})

const PORT=3000||process.env.PORT;

server.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})