(function () {
	"use strict";

	const level = require("level");

	/**
	 * LevelDB helper
	 * @module level
	 * @param {String} dataSource - Data source to be manipulated.
	 * @throws {Error} If dataSource is an invalid value
	 * * @description Provide methods to create and manipulate a levelDB datastore
	 */
	module.exports = function (dataSource) {
		if (!dataSource) {
			throw new Error("Cannot proceed without Datasource");
		}

		const db = level(dataSource);

		return {
			/**
			 * @function getData
			 * @description Method to get levelDB data
			 * @param {String} key - Key to be queried within levelDB store.
			 * @throws {Error} If query does not match any criteria
			 * @return {Promise} Containing the data
			 */
			getData(key) {
				return new Promise((resolve, reject) => {
					db.get((key + "").toString(), function (err, value) {
						return err && !value ? reject(err || new Error("Data not found")) : resolve(JSON.parse(value));
					});
				});
			},
			/**
			 * @function setData
			 * @description Method to set levelDB data
			 * @param {String} key - Key to be stored within levelDB store.
			 * @param {String} value - Value to be stored along with the key within levelDB store.
			 * @return {Promise} Containing the operation state
			 */
			setData(key, value) {
				return new Promise((resolve, reject) => {
					db.put((key + "").toString(), value, function (err, value) {
						return err ? reject(err) : resolve(value);
					});
				});
			},
			getAllData() {
				/**
				 * @function getAllData
				 * @description Method to retrieve all data existent within a levelDB store
				 * @return {Promise} Containing a data array
				 */
				return new Promise((resolve, reject) => {
					let dataArray = [];
					db.createReadStream()
						.on("data", (data) => {
							if (data.value) {
								dataArray.push(JSON.parse(data.value));
							}
						})
						.on("error", function (err) {
							reject(err);
						})
						.on("end", function () {
							resolve(dataArray);
						});
				});
			}
		};
	}
}());