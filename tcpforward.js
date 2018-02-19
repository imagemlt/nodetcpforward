var net=require('net')

var LOCALHOST=process.argv[2]
var LOCALPORT=parseInt(process.argv[3])
var REMOTEHOST=process.argv[4]
var REMOTEPORT=parseInt(process.argv[5])

net.createServer(function(sock){
    console.log('CONNECTED: '+sock.remoteAddress+':'+sock.remotePort);
    var client=new net.Socket();
    client.connect(REMOTEPORT,REMOTEHOST,function(){
        console.log('connection established to remote port for '+sock.remoteAddress+':'+sock.remotePort);
    })

    client.on('data',function(data){
        sock.write(data);
    })
    client.on('end',function(){
        console.log('disconnected from server with '+sock.remoteAddress+':'+sock.remotePort);
        sock.end();
    })
    client.on('error',function(err){
        console.log('error accured in client socket '+client.remoteAddress+':'+client.remotePort+' :'+err.message);  
        sock.end(); 
        client.end();    
    })
    sock.on('data',function(data){
        client.write(data);
    })
    sock.on('close',function(data){
        console.log('disconnected from client with '+client.remoteAddress+':'+client.remotePort);
        client.end();
    })
    sock.on('error',function(err){
        console.log('error accured in remote socket '+sock.remoteAddress+':'+sock.remotePort+' :'+err.message);
        client.end();
        sock.end();
    })
}).listen(LOCALPORT,LOCALHOST);

console.log('forward started pn '+LOCALHOST+':'+LOCALPORT+' to '+REMOTEHOST+':'+REMOTEPORT)