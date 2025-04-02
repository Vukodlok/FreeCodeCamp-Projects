'use strict';

const expect = require('chai').expect;
const ConvertHandler = require('../controllers/convertHandler.js');

module.exports = function (app) {
  
  let convertHandler = new ConvertHandler();

  app.get('/api/convert', (req, res) => {
    const input = req.query.input;
    //extract number and unit
    const initNum = convertHandler.getNum(input);
    const initUnit = convertHandler.getUnit(input);

    //check for invalid input
    if(!initNum && !initUnit) {
      return res.json({ error: 'invalid number and unit' });
    } else if (!initNum) {
      return res.json({ error: 'invalid number' });
    } else if (!initUnit) {
      return res.json({ error: 'invalid unit' });
    }

    //convert number
    const returnNum = convertHandler.convert(initNum, initUnit);
    const returnUnit = convertHandler.getReturnUnit(initUnit);
    const string = convertHandler.getString(initNum, initUnit, returnNum, returnUnit);
    
    //send response in correct format
    res.json({
      initNum,
      initUnit,
      returnNum, 
      returnUnit,
      string
    });
  });
};
