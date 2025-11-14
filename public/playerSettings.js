class Keybinds {
	constructor(up, down, right, left, roll, sprint, reload, pause, slot1, slot2, slot3) {
		this.up = up; //the keycodes for each keybind
		this.down = down;
		this.right = right;
		this.left = left;
		this.roll = roll;
		this.sprint = sprint;
		this.reload = reload;
		this.pause = pause;
		this.slot1 = slot1;
		this.slot2 = slot2;
		this.slot3 = slot3;
	}
	changeKeybind(keycode) {
		//change the keybind to the new keycode
	}
}

let keybind = new Keybinds(87, 83, 68, 65, 32, 16, 82, 27, 49, 50, 51);

class Settings {
	constructor(masL, musL, sfxL, Ccolor, Ocolor, Pcolor) {
		//audio
		this.masterLevel = masL;
		this.musicLevel = musL;
		this.sfxLevel = sfxL;

		//crosshair
		this.cColor = Ccolor;

		//opponent
		this.oColor = Ocolor;

		//player
		this.pColor = Pcolor;
	}
}

let settings = new Settings(0.5, 1, 1, "#f5c536", "#701f1f", "#81e4f7");
