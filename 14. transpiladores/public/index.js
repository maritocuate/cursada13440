window.onload = () => {
  const socket = io()
  
  socket.on('productos-todos', data => {
    //socket.emit('notificacion', 'mensaje recibido')
  })

  socket.on('recibir nuevoProducto', function(listaProductos) {
    addNewProduct(listaProductos)
  })
  
  socket.on('recibir nuevoMensaje', function(listaMensajes) {
    addNewMessage(listaMensajes)
  })

  //  Agregar Nuevo Producto
  const btnGuardar = document.querySelector('#save-btn')
  const inputTitle = document.querySelector('#title-input')
  const inputPrice = document.querySelector('#price-input')
  const inputThumb = document.querySelector('#thumbnail-input')

  btnGuardar.onclick = () => {
    socket.emit('notificacion', {title:inputTitle.value, price:inputPrice.value, thumb:inputThumb.value})
  } 
  
  //  Agregar Nuevo Mensaje
  const emailInput = document.querySelector('#email-input')
  const mensajeInput = document.querySelector('#mensaje-input')
  const enviarBtn = document.querySelector('#enviar-btn')
  
  enviarBtn.onclick = () => {
    socket.emit('chat', {email:emailInput.value, mensaje:mensajeInput.value})
  } 
}

function addNewProduct(productos) {
  const container = document.querySelector('.table')
  const tr = document.createElement('tr')
  tr.innerHTML = `
  <td>${productos[0].title}</td>
  <td>$${productos[0].price}</td>
  <td><img width="50" src="${productos[0].thumb}"></td>`
  container.append(tr)
}

function addNewMessage(mensaje) {
  console.log(mensaje)
  const container = document.querySelector('#mensajes-container')
  const p = document.createElement('p')
  p.innerHTML = `
  <span class="user-text">${mensaje[0].email}</span>
  <span class="time-text">[${mensaje[0].hora}] :</span>
  <span class="msg-text">${mensaje[0].mensaje}</span>`
  container.append(p)
}