class Keybinds {
	constructor() {
		this.up = 87; //the keycodes for each keybind
		this.down = 83;
		this.right = 68;
		this.left = 65;
		this.roll = 32;
		this.sprint = 16;
		this.interact = 70;
		this.reload = 82;
		this.useItem = 81;
		this.pause = 27;
		this.slot1 = 49;
		this.slot2 = 50;
		this.slot3 = 51;
	}
	changeKeybind(keycode) {
		//change the keybind to the new keycode
	}
}

let keybind = new Keybinds();

class Settings {
	constructor(masL, musL, sfxL, masM, musM, sfxM, Csize, Ccolor, Copacity, Cshape, Ocolor, Oct) {
		//audio
		this.masterLevel = masL;
		this.musicLevel = musL;
		this.sfxLevel = sfxL;

		this.masterMute = masM;
		this.musicMute = musM;
		this.sfxMute = sfxM;

		//crosshair
		this.cSize = Csize;
		this.cColor = Ccolor;
		this.cOpacity = Copacity;
		this.cShape = Cshape;

		//opponent
		this.oColor = Ocolor;
		this.oColorToggle = Oct;
	}
}

let settings = new Settings(0.5, 1, 1, false, false, false, 1, "#f5c536", 90, "Circle", "#ffffff00", false);
