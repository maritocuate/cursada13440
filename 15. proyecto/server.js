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
var routerProductos = express.Router();
var routerCarrito = express.Router();
var port = process.env.PORT || 8080;
var admin = true;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
//  1a. Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
routerProductos.get('/listar', function (req, res) {
    fs.promises.readFile('./productos.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        if (raw.length == 0)
            raw = { error: 'No hay productos cargados' };
        res.send(raw);
    });
});
routerProductos.get('/listar/:id', function (req, res) {
    fs.promises.readFile('./productos.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var item = raw.filter(function (prod) { return prod.id == req.params.id; });
        if (item.length == 0)
            item = { error: 'Producto no encontrado' };
        res.send(item);
    });
});
//  1b. Para incorporar productos al listado (disponible para administradores)
routerProductos.post('/agregar', function (req, res) {
    if (!admin) {
        res.send({ error: 1, descripcion: "Método Agregar no autorizado" });
        return;
    }
    fs.promises.readFile('./productos.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var productoNuevo = {
            id: (raw.length == 0) ? 0 : raw.slice(-1)[0].id + 1,
            timestamp: moment(),
            nombre: req.query.nombre,
            descripcion: req.query.descripcion,
            codigo: req.query.codigo,
            foto: req.query.foto,
            precio: req.query.precio,
            stock: req.query.stock
        };
        var temp = __spreadArray(__spreadArray([], raw), [productoNuevo]);
        fs.promises.writeFile('./productos.json', JSON.stringify(temp, null, '\t'));
        res.send(productoNuevo);
    });
});
// 1c. Actualiza un producto por su id (disponible para administradores)
routerProductos.put('/actualizar/:id', function (req, res) {
    if (!admin) {
        res.send({ error: 2, descripcion: "Método Actualizar no autorizado" });
        return;
    }
    fs.promises.readFile('./productos.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var productoNuevo = {};
        for (var i in raw) {
            if (raw[i].id == req.params.id) {
                raw[i].timestamp = moment(),
                    raw[i].nombre = req.query.nombre,
                    raw[i].descripcion = req.query.descripcion,
                    raw[i].codigo = req.query.codigo,
                    raw[i].foto = req.query.foto,
                    raw[i].precio = req.query.precio,
                    raw[i].stock = req.query.stock;
                productoNuevo = raw[i];
            }
        }
        fs.promises.writeFile('./productos.json', JSON.stringify(raw, null, '\t'));
        res.send(productoNuevo);
    });
});
//  1d. Borra un producto por su id (disponible para administradores)
routerProductos["delete"]('/borrar/:id', function (req, res) {
    if (!admin) {
        res.send({ error: 3, descripcion: "Método Borrar no autorizado" });
        return;
    }
    fs.promises.readFile('./productos.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var deleted = raw.filter(function (item) { return item.id == req.params.id; });
        var filtered = raw.filter(function (item) { return item.id != req.params.id; });
        fs.promises.writeFile('./productos.json', JSON.stringify(filtered, null, '\t'));
        res.send(deleted);
    });
});
//  2a. Me permite listar todos los productos guardados en el carrito ó un producto por su id de carrito (disponible para usuarios y administradores)
routerCarrito.get('/listar', function (req, res) {
    fs.promises.readFile('./carrito.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        if (raw.length == 0)
            raw = { error: 'No hay productos cargados' };
        res.send(raw);
    });
});
routerCarrito.get('/listar/:id', function (req, res) {
    fs.promises.readFile('./carrito.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var item = raw.filter(function (prod) { return prod.id == req.params.id; });
        if (item.length == 0)
            item = { error: 'Producto no encontrado' };
        res.send(item);
    });
});
//  2b. Para incorporar productos al carrito por su id de producto (disponible para usuarios y administradores)
routerCarrito.post('/agregar', function (req, res) {
    fs.promises.readFile('./carrito.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var productoNuevo = {
            id: (raw.length == 0) ? 0 : raw.slice(-1)[0].id + 1,
            timestamp: moment(),
            producto: req.query.producto
        };
        var temp = __spreadArray(__spreadArray([], raw), [productoNuevo]);
        fs.promises.writeFile('./carrito.json', JSON.stringify(temp, null, '\t'));
        res.send(productoNuevo);
    });
});
//  2c. Eliminar un producto del carrito por su id de carrito (disponible para usuarios y administradores)
routerCarrito["delete"]('/borrar/:id', function (req, res) {
    fs.promises.readFile('./carrito.json', 'utf-8')
        .then(function (data) {
        var raw = JSON.parse(data);
        var deleted = raw.filter(function (item) { return item.id == req.params.id; });
        var filtered = raw.filter(function (item) { return item.id != req.params.id; });
        fs.promises.writeFile('./carrito.json', JSON.stringify(filtered, null, '\t'));
        res.send(deleted);
    });
});
app.use('/productos', routerProductos);
app.use('/carrito', routerCarrito);
http.listen(port, function () { return console.log('listen port: ' + port); });
