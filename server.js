const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// keep the event loop alive
io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("player_move", (data) => {
		// Send the move to everyone
		socket.broadcast.emit("player_move", data);
	});

	socket.on("mouse_moved", (data) => {
		// Send the to everyone
		socket.broadcast.emit("mouse_moved", data);
	});

	socket.on("bullet_shot", (data) => {
		socket.broadcast.emit("bullet_shot", data);
	});

	socket.on("equip_item", (data) => {
		socket.broadcast.emit("equip_item", data);
	});

	socket.on("damage_dealt", () => {
		socket.broadcast.emit("damage_dealt", data);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected:", socket.id);
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
