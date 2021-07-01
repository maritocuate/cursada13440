const fs = require('fs')

class Archivo {

     leer() {
          const src = fs.promises.readFile('./productos.txt',{encoding:'utf8'})
          src.then(data => console.log( JSON.parse(data) ))
     }

     guardar(nombre, precio, url) {
          const src = fs.promises.readFile('./productos.txt',{encoding:'utf8'})
          src.then(data => {
               const parsedData = JSON.parse(data)

               let productoNuevo = {}
               productoNuevo.title = nombre
               productoNuevo.price = precio
               productoNuevo.thumbnail = url
               productoNuevo.id = parsedData.slice(-1)[0].id + 1

               let temp = [...parsedData, productoNuevo]
               fs.writeFileSync('./productos.txt', JSON.stringify(temp, null, '\t'))
          })
     }

     borrar() {
          fs.writeFileSync('./info.txt', '[]')
     }
}

const archivo = new Archivo()
archivo.leer()
//archivo.guardar('Birome', 54, 'https://cdn3.iconfinder.com/data/icons/education-209/64/birome.png')
//archivo.borrar()