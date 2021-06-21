async function operacion(a: number, b: number, operacion: string) {
     
     if(operacion=="suma") {
          const { Suma } = await import('./Suma.js')
          const nuevaOperacion = new Suma(a, b)
          const promesa = Promise.resolve( nuevaOperacion.resultado() )
          return promesa.then(x=>x)

     }else if(operacion=="resta") {
          const { Resta } = await import('./Resta.js')
          const nuevaOperacion = new Resta(a, b)
          const promesa = Promise.resolve( nuevaOperacion.resultado() )
          return promesa.then(x=>x)
     }
}


async function operaciones() {
     console.log(await operacion(16, 6, 'suma'))
     console.log(await operacion(16, 6, 'resta')) 
}
 
operaciones()