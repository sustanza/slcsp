slcsp = require('./slcsp.js')

const testSLCSPPath = './data/testSlcsp.csv'
const testZipsPath = './data/testZips.csv'
const testPlansPath = './data/testPlans.csv'
const testOutputPath = './data/testOutput.csv'

test('can parse of CSV file using slcsp.parseCSVFile', async () => {
    let slcpsRecords = await slcsp.parseCSVFile('./data/testSlcsp.csv')

    expect(slcpsRecords).toEqual([
        {
            zipcode: '11111',
            rate: '',
        },
        {
            zipcode: '22222',
            rate: '',
        },
        {
            zipcode: '33333',
            rate: '',
        },
        {
            zipcode: '33333',
            rate: '',
        },
        {
            zipcode: '44444',
            rate: '',
        },
    ])
})

test('zip data map has correct number of items', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    expect(slcpsRecords.length == zipDataMap.size + 1).toBeTruthy()
})

test('zip data map has all items after creating a zip data map', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)

    let foundAll = true
    for (let record of slcpsRecords) {
        if (!zipDataMap.has(record.zipcode)) {
            foundAll = false
            break
        }
    }
    expect(foundAll).toBeTruthy()
})

test('can associate rate area for zip with 1 rate area and 3 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)

    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)

    let recordValue = zipDataMap.get('11111')

    expect(recordValue.rateAreas[0] == 'TX 1').toBeTruthy()
})

test('can associate rate area for zip with 1 rate area and 3 rates with 2 dupes as the lowest values', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)

    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)

    let recordValue = zipDataMap.get('22222')

    expect(recordValue.rateAreas[0] == 'TX 2').toBeTruthy()
})

test('can associate rate areas for zip with 2 rate area and 3 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)

    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)

    let recordValue = zipDataMap.get('33333')

    expect(recordValue.rateAreas.length > 1).toBeTruthy()
})

test('can associate rate area for zip with 1 rate area and 0 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)

    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)

    let recordValue = zipDataMap.get('44444')

    expect(recordValue.rateAreas[0] == 'TX 5').toBeTruthy()
})

test('can associate rate area for zip with 1 rate area and 3 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    let recordValue = zipDataMap.get('11111')
    expect(recordValue.rates).toEqual(
        expect.arrayContaining(['1.10', '2.20', '3.30'])
    )
})

test('can associate rate area for zip with 1 rate area and 3 rates with 2 dupes as the lowest values', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    let recordValue = zipDataMap.get('22222')
    expect(recordValue.rates).toEqual(expect.arrayContaining(['1.10', '3.30']))
})

test('can associate rate areas for zip with 2 rate area and 3 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    let recordValue = zipDataMap.get('33333')
    expect(recordValue.rates).toEqual(
        expect.arrayContaining(['1.10', '2.20', '3.30'])
    )
})

test('can associate rate area for zip with 1 rate area and 0 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    let recordValue = zipDataMap.get('44444')
    expect(recordValue.rates).toEqual(expect.arrayContaining([]))
})

test('can set SLCPS rate for zip with 1 rate area and 3 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    let recordValue = slcpsRecords[0]

    expect(recordValue.rate).toEqual('2.20')
})

test('can set SLCPS rate for zip with 1 rate area and 3 rates with 2 dupes as the lowest values', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    let recordValue = slcpsRecords[1]

    expect(recordValue.rate).toEqual('3.30')
})

test('can set SLCPS rate for zip with 2 rate areas and 3 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    let recordValue = slcpsRecords[2]
    expect(recordValue.rate).toEqual('')
})

test('can set SLCPS rate for zip with 1 rate area and 0 rates', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    let recordValue = slcpsRecords[3]
    expect(recordValue.rate).toEqual('')
})

test('can convert the slcsp records to CSV string', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    const csvString = await slcsp.convertRecordsToCSVString(slcpsRecords)
    expect(csvString).toEqual(
        'zipcode,rate\n11111,2.20\n22222,3.30\n33333,\n33333,\n44444,\n'
    )
})

test('can print the stringified slcsp records', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    const csvString = await slcsp.convertRecordsToCSVString(slcpsRecords)
    console.log = jest.fn()
    slcsp.printString(csvString)
    expect(console.log).toHaveBeenCalledWith(csvString)
})

test('can write the stringified slcsp records to csv file', async () => {
    let slcpsRecords = await slcsp.parseCSVFile(testSLCSPPath)
    const zipsRecords = await slcsp.parseCSVFile(testZipsPath)
    const planRecords = await slcsp.parseCSVFile(testPlansPath)
    let zipDataMap = await slcsp.createZipDataMap(slcpsRecords)
    await slcsp.associateZipToRateArea(zipDataMap, zipsRecords)
    await slcsp.associateRateAreaWithPlanRate(zipDataMap, planRecords)
    await slcsp.setSLCPSRate(zipDataMap, slcpsRecords)
    let csvString = await slcsp.convertRecordsToCSVString(slcpsRecords)
    await slcsp.writeCSVStringToFile(testOutputPath, csvString)
    slcpsRecords = await slcsp.parseCSVFile(testOutputPath)
    csvString = await slcsp.convertRecordsToCSVString(slcpsRecords)
    expect(csvString).toEqual(
        'zipcode,rate\n11111,2.20\n22222,3.30\n33333,\n33333,\n44444,\n'
    )
})
