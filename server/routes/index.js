(function () {
	"use strict";


	module.exports = function (app, blockchain, wallet) {
		require("./partials/blockHandler")(app, blockchain);
		require("./partials/walletHandler")(app, wallet);
	}

}());