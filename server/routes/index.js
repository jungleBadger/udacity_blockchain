(function () {
	"use strict";


	module.exports = function (app, blockchain, wallet, message) {

		let validateWalletPassword = (req, res, next) => {
			wallet.validateWalletPassword(
				req.body.address,
				req.body.password
			).then(wallet => {
				req.body.walletUser = wallet.owner;
				return next();
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		};

		let validateSignature = (req, res, next) => {
			message.validateSignature(
				req.body.message,
				req.body.address,
				req.body.signature
			).then(
				data => next()
			).catch(err => {
				return res.status(err.status || 500).send(err.message ? JSON.parse(err.message) : err);
			});
		};


		require("./partials/blockHandler")(app, blockchain, validateSignature);
		require("./partials/walletHandler")(app, wallet);
		require("./partials/messageHandler")(app, message, validateWalletPassword);
		require("./partials/starHandler")(app, blockchain, validateSignature);
	}

}());