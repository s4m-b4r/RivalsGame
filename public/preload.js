function preload() {
	// Load any assets here if needed
	console.log("test");
	assaultRifleImage = loadImage("assets/Guns/AK47.png");
	tileset = loadImage("assets/environment/tileset.png");
	rifleAmmo = loadImage("assets/Bullets/RifleAmmoSmall.png");
	rifleShot = loadSound("assets/Sounds/762x54r Single Isolated MP3.mp3");
	rifleReload = loadSound("assets/Sounds/ak-47-reload-sound-effect.wav");
}
