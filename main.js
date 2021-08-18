const slcsp = require('./slcsp.js')
/**
 * programs main function
 * @param {string} slcpsFilePath - file path to SLCPS CSV file
 * @param {string} zipsFilePath - file path to zips CSV file
 * @param {string} planFilePath - file path to plans CSV file
 * @param {string} slcpsFinalFilePath - optional file path for to write the final SLCPS with set rates
 */
const main = async (
    slcpsFilePath,
    zipsFilePath,
    planFilePath,
    slcpsFinalFilePath
) => {
    try {
        // parse CSV files to an array of objects that represent the CSV rows using columns as mapped properties
        let slcpsRecords = await slcsp.parseCSVFile(slcpsFilePath)
        const zipsRecords = await slcsp.parseCSVFile(zipsFilePath)
        const planRecords = await slcsp.parseCSVFile(planFilePath)

        // create a map data structure to help manage and organize data as associations are made from all of the data sources
        let zipDataMap = slcsp.createZipDataMap(slcpsRecords)

        // associates the rate areas between the zip codes we need rates for and all zip codes using the zip records data source
        await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)

        // associates the rate areas with plan rates using the plan records data source
        await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)

        // sets the data rate for zips in our SLCPS records from our zip map data structure
        await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)

        // converts the SLCPS records back to a CSV string so we can print it and write it to disk
        const csvString = await slcsp.convertRecordsToCSVString(slcpsRecords)

        // determines the final record path based on if optional path is provided or to use the original SLCPS record path
        let finalRecordsPath = slcpsFinalFilePath
            ? slcpsFinalFilePath
            : slcpsRecordsPath

        // write CSV string to disk as per the requirements
        await slcsp.writeCSVStringToFile(finalRecordsPath, csvString)

        // prints CSV string to console as per the requirements
        slcsp.printString(csvString)
    } catch (ex) {
        // do something with the exception
    }
}

module.exports = { main }
