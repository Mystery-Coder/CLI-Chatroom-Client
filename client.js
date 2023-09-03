#!/usr/bin/env node
import { io } from "socket.io-client";

const socket = io("https://towering-glistening-radio.glitch.me/");
let NAME;
import readline from "readline";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function displayMessages(messages) {
	console.clear(); //Clears console
	for (let i = 0; i < messages.length; i++) {
		console.log(messages[i]);
	}
}
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

console.log("Enter message EXITOUT to exit chatroom");
rl.question("What is your name ? ", function (name) {
	let messages = [];
	NAME = name;
	socket.emit("user-join", name);

	rl.question("Enter message: ", function (msg) {
		if (msg === "EXITOUT") {
			rl.close();
		}
		socket.emit("message", `${name}: ` + msg);
	});
	socket.on("new-message", (msg) => {
		messages.push(msg);
		displayMessages(messages);

		rl.question("Enter message: ", function (msg) {
			if (msg === "EXITOUT") {
				rl.close();
			}
			socket.emit("message", `${name}: ` + msg);
		});
	});
});

rl.on("close", function () {
	socket.emit("user-exit", NAME);
	console.log("EXITING");
});
