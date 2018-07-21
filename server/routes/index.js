(function () {
	"use strict";


	module.exports = function (app, blockchain) {
		require("./partials/blockHandler")(app, blockchain);
	}

}());