
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

var host=[];
io.on('connection',function(client){
    console.log('CONNECTED')
    if(host.length==0){
        host.push(client.id);
    }
    else{
        host.push(client.id)
        client.to(host).emit('get',{});
    }
    console.log(host);
    client.on('wait',function(data){
        client.broadcast.emit('wait',data)
    });
    client.on('get',function(data){
        console.log('HOST'+host)
        client.to(host[0]).emit('get',data);
    });
    client.on('newvideo',function(data){
        console.log(host)
        if(client.id==host[0]){
            console.log(1);
            client.emit('newvideo',data);
        } else{
            client.emit('errormessage',data);
        }
    })
    client.on('change', function(data){
        client.broadcast.emit('change',data);
    });
    client.on('sync',function(data){
        console.log(data)
        client.broadcast.emit('sync',data)
    })        
    client.on('disconnect', function(){
        host.splice(host.indexOf(client.id),1);
        console.log('DICONNECTED')
    });
})
var port=process.env.PORT || 4040;
server.listen(port,function(){
    console.log('running')
});