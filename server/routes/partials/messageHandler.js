(function () {
	"use strict";

	module.exports = function (app, message, validateWalletPassword) {

		app.post("/requestValidation", function (req, res) {
			message.registerMessage(
				req.body.address,
				"starRegistry"
			).then(result => {
				return res.status(201).send(result);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

		app.post("/signMessage", validateWalletPassword, function (req, res) {
			return res.status(200).send(message.signMessage(
				req.body.walletUser,
				req.body.message
			));
		});

		app.post("/message-signature/validate", function (req, res) {
			message.validateSignature(
				req.body.message,
				req.body.address,
				req.body.signature
			).then(result => {
				return res.status(200).send(result);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message ? JSON.parse(err.message) : err);
			});
		});
	}

}());