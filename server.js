const express=require('express');
const path=require('path');
const app=express();
const http=require('http');
const socketio=require('socket.io');
const data=require('./utils/function');
const {userJoin,getCurrentUser,userLeave,getRoomUsers}=require('./utils/user');
const server=http.createServer(app);
const io=socketio(server);

//static folder
app.use(express.static(path.join(__dirname,'public'))); 


io.on('connection',socket=>{
    const bot='Sbot';
    socket.on('joinRoom',({username,room})=>{

        const user=userJoin(socket.id,username,room);
        socket.join(user.room);
       // console.log(user);
       //welcome message
    socket.emit('message',data(bot,'welcome on SChat'));
    
    //new connection message
    socket.broadcast.to(user.room).emit('message',data(bot,`${user.username} has joined`));

    // online users
    io.to(user.room).emit('roomUsers',{
        room:user.room,
        users:getRoomUsers(user.room)
    });

    });
   

    //chat message
    socket.on('chatMessage',(msg)=>{
        const user=getCurrentUser(socket.id);
        io.to(user.room).emit('message',data(user.username,msg));
    });


     // when a user disconnect
     socket.on('disconnect',()=>{
         const user=userLeave(socket.id);
         if(user){
        io.to(user.room).emit('message',data(bot,`${user.username} has left`));

        io.to(user.room).emit('roomUsers',{
            room:user.room,
            users:getRoomUsers(user.room)
        });
         }
    });

});

const PORT=process.env.PORT || 3000;
server.listen(PORT,()=>console.log(`server started on port ${PORT}`));