(function () {
	"use strict";

	module.exports = function (app, blockchain, validateSignature) {

		app.post("/star", validateSignature, function (req, res) {
			blockchain.addBlock({
				"body": req.body.blockBody || req.body.body,
				"blockOwner": req.body.address
			}).then(result => {
				return res.status(201).send(result);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message ? JSON.parse(err.message) : err);
			});
		});

		app.get("/star/hash/:hash", function (req, res) {
			blockchain.getAllBlocks(
			).then((blockData) => {
				return res.status(200).send(blockData.filter(block => {
					return block.hash === req.params.hash
				}));
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

		app.get("/star/:blockHeight", function (req, res) {
			blockchain.getBlock(
				req.params.blockHeight
			).then((blockData) => {
				return res.status(200).send(blockData);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

		app.get("/stars/address/:address", function (req, res) {
			blockchain.getAllBlocks(
			).then((blockData) => {
				return res.status(200).send(blockData.filter(block => {
					return block.owner === req.params.address
				}));
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});
	}

}());