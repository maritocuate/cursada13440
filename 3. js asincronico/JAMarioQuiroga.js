const mostrarPalabras = (texto, tiempo=0, palabrasActuales, callback) => {
    const palabras = texto.split(' ')
    let indice = 0

    let interval = setInterval(() => {
        console.log(palabras[indice])
        indice++
    }, tiempo)

    setTimeout(() => {
        clearInterval(interval)
        callback(false, palabrasActuales + palabras.length)
    }, tiempo * (palabras.length+1))
}

let texto1 = 'primer texto'
let texto2 = 'curso backend de coderhouse'
let texto3 = 'probando llamadas asincronas en nodejs'
const tiempo = 500

mostrarPalabras(texto1, tiempo, 0, (error, totalPalabras) => {
     mostrarPalabras(texto2, tiempo, totalPalabras, (error, totalPalabras) => {
        mostrarPalabras(texto3, tiempo, totalPalabras, (error, totalPalabras) => {
            console.log('Proceso terminado, cantidad de palabras:', totalPalabras)
        })
    })
})