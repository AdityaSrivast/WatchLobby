
var express=require('express');

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
    if(host===0){
        host=client.id;
    }
    else{
        client.to(host).emit('get',{});
    }
    client.on('get',function(data){
        client.broadcast.emit('get',data)
    })
    client.on('text',function(data){
        var express=require('express');
        
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
            if(host===0){
                host=client.id;
            }
            else{
                client.to(host).emit('get',{});
            }
            client.on('get',function(data){
                client.broadcast.emit('get',data)
            })
            client.on('text',function(data){
                console.log('data');
                client.broadcast.emit('text',data);
            })
            console.log('CONNECTED')
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
        client.broadcast.emit('text',data);
    })
    console.log('CONNECTED')
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