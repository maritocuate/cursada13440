window.onload = () => {
  const socket = io()
  
  socket.on('productos-todos', data => {
    //socket.emit('notificacion', 'mensaje recibido')
  })

  socket.on('recibir nuevoProducto', function(listaProductos) {
    addNewMessage(listaProductos)
  })

  const btnGuardar = document.querySelector('#save-btn')
  const inputTitle = document.querySelector('#title-input')
  const inputPrice = document.querySelector('#price-input')
  const inputThumb = document.querySelector('#thumbnail-input')

  btnGuardar.onclick = () => socket.emit('notificacion', {title:inputTitle.value, price:inputPrice.value, thumb:inputThumb.value})
}

function addNewMessage(productos) {
  console.log(productos)
  const container = document.querySelector('.table')
  const tr = document.createElement('tr')
  tr.innerHTML = `
  <td>${productos[0].title}</td>
  <td>$${productos[0].price}</td>
  <td><img width="50" src="${productos[0].thumb}"></td>`
  container.append(tr)
}