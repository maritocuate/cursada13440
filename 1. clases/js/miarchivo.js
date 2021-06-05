class Producto {

     constructor(nombre, precio) {
         this.nombre  = nombre.toUpperCase()
         this.precio  = parseFloat(precio)
         this.vendido = false
     }

     set nombre(val) {
       this._nombre = val
     }
     get nombre() {
       return 'Nombre: ' + this._nombre
     }
  
     set precio(val) {
       this._precio = val
     }
     get precio() {
       return 'Precio: $' + this._precio
     }
  
     set vendido(valor){
          valor == "VENDER" ? 
              this._vendido = true
          :
              this._vendido = false
     }
     get vendido(){
          return this._vendido ? "VENDIDO" : "DISPONIBLE"
     }
  
    static calculaDescuento(precio, porcentaje){
          return porcentaje * precio / 100
    }
    get descuento() {
          return 'Descuento 10%: $' + Producto.calculaDescuento(this._precio, 10)
    } 
}


class Auto extends Producto {
  
     constructor(nombre, precio, puertas){
          super(nombre, precio)
          this.puertas = puertas
     }
    
}

class Moto extends Producto {
  
     constructor(nombre, precio){
          super(nombre, precio)
     }
    
} 

const fiat = new Auto("Cronos", 5000, 2)
console.log( fiat )
console.log( fiat.descuento )