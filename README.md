# Solution for SLCSP

## Summary

This is a solution for [SLCSP](https://homework.adhoc.team/slcsp/) (Second Lowest Cost Silver Plan). The objective can be found at the previously posted link for the exercise. It's recommended to read the exercise information for more context.

## Local Development

### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)

### Setup
* Clone repository
* Install packages via NPM
  * ```npm install```

### Running application
The application requires 3 arguments and an optional 4th. These are the 3 files that are included in the assignment. Which are the following:

* ```slcsp.csv```
* ```zips.csv```
* ```plans.csv```

These are all included in the data directory in the root of this project. An optional 4th argument is the final output of the slcsp file with the SLCSP rate associate to the correct zip code. By default, the application just overrides the ```slcsp.csv``` file as per the requirements. However, this was added as an additional optional argument so that the original file wouldn't be modified upon execution of the application.

### Running via NPM scripts in the CLI
```npm run start "./data/slcsp.csv" "./data/zips.csv" "./data/plans.csv" "./data/slcspfinal.csv"```

### Running via NPM scripts in the CLI without having to add all the default data set file path arguments

```npm run start:defaults```

### Tests

Will run the tests with test data in the ```./data``` directory

```npm run test```

For coverage results
```npm run test --coverage```

### Test Use cases
* Zip with 1 rate area, and 3 rates.
* Zip with 1 rate area, and 3 rates with 2 dupes as the lowest values
* Zip with 2 rate area, and 3 rates (should not be included)
* Zip with 1 rate area, and 0 rates (should not be included)