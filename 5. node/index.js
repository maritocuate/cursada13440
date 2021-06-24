const http = require('http')

const server = http.createServer((peticion, respuesta) => {
  let objResultado = {}
  const randomNumber = max =>  (Math.random() * max) + 1
  
  objResultado.id = randomNumber(10).toFixed(0)
  objResultado.titulo = "Producto " + randomNumber(10).toFixed(0)
  objResultado.price = randomNumber(9999.99).toFixed(2)
  objResultado.thumbnail = "Foto " + randomNumber(10).toFixed(0)

  respuesta.end( JSON.stringify(objResultado) )
  
})

const puerto = process.env.PORT || 3000

server.listen(puerto, () => {
     console.log('servidor en puerto: ' + puerto)
})