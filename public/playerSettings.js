class Keybinds {
	constructor() {
		this.up = 87; //the keycodes for each keybind
		this.down = 83;
		this.right = 68;
		this.left = 65;
		this.roll = 32;
		this.sprint = 16;
		this.reload = 82;
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
	constructor(masL, musL, sfxL, Csize, Ccolor, Ocolor, Oct) {
		//audio
		this.masterLevel = masL;
		this.musicLevel = musL;
		this.sfxLevel = sfxL;

		//crosshair
		this.cSize = Csize;
		this.cColor = Ccolor;

		//opponent
		this.oColor = Ocolor;
		this.oColorToggle = Oct;
	}
}

let settings = new Settings(0.5, 1, 1, 1, "#f5c536", "#ffffff00", false);
