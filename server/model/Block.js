(function () {
	"use strict";

	const SHA256 = require("crypto-js/sha256");

	/**
	 * Represents a Block to be manipulated in the Chain.
	 * @module Block
	 * @class Block
	 * @constructor
	 * @param {object} payload - The block raw object.
	 * @param {string} [payload.height] - The height of the object, defaults to 0.
	 * @param {string} payload.body - The body of the block
	 * @param {string} [payload.time] - The block's creation timestamp
	 * @param {string} [payload.previousBlockHash] - The previous stored block hash reference.
	 * @param {string} [payload.blockOwner] - The block owner.
	 * @return {Object} Containing the new Block
	 */
	module.exports = function Constructor(payload = {}) {
		if (!payload || !payload.body) {
			throw new Error("Cannot create block without Body param");
		}

		this.height = payload.height || 0;
		this.body = payload.body;
		this.owner = payload.blockOwner || payload.owner || "anonymous";
		this.time = payload.time || new Date().getTime().toString().slice(0, -3);
		this.previousBlockHash = payload.previousBlockHash || "";
		this.hash = SHA256(JSON.stringify(this)).toString();

		return this;
	}

}());