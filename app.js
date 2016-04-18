var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});


io.sockets.on('connection', function (socket, pseudo) {

    function genere_calcul() {
        var table1 = (Math.random() * 10).toFixed(0);
        var table2 = (Math.random() * 10).toFixed(0);
        socket.table1 = table1;
        socket.table2 = table2;
        socket.emit('generation', {t1 : table1, t2: table2});        
    };

var score = 0;

    socket.on('start', function (socket) {
        genere_calcul();
    });

    //     pseudo = ent.encode(pseudo);

    socket.on('message', function (resultat) {

        if (resultat == socket.table1 * socket.table2) {
            socket.emit('reponse', {reponse_msg : "Super, tu es balèze", image : "http://thumbs.dreamstime.com/x/gold-badge-5392868.jpg"});
            score ++;
	   }
        else {
            socket.emit('reponse', {reponse_msg : "Il faut encore progresser", image : "http://comps.canstockphoto.fr/can-stock-photo_csp15595090.jpg"});
        }
        genere_calcul();

    }); 
});

server.listen(8080);
