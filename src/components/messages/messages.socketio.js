export default (function (io) {
	io.on('connection', (socket) => {
		console.log('a user connected:', socket.id)
		socket.on('new_message', (msg) => {
			socket.to(msg.to).emit('new_message', msg.data)
			//socket.broadcast.emit("new_message", { data: { message: msg.data } });
		})
		io.sockets.emit('hi', 'everyone')
		io.emit('hi', 'everyone')

		socket.on('hi', (msg) => {
			console.log('hi event received:', msg)
			socket.to(msg.to).emit('hi', msg.data)
			socket.emit('hi', { data: { message: msg.data } })
		})
	})
})
