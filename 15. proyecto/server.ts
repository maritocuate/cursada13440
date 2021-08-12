const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')
const moment = require('moment')

const app = express()
const http = require('http').Server(app)
const routerProductos = express.Router()
const routerCarrito = express.Router()
const port = process.env.PORT || 8080
const admin:Boolean = true

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

//  1a. Me permite listar todos los productos disponibles ó un producto por su id (disponible para usuarios y administradores)
routerProductos.get('/listar', (req, res) => {
  fs.promises.readFile('./productos.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      if(raw.length == 0) raw = {error: 'No hay productos cargados'}
      res.send(raw)
    })
})
routerProductos.get('/listar/:id', (req, res) => {
  fs.promises.readFile('./productos.json', 'utf-8')
    .then(data => {
      const raw = JSON.parse(data)
      let item = raw.filter(prod => prod.id == req.params.id)
      if(item.length == 0) item = {error: 'Producto no encontrado'}
      res.send(item)
    })
})

//  1b. Para incorporar productos al listado (disponible para administradores)
routerProductos.post('/agregar', (req, res) => {
  if(!admin){
    res.send({ error : 1, descripcion: "Método Agregar no autorizado"})
    return
  } 

  fs.promises.readFile('./productos.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let productoNuevo = {
        id: (raw.length==0) ? 0 : raw.slice(-1)[0].id + 1,
        timestamp: moment(),
        nombre: req.query.nombre,
        descripcion: req.query.descripcion,
        codigo: req.query.codigo,
        foto: req.query.foto,
        precio: req.query.precio,
        stock: req.query.stock
      }
      
      let temp = [...raw, productoNuevo]
      fs.promises.writeFile('./productos.json', JSON.stringify(temp, null, '\t'))
      res.send(productoNuevo)
    })
})

// 1c. Actualiza un producto por su id (disponible para administradores)
routerProductos.put('/actualizar/:id', (req, res) => {
  if(!admin){
    res.send({ error : 2, descripcion: "Método Actualizar no autorizado"})
    return
  } 

  fs.promises.readFile('./productos.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let productoNuevo = {}
      for (var i in raw) {
        if(raw[i].id == req.params.id) {
          raw[i].timestamp = moment(),
          raw[i].nombre = req.query.nombre,
          raw[i].descripcion = req.query.descripcion,
          raw[i].codigo = req.query.codigo,
          raw[i].foto = req.query.foto,
          raw[i].precio = req.query.precio,
          raw[i].stock = req.query.stock
          productoNuevo = raw[i]
        }
      }

      fs.promises.writeFile('./productos.json', JSON.stringify(raw, null, '\t')) 
      res.send(productoNuevo) 
    })
}) 

//  1d. Borra un producto por su id (disponible para administradores)
routerProductos.delete('/borrar/:id', (req, res) => {
  if(!admin){
    res.send({ error : 3, descripcion: "Método Borrar no autorizado"})
    return
  } 

  fs.promises.readFile('./productos.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let deleted = raw.filter(item => item.id==req.params.id)
      let filtered = raw.filter(item => item.id!=req.params.id)

      fs.promises.writeFile('./productos.json', JSON.stringify(filtered, null, '\t')) 
      res.send(deleted) 
    })
}) 


//  2a. Me permite listar todos los productos guardados en el carrito ó un producto por su id de carrito (disponible para usuarios y administradores)
routerCarrito.get('/listar', (req, res) => {
  fs.promises.readFile('./carrito.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      if(raw.length == 0) raw = {error: 'No hay productos cargados'}
      res.send(raw)
    })
})
routerCarrito.get('/listar/:id', (req, res) => {
  fs.promises.readFile('./carrito.json', 'utf-8')
    .then(data => {
      const raw = JSON.parse(data)
      let item = raw.filter(prod => prod.id == req.params.id)
      if(item.length == 0) item = {error: 'Producto no encontrado'}
      res.send(item)
    })
})

//  2b. Para incorporar productos al carrito por su id de producto (disponible para usuarios y administradores)
routerCarrito.post('/agregar', (req, res) => {
  fs.promises.readFile('./carrito.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let productoNuevo = {
        id: (raw.length==0) ? 0 : raw.slice(-1)[0].id + 1,
        timestamp: moment(),
        producto: req.query.producto
      }
      
      let temp = [...raw, productoNuevo]
      fs.promises.writeFile('./carrito.json', JSON.stringify(temp, null, '\t'))
      res.send(productoNuevo)
    })
})

//  2c. Eliminar un producto del carrito por su id de carrito (disponible para usuarios y administradores)
routerCarrito.delete('/borrar/:id', (req, res) => {
  fs.promises.readFile('./carrito.json', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let deleted = raw.filter(item => item.id==req.params.id)
      let filtered = raw.filter(item => item.id!=req.params.id)

      fs.promises.writeFile('./carrito.json', JSON.stringify(filtered, null, '\t')) 
      res.send(deleted) 
    })
})


app.use('/productos', routerProductos)
app.use('/carrito', routerCarrito)

http.listen(port, () => console.log('listen port: '+port))