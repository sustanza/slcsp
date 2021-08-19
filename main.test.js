const { main } = require('./main.js')
const fs = require('fs')

const testSLCSPPath = './data/testSlcsp.csv'
const testZipsPath = './data/testZips.csv'
const testPlansPath = './data/testPlans.csv'
const testOutputPath = './data/testOutput.csv'

afterEach(() => {
    try {
        if (fs.existsSync(testOutputPath)) {
            fs.unlinkSync(testOutputPath)
        }
    } catch (err) {
        console.error(err)
    }
})

test(`application runs saving file to ${testOutputPath}`, async () => {
    await main(testSLCSPPath, testZipsPath, testPlansPath, testOutputPath)
    const data = fs.readFileSync(testOutputPath, 'utf8')
    expect(data).toEqual(
        'zipcode,rate\n11111,2.20\n22222,3.30\n33333,\n33333,\n44444,\n'
    )
})

test(`application runs and outputs the correct results to console`, async () => {
    console.log = jest.fn()
    await main(testSLCSPPath, testZipsPath, testPlansPath, testOutputPath)
    const data = fs.readFileSync(testOutputPath, 'utf8')
    expect(console.log).toHaveBeenCalledWith(data)
})
