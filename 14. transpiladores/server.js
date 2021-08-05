var __spreadArray = (this && this.__spreadArray) || function (to, from) {
    for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
        to[j] = from[i];
    return to;
};
var fs = require('fs');
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var moment = require('moment');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var router = express.Router();
var port = process.env.PORT || 8070;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
// settings
app.set("views", "./views");
app.set("view engine", "ejs");
//Static Files
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', function (req, res) {
    fs.promises.readFile('./productos.txt', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        if (raw.length == 0)
            raw = { error: 'No hay productos cargados' };
        var productos = raw;
        res.render('main', { productos: productos, hayProductos: true });
    });
});
app.get('/productos/agregar', function (req, res) {
    res.render('add');
});
router.get('/productos/listar', function (req, res) {
    fs.promises.readFile('./productos.txt', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        if (raw.length == 0)
            raw = { error: 'No hay productos cargados' };
        res.send(raw);
    });
});
router.get('/productos/listar/:id', function (req, res) {
    fs.promises.readFile('./productos.txt', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var item = raw.filter(function (prod) { return prod.id == req.params.id; });
        if (item.length == 0)
            item = { error: 'Producto no encontrado' };
        res.send(item);
    });
});
router.put('/productos/actualizar/:id', function (req, res) {
    fs.promises.readFile('./productos.txt', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var productoNuevo = {};
        for (var i in raw) {
            if (raw[i].id == req.params.id) {
                raw[i].title = req.query.title;
                raw[i].price = req.query.price;
                raw[i].thumbnail = req.query.thumbnail;
                productoNuevo = raw[i];
            }
        }
        fs.promises.writeFile('./productos.txt', JSON.stringify(raw, null, '\t'));
        res.send(productoNuevo);
    });
});
router.post('/productos/guardar', function (req, res) {
    fs.promises.readFile('./productos.txt', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var productoNuevo = {
            title: req.body.title,
            price: req.body.price,
            thumbnail: req.body.thumbnail,
            id: raw.slice(-1)[0].id + 1
        };
        var temp = __spreadArray(__spreadArray([], raw), [productoNuevo]);
        fs.promises.writeFile('./productos.txt', JSON.stringify(temp, null, '\t'));
        res.redirect('/productos/vista');
    });
});
router["delete"]('/productos/borrar/:id', function (req, res) {
    fs.promises.readFile('./productos.txt', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var deleted = raw.filter(function (item) { return item.id == req.params.id; });
        var filtered = raw.filter(function (item) { return item.id != req.params.id; });
        fs.promises.writeFile('./productos.txt', JSON.stringify(filtered, null, '\t'));
        res.send(deleted);
    });
});
app.use('/api', router);
http.listen(port, function () { return console.log('listen port: ' + port); });
//  Socket Io
var productos = [];
var mensajes = [];
io.on('connection', function (socket) {
    console.log('usuario conectado');
    socket.emit("productos-todos", { productos: productos });
    socket.on('notificacion', function (data) {
        fs.promises.readFile('./productos.txt', 'utf-8')
            .then(function (oldData) {
            var raw = JSON.parse(oldData);
            var productoNuevo = {
                title: data.title,
                price: data.price,
                thumbnail: data.thumb,
                id: raw.slice(-1)[0].id + 1
            };
            var temp = __spreadArray(__spreadArray([], raw), [productoNuevo]);
            fs.promises.writeFile('./productos.txt', JSON.stringify(temp, null, '\t'));
        });
        io.sockets.emit('recibir nuevoProducto', [data]);
    });
    socket.on('chat', function (data) {
        data.hora = moment().utcOffset(-3).format('DD/MM/YYYY hh:mm:ss');
        mensajes.push(data);
        io.sockets.emit('recibir nuevoMensaje', [data]);
    });
});
