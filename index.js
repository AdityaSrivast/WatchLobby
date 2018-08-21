
var express=require('express');
var ejs=require('ejs');

var app=express();
var server = require('http').createServer(app);
var io=require('socket.io')(server);

app.set('view engine','ejs');
// app.use(express.static(__dirname+'/public'))
app.use(express.static('public'))


app.get('/',function(req,res){
    res.render('index');
})

var host=[];
io.on('connection',function(client){
    console.log('CONNECTED')
    if(host.length==0){
        host.push(client.id);
        io.emit('host',{id:host[0]})
    }
    else{
        host.push(client.id)
        client.to(host).emit('get',{});
        io.emit('host',{id:host[0]})
    }
    console.log(host);
    client.on('time',function(data){
        console.log(data);
        io.emit('time',data);
    });
    client.on('get',function(data){
        console.log('HOST'+host)
        client.to(host[0]).emit('get',data);
    });
    client.on('newvideo',function(data){
        console.log(host)
        if(data.id==host[0]){
            console.log(1);
            io.emit('newvideo2',data);
        }
        else{
            client.emit('errormessage',data)
        }
    })
    client.on('change', function(data){
        io.emit('change',data);
    });
    client.on('sync',function(data){
        console.log(data)
        io.emit('sync',data)
    })
    client.on('mute',function(data){
        io.emit('mute',data)
    })
    client.on('disconnect', function(){
        host.splice(host.indexOf(client.id),1);
        console.log('DISCONNECTED')
    });
})
var port=process.env.PORT || 3000;
server.listen(port,function(){
    console.log('running')
});
