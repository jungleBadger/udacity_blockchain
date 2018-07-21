(function () {
	"use strict";
	/**
	 * Private Blockchain helper
	 * @module blockchain
	 * @param {String} [chainName] - Chain name to be create the private block chain within LevelDB.
	 * @description Provide methods to create and manipulate a private blockchain
	 */
	const Block = require("../model/Block");
	const levelDB = require("./level");

	module.exports = function (chainName = "defaultChain") {
		const chainStore = levelDB(chainName);
		let chain = [];
		return {
			/**
			 * @function addBlock
			 * @description Method to add a new block to the Chain
			 * @param {Object} blockData - Unprocessed block data to be hashed.
			 * @throws {Error} If blockData is an invalid value
			 * @return {Promise} Containing the generated block
			 */
			addBlock(blockData)  {
				if (!blockData) {
					throw new Error("Cannot add an empty block");
				}
				if (chain && chain.length) {
					blockData.previousBlockHash = chain[chain.length - 1].hash;
					blockData.height = chain.length;
				}

				let block = new Block(blockData);

				return new Promise((resolve, reject) => {
					chainStore.setData(
						chain.length,
						JSON.stringify(block)
					).then(() => {
						console.log(`Block ${block.hash} added as #${block.height}`);
						chain.push(block);
						resolve(block);
					}).catch(err => reject(err));
				});
			},
			/**
			 * @function getBlock
			 * @description Method to retrieve a block given a block height
			 * @param {Number} blockHeight - Block height to be queried on levelDB.
			 * @throws {Error} If blockHeight is an invalid value
			 * @return {Promise} Containing the block if found
			 */
			getBlock(blockHeight) {
				return new Promise((resolve, reject) => {
					if (!blockHeight < 0) {
						return reject(new Error("Cannot proceed without a valid block height"))
					}
					chainStore.getData(
						blockHeight
					).then(block => resolve(block)
					).catch(err => reject(err));
				});
			},
			/**
			 * @function getBlockHeight
			 * @description Method to retrieve the block count (last index)
			 * @return {Promise} Containing the last index available on levelDB
			 */
			getBlockHeight() {
				// NOTE: Sadly levelDB does not have a "count" operation, so I need to retrieve the whole dataset and
				// get the length. I believe this is not scalable pretty much as the same as manipulating the array directly

				return new Promise((resolve, reject) => {
					chainStore.getAllData(

					).then(data => resolve(data.length)
					).catch(err => reject(err));
				});
			},
			/**
			 * @function getAllBlocks
			 * @description Method to retrieve all blocks contained within the chain
			 * @return {Promise} Containing the blocks array
			 */
			getAllBlocks() {
				return new Promise((resolve, reject) => {
					chainStore.getAllData(

					).then(data => {
						resolve(data.sort((a, b) => {
							return a.height - b.height;
						}))
					}).catch(err => reject(err));
				});
			},
			/**
			 * @function validateBlock
			 * @description Method to validate a block against it's own stored data
			 * @param {Object} block - Block object to be validated.
			 * @param {Number} blockIndex - Block object index.
			 * @throws {Error} If block is invalid
			 * @return {Boolean} True if block hash is consistent with previously stored value
			 */
			validateBlock(block, blockIndex) {
				let hashToTest = block.hash;
				this.getBlock(block.height).then(block => {
					let copiedBlock = new Block(block);
					if (hashToTest === copiedBlock.hash &&
						(blockIndex >= 1 ? chain[blockIndex - 1].hash === block.previousBlockHash : true)) {
						return true;
					} else {
						throw new Error(`Inconsistency found on block # ${block.height}`);
					}
				}).catch(err => {
					console.log(err);
				});
			},
			/**
			 * @function validateChain
			 * @description Method to validate an array of blocks, or chain
			 * @throws {Error} If any block is invalid
			 * @return {Boolean} True if chain is validated
			 */
			validateChain() {
				chain.forEach((blockData, index) => {
					this.validateBlock(blockData, index);
				});
				console.log(`Validated chain with ${chain.length} blocks`);
				return true;
			},
			/**
			 * @function createGenesisBlock
			 * @description Method to create the genesis block upon chain initialization
			 * @throws {Error} If chain already contains a genesis block
			 * @return {Promise} Containing the created genesis block
			 */
			createGenesisBlock() {
				return new Promise((resolve, reject) => {
					if (chain && chain.length) {
						return reject(new Error("Cannot add a genesis block on an already existent chain"));
					}
					this.addBlock({
						"body": "genesis block"
					}).then(newBlock => resolve(newBlock)
					).catch(err => reject(err));
				});
			},
			/**
			 * @function init
			 * @description Method to init the configured Chain
			 * @return {Promise} Containing the chain array. It will create a genesis block if chain is empty at start
			 */
			init() {
				return new Promise((resolve, reject) => {
					this.getAllBlocks(

					).then((dbData) => {
						if (dbData && dbData.length) {
							chain = dbData;
							console.log("Validating already existent chain...");
							this.validateChain();
							resolve(chain);
						} else {
							this.createGenesisBlock(
							).then(genesisBlock => {
								console.log(`Initiated with Genesis Block: ${genesisBlock.hash}`);
								resolve(chain)
							});
						}

					}).catch(err => {
						reject(err);
					});
				});
			}
		};
	}
}());