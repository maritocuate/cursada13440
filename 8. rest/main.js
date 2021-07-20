const fs = require('fs')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const port = 8001

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

app.get('/api/productos/listar', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      if(raw.length == 0) raw = {error: 'No hay productos cargados'}
      res.send(raw)
    })
})

app.get('/api/productos/listar/:id', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      const raw = JSON.parse(data)
      let item = raw.filter(prod => prod.id == req.params.id)
      if(item.length == 0) item = {error: 'Producto no encontrado'}
      res.send(item)
    })
})

app.post('/api/productos/guardar', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let productoNuevo = {}
      productoNuevo.title = req.body.titulo
      productoNuevo.price = req.body.precio
      productoNuevo.thumbnail = req.body.imagen
      productoNuevo.id = raw.slice(-1)[0].id + 1
      
      let temp = [...raw, productoNuevo]
      fs.promises.writeFile('./productos.txt', JSON.stringify(temp, null, '\t')) 
      res.send(productoNuevo)
    })
}) 

app.listen(port, () => console.log('listen port: '+port))