module.exports = function (io) {
	io.on('connection', (socket) => {
		socket.on('new_message', (msg) => {
			socket.to(msg.to).emit('new_message', msg.data)
			//socket.broadcast.emit("new_message", { data: { message: msg.data } });
		})
	})
}
