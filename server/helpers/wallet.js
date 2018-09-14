(function () {
	"use strict";

	const Wallet = require("../model/Wallet");
	const levelDB = require("./level");
	const createError = require("http-errors");
	const SHA256 = require("crypto-js/sha256");

	/**
	 * Private Wallet helper
	 * @module wallet
	 * @param {String} [chainName] - Chain name to be create the wallet within LevelDB.
	 * @description Provide methods to create and manipulate a wallet within a private blockchain
	 */
	module.exports = function (chainName = "defaultChain") {
		const walletStore = levelDB(`chains/${chainName}/wallets`);
		return {
			/**
			 * @function createWallet
			 * @description Method to add a new wallet to the Chain
			 * @param {Object} userInfo
			 * @throws {Error} If blockData is an invalid value
			 * @return {Promise} Containing the generated block
			 */
			createWallet(userInfo) {
				if (!userInfo) {
					throw new Error("Cannot add an empty block");
				}

				let wallet = new Wallet(userInfo);
				return new Promise((resolve, reject) => {
					walletStore.setData(
						wallet.address,
						JSON.stringify(wallet)
					).then(() => {
						console.log(`Wallet of ${wallet.owner} created`);
						console.log(wallet);
						resolve(wallet);
					}).catch(err => reject(err));
				});
			},
			/**
			 * @function getWalletOwner
			 * @description Method to retrieve wallet info to a given address
			 * @param {String} walletAddress to be queried
			 * @throws {Error} If walletAddress is an invalid value
			 * @return {Promise} Containing the wallet info if found
			 */
			getWalletOwner(walletAddress = "") {
				return new Promise((resolve, reject) => {
					if (!walletAddress) {
						return reject(createError(400, "Cannot proceed without a valid wallet address"))
					}
					walletStore.getData(
						walletAddress
					).then(wallet => resolve({"owner": wallet.owner, "created": wallet.timestamp})
					).catch(err => reject(err));
				});
			},
			/**
			 * @function getWalletOwner
			 * @description Method to retrieve wallet info to a given address
			 * @param {String} walletAddress to be queried
			 * @param {String} walletPassword to be validated
			 * @throws {Error} If walletAddress is an invalid value
			 * @return {Promise} Containing the wallet info if found
			 */
			validateWalletPassword(walletAddress, walletPassword) {
				return new Promise((resolve, reject) => {
					if (!walletAddress || !walletPassword) {
						return reject(createError(400, "Cannot proceed without a valid wallet address and password"))
					}
					walletStore.getData(
						walletAddress
					).then(wallet => {
						if (wallet.password === SHA256(walletPassword).toString()) {
							return resolve(wallet);
						} else {
							return reject(createError(401, "Invalid wallet password to retrieve signature"))
						}
					}).catch(err => reject(err));
				});
			}
		};
	}
}());