var http = require('http');
var url = require('url');
var fs = require('fs');
var server;

server = http.createServer(function(req, res){
    // your normal server code
    var path = url.parse(req.url).pathname;
    switch (path){
        case '/':
            res.writeHead(200, {'Content-Type': 'text/html'});
            res.write('<h1>Hello! Try the <a href="/test.html">Test page</a></h1>');
            res.end();
            break;
		case '/angulartableRT.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });	
		case '/css/app.css':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(data, 'utf8');
                res.end();
            });	
		case '/css/bootstrap.css':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'text/css'});
                res.write(data, 'utf8');
                res.end();
            });
		case '/lib/angular/angular.js':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data, 'utf8');
                res.end();
            });	
		case '/js/appstock.js':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data, 'utf8');
                res.end();
            });	
		case '/js/RTcontroller.js':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'text/javascript'});
                res.write(data, 'utf8');
                res.end();
            });					
		case '/test.html':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': path == 'json.js' ? 'text/javascript' : 'text/html'});
                res.write(data, 'utf8');
                res.end();
            });
		case '/stocks.json':
            fs.readFile(__dirname + path, function(err, data){
                if (err){ 
                    return send404(res);
                }
                res.writeHead(200, {'Content-Type': 'application/json'});
                res.write(data, 'utf8');
                res.end();
            });	
        break;
        default: send404(res);
    }
}),

send404 = function(res){
    res.writeHead(404);
    res.write('404');
    res.end();
};

server.listen(8001);
var msgWrite = '';

// use socket.io
var io = require('socket.io').listen(server);

//turn off debug
io.set('log level', 1);

var serverjson = [
                 {"Product": "REL", "BBP": "10", "BSP": "10.2", "LTP": "10.1" }, 
				 {"Product": "BEL", "BBP": "20", "BSP": "20.4", "LTP": "20"    }, 
				 {"Product": "MTL", "BBP": "50", "BSP": "50.5", "LTP": "50.1"  }, 
				 {"Product": "BSL", "BBP": "100", "BSP": "101", "LTP": "100.2" }
				 ];

// define interactions with client
io.sockets.on('connection', function(socket){
    //send data to client
    setInterval(function(){
        
		for(i=0;i<serverjson.length;i++)
		{
			serverjson[i].BBP = Math.round((parseInt(serverjson[i].BBP) + Math.random())*100)/100;
			serverjson[i].BSP = Math.round((parseInt(serverjson[i].BSP) + Math.random())*100)/100;
			serverjson[i].LTP = Math.round((parseInt(serverjson[i].LTP) + Math.random())*100)/100;
		}
		
		var serverjsonstr = JSON.stringify(serverjson);
		
		socket.emit('msg', {'msg': serverjsonstr});
		socket.emit('msgWrite', msgWrite);
    }, 1000);

    //recieve client data
    socket.on('client_data', function(data){
        process.stdout.write(data.letter);
		msgWrite = msgWrite + data.letter;
    });
});
