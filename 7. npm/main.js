import express from 'express'
import fs from 'fs'

const app = express()
const port = 8000
let visitasItems = 0
let visitasRandom = 0

app.get('/items', (req, res) => {
     visitasItems++
     fs.promises.readFile('./productos.txt', 'utf-8')
          .then(data => {
               const parseData = JSON.parse(data)
               const objResult = {
                    items: parseData,
                    cantidad: parseData.length
               }
               res.json( objResult )
          })
})

app.get('/item-random', (req, res) => {
     visitasRandom++
     fs.promises.readFile('./productos.txt', 'utf-8')
          .then(data => {
               const parseData = JSON.parse(data)
               const randomNum = Math.floor( Math.random()*parseData.length )
               const randomProduct = parseData[randomNum]
               res.json( {item: randomProduct} )
          })
})

app.get('/visitas', (req, res) => {
     res.json( {visitas: {items:visitasItems, item:visitasRandom}} )
})

app.listen(port, () => console.log('Server OK. Puerto:'+port) )
app.listen(port).on('error', (err) => console.log(err))