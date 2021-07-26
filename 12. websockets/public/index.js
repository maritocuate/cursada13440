const socket = io()

socket.on('mi mje', data => {
  console.log(data)
  socket.emit('notificacion', 'mensaje recibido')
})