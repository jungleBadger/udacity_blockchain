(function () {
	"use strict";



	/**
	 * Represents a new Wallet address to be added in the Chain.
	 * @module Message
	 * @class Message
	 * @constructor
	 * @param {object} payload - The block raw object.
	 * @param {string} payload.address - The address of the wallet.
	 * @param {string} payload.messageTopic - The messageTopic
	 * @return {Object} Containing the new Wallet
	 */
	module.exports = function Constructor(payload = {}) {
		if (!payload || !payload.address) {
			throw new Error("Cannot create Wallet without username and password");
		}

		let requestTimeStamp = new Date().getTime().toString().slice(0, -3);

		this.address = payload.address;
		this.requestTimeStamp = requestTimeStamp;
		this.message = [payload.address, requestTimeStamp, payload.messageTopic].join(":");
		this.validationWindow = 300;
		return this;
	};

	
}());