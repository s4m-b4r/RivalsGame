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
	}
	changeKeybind(keycode) {
		//change the keybind to the new keycode
	}
}

let keybind = new Keybinds();
