const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingPlayer = null;
let gameIdCounter = 1;

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// keep the event loop alive
io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("join_queue", () => {
		if (waitingPlayer) {
			const room = "game-" + gameIdCounter;
			socket.join(room);
			waitingPlayer.join(room);

			io.to(room).emit("game_start", { room, players: [waitingPlayer.id, socket.id] });

			waitingPlayer = null;
			gameIdCounter++;
		} else {
			waitingPlayer = socket;
		}
	});

	socket.on("player_move", (data) => {
		// Send the move to everyone
		socket.to(data.room).emit("player_move", data);
	});

	socket.on("mouse_moved", (data) => {
		// Send the to everyone
		socket.to(data.room).emit("mouse_moved", data);
	});

	socket.on("bullet_shot", (data) => {
		socket.to(data.room).emit("bullet_shot", data);
	});

	socket.on("equip_item", (data) => {
		socket.to(data.room).emit("equip_item", data);
	});

	socket.on("damage_dealt", (data) => {
		socket.to(data.room).emit("damage_dealt", data);
	});

	socket.on("disconnect", () => {
		console.log("A user disconnected:", socket.id);
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
