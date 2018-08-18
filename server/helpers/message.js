(function () {
	"use strict";

	const bitcoin = require("bitcoinjs-lib");
	const bitcoinMessage = require("bitcoinjs-message");
	const createError = require("http-errors");
	const Message = require("../model/Message");
	const levelDB = require("./level");
	const SECRET = process.env.APP_SECRET || "APP_SECRET";
	const MESSAGE_VALIDATION_WINDOW = 300;
	/**
	 * Private Message helper
	 * @module message
	 * @description Provide methods to create, sign and validate blockchain messages
	 */
	module.exports = function (chainName = "defaultChain") {
		const authStore = levelDB(`chains/${chainName}/auth`);
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

					let message = new Message({
						"address": walletAddress,
						"messageTopic": messageTopic
					});

					authStore.getAllData().then((data) => {
						let newValidationWindow = null;
						let storedMessage = data.find((authBlock) => {
							if (authBlock.address === message.address) {
								let ts = new Date((authBlock.message.split(":")[1] * 1000)).getTime().toString().slice(0, -3);
								let requestTimestamp = new Date().getTime().toString().slice(0, -3);
								let validationWindow = (Number(requestTimestamp) - Number(ts));
								if (ts && validationWindow && validationWindow <= MESSAGE_VALIDATION_WINDOW) {
									newValidationWindow = authBlock.validationWindow - validationWindow;
									return true;
								} else {
									return false;
								}
							} else {
								return false;
							}
						});

						if (storedMessage && storedMessage.address) {
							console.log("last message still valid");
							resolve({
								...storedMessage,
								...{"validationWindow": newValidationWindow}
							});
						} else {
							console.log("generating new message");
							this.commitMessage(message).then(() => {
								resolve(message);
							}).catch(err => {
								reject(err);
							});

						}
					}).catch(err => {
						reject(err);
					});
				});
			},
			/**
			 * @function commitMessage
			 * @description Method to add a new message using a given address and topic
			 * @param {object} messageObject - The address that owns the message
			 * @throws {Error} If messageObject is an invalid value
			 * @return {Promise} Containing the generated message
			 */
			commitMessage(messageObject) {
				return new Promise((resolve, reject) => {
					if (!messageObject || !messageObject.message) {
						reject(createError(400, "Cannot proceed without Message object"));
					}

					console.log(messageObject.address);

					authStore.setData(
						messageObject.address,
						JSON.stringify(messageObject)
					).then(() => {
						resolve(messageObject);
					}).catch(err => reject(err));
				});
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
			 * @param {string} walletAddress - The wallet address
			 * @param {string} signature - The previously generated signature
			 * @throws {Error} If the message fails to be verified
			 * @throws {Error} If validationWindow is larger than 300 (5 minutes)
			 * @return {Promise} Containing the permission to handle stars
			 */
			validateSignature(walletAddress, signature) {
				return new Promise((resolve, reject) => {
					if (!walletAddress || !signature) {
						return reject(createError(400, "Invalid params"));
					}

					authStore.getData(
						walletAddress
					).then(messageObject => {
						let message = messageObject.message;
						if (bitcoinMessage.verify(message, walletAddress, signature)) {
							let ts = new Date((message.split(":")[1] * 1000)).getTime().toString().slice(0, -3);
							let requestTimestamp = new Date().getTime().toString().slice(0, -3);
							let validationWindow = (Number(requestTimestamp) - Number(ts));
							let currentValidationWindow = (MESSAGE_VALIDATION_WINDOW - validationWindow);

							if (ts && validationWindow && validationWindow >= MESSAGE_VALIDATION_WINDOW) {
								reject({
									"status": 403,
									"message": {
										"registerStar": false,
										"warning": "Request timed out - Start over",
										"status": {
											"address": walletAddress,
											"requestTimeStamp": requestTimestamp,
											"message": message,
											"validationWindow": currentValidationWindow,
											"messageSignature": "valid"
										}
									}
								});
							} else {
								resolve({
									"registerStar": true,
									"status": {
										"address": walletAddress,
										"requestTimeStamp": requestTimestamp,
										"message": message,
										"validationWindow": currentValidationWindow,
										"messageSignature": "valid"
									}
								});
							}
						} else {
							reject({
								"status": 401,
								"message": {
									"registerStar": false,
									"warning": "Invalid signature",
									"status": {
										"address": walletAddress,
										"requestTimeStamp": 0,
										"message": message,
										"validationWindow": 0,
										"messageSignature": "invalid"
									}
								}
							});
						}
					}).catch(err => reject(err));


				});
			}
		}

	}

}());