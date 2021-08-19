# Solution for SLCSP

## Summary

This is a solution for [SLCSP](https://homework.adhoc.team/slcsp/) (Second Lowest Cost Silver Plan). The objective can be found at the previously posted link for the exercise. It's recommended to read the exercise information for more context.

## Local Development

## Structure
```bash
.
├── README.md # project readme
├── data - # directory for data files 
│   ├── README.md # SLCSP assignment readme
│   ├── plans.csv # default data for plans
│   ├── slcsp.csv # default data for slcsp
│   ├── testPlans.csv # test data plans
│   ├── testSlcsp.csv # test data slcsp
│   ├── testZips.csv # test data for zips
│   └── zips.csv # default data for zips
├── index.js # project entry point
├── main.js # main function to run the program
├── main.test.js # tests for main function
├── package-lock.json # npm package lock
├── package.json # npm project package
├── slcsp.js # set of functions for slcsp specific functionality
└── slcsp.test.js # tests for slcsp specific functionality
```

### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)

### Setup
* [Clone repository](https://docs.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository-from-github/cloning-a-repository)
* Install packages via NPM using hte following CLI command:

 ```bash
 npm install
 ```

### Running application
The application requires 3 arguments and an optional 4th. These are the 3 files that are included in the assignment. Which are the following:

* slcsp.csv
* zips.csv
* plans.csv

These are all included in the data directory in the root of this project. An optional 4th argument is the final output of the slcsp file with the SLCSP rate associated to the correct zip code. By default, the application just overrides the ```slcsp.csv``` file as per the requirements. However, this was added as an additional optional argument so that the original file wouldn't be modified upon execution of the application.

### Running via NPM scripts in the CLI
```bash
npm run start "./data/slcsp.csv" "./data/zips.csv" "./data/plans.csv" "./data/slcspfinal.csv"
```

### Running via NPM scripts in the CLI without having to add all the default data set file path arguments

```bash
npm run start:defaults
```

### Tests

Will run the tests with test data in the ```./data``` directory

```bash
npm run test
```

For coverage results
```bash
npm run test:coverage
```

### Test Use cases provided by test data
* Zip with 1 rate area, and 3 rates.
* Zip with 1 rate area, and 3 rates with 2 dupes as the lowest values
* Zip with 2 rate area, and 3 rates (should not be included)
* Zip with 1 rate area, and 0 rates (should not be included)