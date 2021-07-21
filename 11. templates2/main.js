const fs = require('fs')
const path = require('path')
const express = require('express')
const bodyParser = require('body-parser')

const app = express()
const router = express.Router()
const port = 8070

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))

// settings
app.set("views", "./views")
app.set("view engine", "pug")

app.get('/productos/vista', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      if(raw.length == 0) raw = {error: 'No hay productos cargados'}
      var productos = raw
      res.render('main', {productos, hayProductos:true})
    })

})

router.get('/productos/listar', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      if(raw.length == 0) raw = {error: 'No hay productos cargados'}
      res.send(raw)
    })
})

router.get('/productos/listar/:id', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      const raw = JSON.parse(data)
      let item = raw.filter(prod => prod.id == req.params.id)
      if(item.length == 0) item = {error: 'Producto no encontrado'}
      res.send(item)
    })
})

router.put('/productos/actualizar/:id', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let productoNuevo = {}
      for (var i in raw) {
        if(raw[i].id == req.params.id) {
          raw[i].title = req.query.title
          raw[i].price = req.query.price
          raw[i].thumbnail = req.query.thumbnail
          productoNuevo = raw[i]
        }
      }

      fs.promises.writeFile('./productos.txt', JSON.stringify(raw, null, '\t')) 
      res.send(productoNuevo) 
    })
}) 

router.post('/productos/guardar', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let productoNuevo = {}
      productoNuevo.title = req.body.title
      productoNuevo.price = req.body.price
      productoNuevo.thumbnail = req.body.thumbnail
      productoNuevo.id = raw.slice(-1)[0].id + 1
      
      let temp = [...raw, productoNuevo]
      fs.promises.writeFile('./productos.txt', JSON.stringify(temp, null, '\t')) 
      res.send(productoNuevo)
    })
})

router.delete('/productos/borrar/:id', (req, res) => {
  fs.promises.readFile('./productos.txt', 'utf-8')
    .then(data => {
      let raw = JSON.parse(data)
      
      let deleted = raw.filter(item => item.id==req.params.id)
      let filtered = raw.filter(item => item.id!=req.params.id)

      fs.promises.writeFile('./productos.txt', JSON.stringify(filtered, null, '\t')) 
      res.send(deleted) 
    })
}) 

app.use('/api', router)

//Static Files
app.use(express.static(path.join(__dirname,'public')))

app.listen(port, () => console.log('listen port: '+port))