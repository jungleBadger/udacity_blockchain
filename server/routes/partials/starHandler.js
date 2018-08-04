(function () {
	"use strict";


	module.exports = function (app, blockchain, validateSignature) {

		app.get("/stars/address/:address", validateSignature, function (req, res) {
			blockchain.getAllBlocks(
			).then((blockData) => {

				return res.status(200).send(blockData.filter(block => {
					return block.body.address === req.params.hash
				}));
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

		app.get("/stars/hash/:hash", validateSignature, function (req, res) {
			blockchain.getAllBlocks(
			).then((blockData) => {

				return res.status(200).send(blockData.filter(block => {
					return block.hash === req.params.hash
				}));
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

		app.get("/stars/:blockHeight", validateSignature, function (req, res) {
			blockchain.getBlock(
				req.params.blockHeight
			).then((blockData) => {
				return res.status(200).send(blockData);
			}).catch(err => {
				return res.status(err.status || 500).send(err.message || err);
			});
		});

	}

}());