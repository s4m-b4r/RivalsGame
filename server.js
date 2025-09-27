const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server);

// Serve your static files
app.use(express.static(__dirname + "/public"));

// Optional but good: route to index.html
app.get("/", (req, res) => {
	res.sendFile(__dirname + "/public/index.html");
});

// Keep Socket.IO alive
io.on("connection", (socket) => {
	console.log(`🔥 A user connected: ${socket.id}`);

	socket.on("disconnect", () => {
		console.log(`❌ User disconnected: ${socket.id}`);
	});
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
