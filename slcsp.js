const csvParse = require('csv-parse')
const csvStringify = require('csv-stringify/lib/sync.js')
const fs = require('fs')

/**
 * @typedef ZipMapObject
 * @type {Object}
 * @property {Array<number>} rates - array of plan rates
 * @property {Array<string>} rateAreas - array of rate areas ex: ["CA 1", "CA 2", "MI 1", "TX 3"]
 */

/**
 * @typedef ZipMap
 * @type {Map<String, ZipMapObject>} - key is the zipcode
 */

/**
 * @typedef PlanRecord
 * @type {Object}
 * @property {string} plan_id - array of plan rates
 * @property {string} state - array of plan rates
 * @property {string} metal_level - array of plan rates
 * @property {number} rate - array of plan rates
 * @property {number} rate_area - array of plan rates
 */

/**
 * @typedef ZipRecord
 * @type {Object}
 * @property {string} zipcode - array of plan rates
 * @property {string} state - array of plan rates
 * @property {string} county_code - array of plan rates
 * @property {string} name - array of plan rates
 * @property {number} rate_area - array of plan rates
 */

/**
 * @typedef SLCPSRecord
 * @type {Object}
 * @property {string} zipcode - array of plan rates
 * @property {number} rate - array of plan rates
 */

/**
 *
 * @param {Array<Object>} records
 * @returns {ZipMap}
 */
const createZipDataMap = (records) => {
    // create a new map to help us organize our data
    let zipMap = new Map()

    // load our slcps records into the map we just created
    for (let record of records) {
        /*
    add records to map with an object for the value and an empty array for rates. 
    Adding rates here saves us logic later to determine if the rates property has items already.
    */
        zipMap.set(record.zipcode, { rates: [], rateAreas: [] })
    }

    return zipMap
}

/**
 * Takes a filepath of a CSV file and converts it to an array of objects that represent the rows as objects and columns as properties
 * @param {string} filepath - Location of the file
 * @returns {Array} Returns an array of objects that represents the CSV file
 */
const parseCSVFile = async (filepath) => {
    let records = []
    // open the file, pipe the stream to csv parse libary
    const parser = fs.createReadStream(`${filepath}`).pipe(
        csvParse({
            columns: true,
        })
    )
    // update records with each parsed record
    for await (const record of parser) {
        records.push(record)
    }
    // return records
    return records
}

/**
 * Correlates rate areas from a zip map data structure with an array zip records.
 * Updates the zip map data structure with an array of rate areas.
 * @param {Map<String, ZipMapObject>} zipDataMap - A map of the zip data
 * @param {Array<ZipRecord>} zipsRecords - An array of processed zip records
 */
const associateZipToRateArea = (zipDataMap, zipsRecords) => {
    // associate rate area to the relevant zips from our slcps records
    // might be able to opimitize this by breaking from the loop after all of the zip records have been updated
    // maybe don't add the value for the objective above, so it here to save processing twice
    for (let record of zipsRecords) {
        // check if this record is in our map of relevant zips
        if (zipDataMap.has(record.zipcode)) {
            // grab the value for the zip from the zip map
            let zipdata = zipDataMap.get(record.zipcode)

            let rateArea = `${record.state} ${record.rate_area}`

            zipdata.rateAreas.push(rateArea)

            zipDataMap.set(record.zipcode, zipdata)
        }
    }

    // dedupe the rate areas - this potentially could be optimized by moving it into the above loop
    dedupeRateAreas(zipDataMap)
}

/**
 * Dedupes rate areas in the zip map data structure. There is a chance that zips belong to the same rate area.
 * @param {*} zipDataMap - A map of the zip data
 */
const dedupeRateAreas = (zipDataMap) => {
    for (var [key, value] of zipDataMap) {
        value.rateAreas = value.rateAreas.filter((value, index, self) => {
            // find the first index of the current value and if it's equal to the current index then it's unique
            return self.indexOf(value) === index
        })
    }
}

/**
 * Associates plan rates with rate areas
 * @param {zipDataMap} zipDataMap
 * @param {Array<PlanRecord>} planRecords
 */
const associateRateAreaWithPlanRate = (zipDataMap, planRecords) => {
    // search the plan records to find the rates associated with the rate area
    for (let plan of planRecords) {
        let metalLevel = 'Silver'
        // search the zip map for rate areas that match the plan rate areas
        for (let [key, value] of zipDataMap) {
            // if the rate area and metal level match
            if (
                plan.state == value.rateAreas[0].split(' ')[0] &&
                plan.rate_area == value.rateAreas[0].split(' ')[1] &&
                plan.metal_level == metalLevel
            ) {
                let formattedNumber = Number(plan.rate).toFixed(2)
                // also set to 2 decimals
                value.rates.push(formattedNumber)
                // update the zip data with the additional rate
                zipDataMap.set(key, value)
            }
        }
    }

    // dedupe and sort rates - this potentially could be optimized by moving it into the above loop
    dedupeAndSortRates(zipDataMap)
}

/**
 * Dedupe and sort rates in the zip data map
 * @param {zipDataMap} zipDataMap
 */
const dedupeAndSortRates = (zipDataMap) => {
    // dedupe rates and order rates
    for (var [key, value] of zipDataMap) {
        // dedupe the rates
        value.rates = value.rates.filter((value, index, self) => {
            // find the first index of the current value and if it's equal to the current index then it's unique
            return self.indexOf(value) === index
        })
        // sort the rates
        value.rates.sort((a, b) => a - b)
    }
}

/**
 * Sets the SLCPS rates
 * @param {zipDataMap} zipDataMap
 * @param {Array<SLCPSRecord>} slcpsRecords
 */
const setSLCPSRate = (zipDataMap, slcpsRecords) => {
    // populate every value for the slcps records
    for (let record of slcpsRecords) {
        // get the accumulated data for the current zip from our map
        let data = zipDataMap.get(record.zipcode)

        // if there is only one value, then we set a blank rate based on the biz reqs
        if (data.rates[0] && !data.rates[1]) {
            // set blank rate
            record.rate = ''

            // if there more than one rate area, then we set a blank rate based on the biz reqs
        } else if (data.rateAreas.length > 1) {
            // set blank rate
            record.rate = ''

            // if there is 2 values, use the second value as specified
        } else if (data.rates[1]) {
            // set the rate on the second value of the array
            record.rate = data.rates[1]

            // otherwise set blank as specified by the requirements
        } else {
            record.rate = ''
        }
    }
}

/**
 * Converts an array the same objects to a CSV string using their properties as columns
 * @param {Array<Object>} records - an array of objects with the same properties
 * @returns {String} a CSV string representation of the object records
 */
const convertRecordsToCSVString = (records) => {
    const csvString = csvStringify(records, {
        header: true,
    })
    return csvString
}

/**
 * Print a string to console
 * @param {string} string
 */
const printString = (string) => {
    console.log(string)
}

/**
 * Write CSV string to disk
 * @param {string} path - file path to where we want to write csv file
 * @param {string} csvString - string representation of the csv file we are writing to disk
 */
const writeCSVStringToFile = (path, csvString) => {
    // write file to disk with rates
    fs.writeFileSync(path, csvString)
}

module.exports = {
    associateRateAreaWithPlanRate,
    associateZipToRateArea,
    convertRecordsToCSVString,
    createZipDataMap,
    csvStringify,
    dedupeAndSortRates,
    dedupeRateAreas,
    parseCSVFile,
    printString,
    setSLCPSRate,
    writeCSVStringToFile,
}
