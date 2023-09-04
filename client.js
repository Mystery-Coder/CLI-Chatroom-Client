#!/usr/bin/env node
import { io } from "socket.io-client";
import chalk from "chalk";
const socket = io("https://towering-glistening-radio.glitch.me/");
let NAME;
import readline from "readline";
const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

function displayMessages(messages, name) {
	console.clear(); //Clears console
	for (let i = 0; i < messages.length; i++) {
		let msgObj = messages[i];

		let msg = msgObj["msg"];
		let msg_name = msgObj["name"];
		if (msg_name === name) {
			//same user's msg
			console.log(chalk.green(msg));
		} else if (msg_name !== name) {
			console.log(chalk.yellow(msg));
		}
	}
}

console.log("Enter message EXITOUT to exit chatroom");
rl.question("What is your name ? ", function (name) {
	let messages = [];
	NAME = name;
	socket.emit("user-join", name);

	rl.question("Enter message: ", function (msg) {
		if (msg === "EXITOUT") {
			rl.close();
		}
		socket.emit("message", { msg: `${name}: ` + msg, name });
	});
	socket.on("new-message", (msg) => {
		messages.push(msg);
		displayMessages(messages, name);

		rl.question("Enter message: ", function (msg) {
			if (msg === "EXITOUT") {
				rl.close();
			}
			socket.emit("message", { msg: `${name}: ` + msg, name });
		});
	});
});

rl.on("close", function () {
	socket.emit("user-exit", NAME);
	console.log("EXITING");
});
