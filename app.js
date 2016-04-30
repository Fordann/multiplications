// Importer les librairies necessaires
var app = require('express')(),
    server = require('http').createServer(app),
    io = require('socket.io').listen(server),
	storage = require('node-persist'),
    ent = require('ent'), // Permet de bloquer les caractères HTML (sécurité équivalente à htmlentities en PHP)
    fs = require('fs');
	
// Initialiser le stockage
storage.initSync();

// récupère le score sur le disque dur s'il existe
console.log(storage.keys())
if ( storage.keys().indexOf ("score") > -1 ) {

	var score = storage.getItem('score');
	}
else {
	var score = 0;
}

// Chargement de la page index.html
app.get('/', function (req, res) {
  res.sendfile(__dirname + '/index.html');
});

io.sockets.on('connection', function (socket) {

    function genere_calcul() {
        var table1 = (Math.random() * 10).toFixed(0);
        var table2 = (Math.random() * 10).toFixed(0);
        socket.table1 = table1;
        socket.table2 = table2;
        socket.emit('generation', {t1 : table1, t2: table2});
		console.log(score);
		socket.emit('score', {score : score});		
    };


    socket.on('start', function (socket) {
        genere_calcul();
    });



    socket.on('message', function (resultat) {

        if (resultat == socket.table1 * socket.table2) {
			score ++;
			console.log(score);
			storage.setItem('score',score);
            socket.emit('reponse', {reponse_msg : "Super, tu es balèze", image : "http://thumbs.dreamstime.com/x/gold-badge-5392868.jpg"});
	   }
        else {
            socket.emit('reponse', {reponse_msg : "Il faut encore progresser", image : "http://comps.canstockphoto.fr/can-stock-photo_csp15595090.jpg"});
        }
        genere_calcul();

    }); 
});

server.listen(8080);
