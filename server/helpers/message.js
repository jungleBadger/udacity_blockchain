(function () {
	"use strict";

	const bitcoin = require("bitcoinjs-lib");
	const bitcoinMessage = require("bitcoinjs-message");
	const createError = require("http-errors");
	const SECRET = process.env.APP_SECRET || "APP_SECRET";
	const Message = require("../model/Message");

	/**
	 * Private Message helper
	 * @module message
	 * @description Provide methods to create, sign and validate blockchain messages
	 */
	module.exports = function () {
		return {
			/**
			 * @function registerMessage
			 * @description Method to add a new message using a given address and topic
			 * @param {string} walletAddress - The address that owns the message
  			 * @param {string} [messageTopic] - The topic to be posted
			 * @throws {Error} If walletAddress is an invalid value
			 * @return {Promise} Containing the generated message
			 */
			registerMessage(walletAddress, messageTopic = "defaultTopic") {
				return new Promise((resolve, reject) => {
					if (!walletAddress) {
						reject(createError(400, "Cannot proceed without Wallet address"));
					}
					resolve(new Message({
						"address": walletAddress,
						"messageTopic": messageTopic
					}));
				})
			},
			/**
			 * @function signMessage
			 * @description Method to sign the message using private key method
			 * @param {string} walletIdentifier - The identifier to sign the message against
			 * @param {string} message - The message to be signed
			 * @return {Promise} Containing the signature
			 */
			signMessage(walletIdentifier, message) {
				let keyPair = bitcoin.ECPair.fromPrivateKey(bitcoin.crypto.sha256(Buffer.from([walletIdentifier, SECRET].join(":"))));
				return bitcoinMessage.sign(message, keyPair.privateKey, keyPair.compressed).toString("base64");
			},
			/**
			 * @function validateSignature
			 * @description Method to add a new message using a given address and topic
			 * @param {string} message - The message to be validated
			 * @param {string} walletAddress - The wallet address
			 * @param {string} signature - The previously generated signature
			 * @throws {Error} If the message fails to be verified
			 * @throws {Error} If validationWindow is larger than 300 (5 minutes)
			 * @return {Promise} Containing the permission to handle stars
			 */
			validateSignature(message, walletAddress, signature) {
				return new Promise((resolve, reject) => {
					if (bitcoinMessage.verify(message, walletAddress, signature)) {
						let ts = new Date((message.split(":")[1] * 1000)).getTime().toString().slice(0, -3);
						let requestTimestamp = new Date().getTime().toString().slice(0, -3);
						let validationWindow = (Number(requestTimestamp) - Number(ts));

						if (ts && validationWindow && validationWindow >= 300) {
							reject(createError(403, JSON.stringify({
								"registerStar": false,
								"warning": "Request timed out - Start over",
								"status": {
									"address": walletAddress,
									"requestTimeStamp": requestTimestamp,
									"message": message,
									"validationWindow": validationWindow,
									"messageSignature": "valid"
								}
							})))
						} else {
							resolve({
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
						reject(createError(401, JSON.stringify({
							"registerStar": false,
							"warning": "Invalid signature",
							"status": {
								"address": walletAddress,
								"requestTimeStamp": 0,
								"message": message,
								"validationWindow": 0,
								"messageSignature": "invalid"
							}
						})));
					}
				});
			}
		}

	}

}());