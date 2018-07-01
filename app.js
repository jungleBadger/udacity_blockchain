(function () {
	"use strict";

	const blockchain = require("./server/helpers/blockchain")();

	blockchain.init().then((chain) => {
		console.log(chain);
		console.log("Chain logged above");
	}).catch((err) => {
		console.log(err);
	});


}());