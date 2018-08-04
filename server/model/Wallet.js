(function () {
	"use strict";



	const SHA256 = require("crypto-js/sha256");
	const bitcoin = require("bitcoinjs-lib");
	const SECRET =  process.env.APP_SECRET || "APP_SECRET";

	/**
	 * Represents a new Wallet address to be added in the Chain.
	 * @module Wallet
	 * @class Wallet
	 * @constructor
	 * @param {object} payload - The block raw object.
	 * @param {string} payload.username - The username of the wallet.
	 * @param {string} payload.password - The username's password of the wallet
	 * @return {Object} Containing the new Wallet
	 */
	module.exports = function Constructor(payload = {}) {
		if (!payload || !payload.username || !payload.password) {
			throw new Error("Cannot create Wallet without username and password");
		}

		let keyPair = bitcoin.ECPair.fromPrivateKey(bitcoin.crypto.sha256(Buffer.from([payload.username, SECRET].join(":"))));

		this.address = bitcoin.payments.p2pkh({"pubkey": keyPair.publicKey}).address;
		this.owner = payload.username;
		this.timestamp = new Date().getTime().toString().slice(0, -3);
		this.signature = SHA256(payload.password).toString();
		return this;
	};

	
}());