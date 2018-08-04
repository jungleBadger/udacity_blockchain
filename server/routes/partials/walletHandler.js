(function () {
	"use strict";


	module.exports = function (app, wallet) {

		app.post("/wallet", function (req, res) {
			wallet.createWallet({
				"username": req.body.username,
				"password": req.body.password
			}).then(result => {
				return res.status(201).send(result);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

		app.get("/wallet", function (req, res) {
			wallet.getWalletOwner(req.query.address).then(result => {
				return res.status(201).send(result);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

	}

}());