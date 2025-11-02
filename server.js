require("dotenv").config();
const { Pool } = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

Pool.connect()
	.then(() => console.log("Connected to the database"))
	.catch((err) => console.error("Database connection error:", err));

const express = require("express");
const http = require("http");
const { connect } = require("http2");
const { start } = require("repl");
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
		console.log("Join queue:", socket.id);
		if (waitingPlayer) {
			if (waitingPlayer.id != socket.id) {
				const room = "game-" + gameIdCounter;
				socket.join(room);
				waitingPlayer.join(room);
				player1Pos = { x: 150, y: 475 };
				player2Pos = { x: 1600, y: 475 };

				io.to(waitingPlayer.id).emit("game_start", {
					room,
					playerId: waitingPlayer.id,
					opponentId: socket.id,
					startPos: player1Pos,
					opStartPos: player2Pos,
				});

				io.to(socket.id).emit("game_start", {
					room,
					playerId: socket.id,
					opponentId: waitingPlayer.id,
					startPos: player2Pos,
					opStartPos: player1Pos,
				});

				waitingPlayer = null;
				gameIdCounter++;
				console.log("Game Started:", room);
			}
		} else {
			waitingPlayer = socket;
		}
	});

	socket.on("leave_queue", () => {
		console.log("Leave queue:", socket.id);
		if (waitingPlayer) {
			if (waitingPlayer.id == socket.id) {
				waitingPlayer = null;
			}
		}
	});

	socket.on("player_move", (data) => {
		socket.to(data.room).emit("player_move", data);
	});

	socket.on("mouse_moved", (data) => {
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
		if (waitingPlayer) {
			if (socket.id == waitingPlayer.id) {
				waitingPlayer = null;
			}
		}
	});
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
