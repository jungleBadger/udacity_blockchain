(function () {
	"use strict";

	const blockchain = require("./server/helpers/blockchain")();

	blockchain.init().then((chain) => {
		console.log(chain);
		console.log("Chain logged above");
		setInterval(() => {
			blockchain.addBlock({
				"body": Date.now()
			}).then(() => {

				blockchain.validateChain();
			}).catch(err => err);
		}, 1000 * (60 * 5));

	}).catch((err) => {
		console.log(err);
	});


}());