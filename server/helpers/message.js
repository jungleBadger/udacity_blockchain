(function () {
	"use strict";

	const bitcoin = require("bitcoinjs-lib");
	const bitcoinMessage = require("bitcoinjs-message");
	const createError = require("http-errors");

	const Message = require("../model/Message");
	module.exports = function () {
		return {
			registerMessage(walletAddress, messageTopic = "defaultTopic") {
				return new Promise((resolve, reject) => {
					if (!walletAddress) {
						reject("");
					}
					resolve(new Message({
						"address": walletAddress,
						"messageTopic": messageTopic
					}));
				})
			},
			signMessage(walletAddress, message) {
				let keyPair = bitcoin.ECPair.fromPrivateKey(bitcoin.crypto.sha256(Buffer.from(walletAddress)));
				return bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed).toString("base64");
			},
			validateSignature(walletAddress, message, signature) {
				return new Promise((resolve, reject) => {
					if (!walletAddress || !message || !signature) {
						return reject(createError(400, "Missing required param"));
					}
					if (bitcoinMessage.verify(message, walletAddress, signature)) {
						let ts = new Date((message.split(":")[2] * 1000));
						let requestTimestamp = new Date().getTime().toString().slice(0, -3);
						let validationWindow = ((+requestTimestamp) - (+ts));
						if (validationWindow > 0 && validationWindow <= 300) {
							reject(createError(403, "Signature expired, please start over"))
						} else {
							resolve ({
								"registerStar": true,
								"status": {
									"address": walletAddress,
									"requestTimeStamp": requestTimestamp,
									"message": message,
									"validationWindow": validationWindow,
									"messageSignature": "valid"
								}
							});
						}

					} else {
						reject("Invalid signature");
					}
				});
			}
		}

	}

}());