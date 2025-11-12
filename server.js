require("dotenv").config();
const { Pool } = require("pg");
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const pool = new Pool({
	connectionString: process.env.DATABASE_URL,
	ssl: {
		rejectUnauthorized: false,
	},
});

pool
	.connect()
	.then(() => console.log("Connected to the database"))
	.catch((err) => console.error("Database connection error:", err));

const app = express();
const server = http.createServer(app);
const io = new Server(server);

let waitingPlayer = null;
let gameIdCounter = 1;
const games = [];

app.use(express.static(__dirname + "/public"));

app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

app.use(express.json());

// Signup route
app.post("/signup", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) return res.status(400).json({ error: "Username and password required" });

	if (password.length < 12) return res.status(400).json({ error: "Password must be at least 12 characters long" });

	try {
		const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
		if (result.rows.length > 0) {
			return res.status(400).json({ error: "Username already exists" });
		}

		await pool.query("INSERT INTO users (username, password) VALUES ($1, $2)", [username, password]);
		res.json({ success: true, message: "Account created successfully!" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Database error" });
	}
});

// Login route
app.post("/login", async (req, res) => {
	const { username, password } = req.body;

	if (!username || !password) return res.status(400).json({ error: "Username and password required" });

	try {
		const result = await pool.query("SELECT * FROM users WHERE username = $1", [username]);
		if (result.rows.length === 0) return res.status(400).json({ error: "Invalid username" });

		const user = result.rows[0];
		if (user.password !== password) return res.status(400).json({ error: "Invalid password" });

		res.json({ success: true, message: "Login successful!" });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Database error" });
	}
});

app.post("/save_settings", async (req, res) => {
	const { username, keybinds, settings } = req.body;

	try {
		const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
		if (userResult.rows.length === 0) return res.status(400).json({ error: "User not found" });
		const userId = userResult.rows[0].id;

		const existing = await pool.query("SELECT * FROM player_settings WHERE user_id = $1", [userId]);
		if (existing.rows.length > 0) {
			await pool.query("UPDATE player_settings SET keybinds = $1, settings = $2 WHERE user_id = $3", [keybinds, settings, userId]);
		} else {
			await pool.query("INSERT INTO player_settings (user_id, keybinds, settings) VALUES ($1, $2, $3)", [userId, keybinds, settings]);
		}

		res.json({ success: true });
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Database error" });
	}
});

app.post("/load_settings", async (req, res) => {
	const { username } = req.body;

	try {
		const userResult = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
		if (userResult.rows.length === 0) return res.status(400).json({ error: "User not found" });
		const userId = userResult.rows[0].id;

		const settingsResult = await pool.query("SELECT keybinds, settings FROM player_settings WHERE user_id = $1", [userId]);
		if (settingsResult.rows.length === 0) return res.json({ keybinds: null, settings: null });

		res.json(settingsResult.rows[0]);
	} catch (err) {
		console.error(err);
		res.status(500).json({ error: "Database error" });
	}
});

// keep the event loop alive
io.on("connection", (socket) => {
	console.log("A user connected:", socket.id);

	socket.on("register_username", (data) => {
		socket.username = data.username;
		console.log(`User ${data.username} registered on socket ${socket.id}`);
	});
	socket.on("join_queue", () => {
		console.log("Join queue:", socket.id);
		if (waitingPlayer) {
			if (waitingPlayer.id != socket.id) {
				const room = "game-" + gameIdCounter;
				socket.join(room);
				waitingPlayer.join(room);
				const player2Pos = { x: 150, y: 475 };
				const player1Pos = { x: 1600, y: 475 };
				matchArena = Math.floor(Math.random() * 4); // 0 to 4
				roundEndTime = Date.now() + 154000;
				roundStartTime = Date.now();
				io.to(waitingPlayer.id).emit("game_start", {
					room,
					playerId: waitingPlayer.id,
					opponentId: socket.id,
					startPos: player1Pos,
					opStartPos: player2Pos,
					arena: matchArena,
					roundEndTime: roundEndTime,
					roundStartTime: roundStartTime,
				});

				io.to(socket.id).emit("game_start", {
					room,
					playerId: socket.id,
					opponentId: waitingPlayer.id,
					startPos: player2Pos,
					opStartPos: player1Pos,
					arena: matchArena,
					roundEndTime: roundEndTime,
					roundStartTime: roundStartTime,
				});

				games.push({
					gameID: room,
					players: { p1: socket.id, p2: waitingPlayer.id },
					scores: { p1: 0, p2: 0 },
					round: 1,
					inProgress: true,
					winner: null,
				});

				waitingPlayer = null;
				gameIdCounter++;
				console.log("Game Started:", room, "Arena:", matchArena);
			}
		} else {
			waitingPlayer = socket;
		}
	});

	socket.on("player_killed_opponent", (data) => {
		const game = games.find((g) => g.gameID === data.room);
		if (!game || !game.inProgress) return;

		const { p1, p2 } = game.players;
		const killer = socket.id;
		const victim = killer === p1 ? p2 : p1;

		// Prevent double reporting
		if (game.roundWinner) return;

		game.roundWinner = killer;
		game.inProgress = false;

		if (killer === p1) {
			game.scores.p1++;
		} else {
			game.scores.p2++;
		}

		// Notify both clients
		io.to(data.room).emit("round_end", {
			winner: killer,
			scores: game.scores,
			round: game.round,
		});

		if (game.scores.p1 >= 3 || game.scores.p2 >= 3) {
			const matchWinner = game.scores.p1 > game.scores.p2 ? p1 : p2;
			io.to(data.room).emit("match_over", { winner: matchWinner, scores: game.scores });
			games.splice(games.indexOf(game), 1);
			return;
		}

		// Start next round after a short delay
		setTimeout(() => {
			game.round++;
			game.inProgress = true;
			game.roundWinner = null;

			const newArena = Math.floor(Math.random() * 4); // 0 to 4
			const roundEndTime = Date.now() + 154000;
			const roundStartTime = Date.now();

			if (game.round % 2 == 1) {
				player1Pos = { x: 150, y: 475 };
				player2Pos = { x: 1600, y: 475 };
				console.log("odd");
			} else {
				player2Pos = { x: 150, y: 475 };
				player1Pos = { x: 1600, y: 475 };
				console.log("even");
			}

			io.to(game.players.p1).emit("new_round", {
				round: game.round,
				a: newArena,
				startPos: player1Pos,
				opStartPos: player2Pos,
				roundEndTime: roundEndTime,
				roundStartTime: roundStartTime,
			});

			io.to(game.players.p2).emit("new_round", {
				round: game.round,
				a: newArena,
				startPos: player2Pos,
				opStartPos: player1Pos,
				roundEndTime,
				roundStartTime,
			});

			console.log(`Game ${game.gameID} - Round ${game.round} started`);
		}, 5000);
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
