
var express=require('express');
var ejs=require('ejs');

var app=express();
var server = require('http').createServer(app);
var io=require('socket.io')(server);

app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'))

app.get('/',function(req,res){
    res.render('index');
})

var host=0;
io.on('connection',function(client){
    console.log('CONNECTED')
    if(host===0){
        host=client.id;
    }
    else{
        client.to(host).emit('get',{});
    }
    console.log(host);
    client.on('get',function(data){
        client.broadcast.emit('get',data)
    });

    client.on('text',function(data){
        console.log('data');
        client.broadcast.emit('text',data);
    });
    
    client.on('change', function(data){
        client.broadcast.emit('change',data);
    });
            
    client.on('disconnect', function(){
        if(client.id==host){
            host=0;
        }
        console.log('DICONNECTED')
    });
})

server.listen(3000)