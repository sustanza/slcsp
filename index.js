const { main } = require('./main.js')
const fs = require('fs')

try {
    // check if required arguments are sent
    if (process.argv.length < 5) {
        console.log(
            `Arguments missing!\nPlease try again using the following syntax:\nnode index.js "slcpsCSVFilePath.csv" "zipsCSVFilePath.csv" "plansCSVFilePath.csv"`
        )
        // exit program with error exit code
        process.exit(1)
    }

    // parse out required args
    const slcpsRecordsPath = process.argv[2]
    const zipsRecordsPath = process.argv[3]
    const planRecordsPath = process.argv[4]

    // optional arg
    const slcpsFinalRecordsPath = process.argv[5]

    // check if SLCPS path argument is present
    if (!fs.existsSync(slcpsRecordsPath)) {
        console.log(
            `The file at the file path ${slcpsRecordsPath} to SLCPS CSV does not exist.`
        )
        process.exit(1)
    }

    // check if SLCPS path argument is present
    if (!fs.existsSync(zipsRecordsPath)) {
        console.log(
            `The file at the file path ${zipsRecordsPath} to zips CSV does not exist.`
        )
        process.exit(1)
    }

    // check if SLCPS path argument is present
    if (!fs.existsSync(planRecordsPath)) {
        console.log(
            `The file at the file path ${planRecordsPath} to plans CSV does not exist.`
        )
        process.exit(1)
    }

    // execute the main program
    main(
        slcpsRecordsPath,
        zipsRecordsPath,
        planRecordsPath,
        slcpsFinalRecordsPath
    )
} catch (ex) {
    // do something with the exception at some point
    process.exit(1)
}
