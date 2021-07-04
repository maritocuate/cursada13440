const fs = require('fs')
const path = require('path')

class Archivo {

     constructor(url) {
          this._productos = __dirname+url
     }

     async leer() {
          try{
               const src = await fs.promises.readFile(this._productos, 'utf8')
               const data = JSON.parse(src)
               console.log(data) 
           }catch(e){
               console.log([])
          }
     }

     async guardar(nombre, precio, url) {
          try{
               const src = await fs.promises.readFile(this._productos, 'utf8')
               const data = JSON.parse(src)
               
               let productoNuevo = {}
               productoNuevo.title = nombre
               productoNuevo.price = precio
               productoNuevo.thumbnail = url
               productoNuevo.id = data.slice(-1)[0].id + 1

               let temp = [...data, productoNuevo]
               fs.promises.writeFile(this._productos, JSON.stringify(temp, null, '\t'))

          }catch(e){ console.log(e) }
     }

     async borrar() {    
          try {
               fs.unlinkSync(this._productos)
          }catch(e){ console.log(e) }
     }
}

const archivo = new Archivo('/productos.txt')
archivo.leer()
//archivo.guardar('Birome', 54, 'https://cdn3.iconfinder.com/data/icons/education-209/64/birome.png')
//archivo.leer()
//archivo.borrar()