# Solution for SLCSP

## Summary

This is a solution for [SLCSP](https://homework.adhoc.team/slcsp/) (Second Lowest Cost Silver Plan). The objective can be found at the previously posted link for the exercise.

## Local Development

### Prerequisites
* [NodeJS](https://nodejs.org/en/)
* [NPM](https://www.npmjs.com/)

### Setup
* Clone repository
* Install packages via NPM
  * ```npm install```

### Run program using default data sets
```npm run start "./data/slcsp.csv" "./data/zips.csv" "./data/plans.csv" "./data/slcspfinal.csv"```

If you don't wanna add all the args

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