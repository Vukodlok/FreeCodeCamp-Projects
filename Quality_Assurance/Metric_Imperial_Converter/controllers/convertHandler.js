function ConvertHandler() {

  //extract number from input
  this.getNum = function(input) {
    let result;
    let numberPart = input.match(/[\d/.]+/g);
    if(!numberPart) return 1;

    numberPart = numberPart[0];

    //handle fractions
    if(numberPart.includes('/')){
      let fractionParts = numberPart.split('/');
      if(fractionParts.length !== 2) return 'invalid number';
      let numerator = parseFloat(fractionParts[0]);
      let denominator = parseFloat(fractionParts[1]);
      if(isNaN(numerator) || isNaN(denominator)) return 'invalid number';
      result = numerator / denominator;
      return parseFloat(fractionParts[0]) / parseFloat(fractionParts[1]);
    } else {
      result = parseFloat(numberPart); 
    }
    return isNaN(result) ? 'invalid number' : result;
  }
  
  //extract the unit from input
  this.getUnit = function(input) {
    let result = input.match(/[a-zA-Z]+$/);
    if(!result) return 'invalid unit';

    let unit = result[0].toLowerCase();
    const validUnits = ['gal', 'l', 'mi', 'km', 'lbs', 'kg'];
    
    return validUnits.includes(unit.toLowerCase()) ? (unit === 'l' ? 'L' : unit) : 'invalid unit';
  };
  
  //return the converted unit
  this.getReturnUnit = function(initUnit) {
    const unitMap = {
      gal: 'L', L: 'gal',
      mi: 'km', km: 'mi',
      lbs: 'kg', kg: 'lbs'
    };
    return unitMap[initUnit] || 'invalid unit';
  };

  //retreive full unit name from abbreviation
  this.spellOutUnit = function(unit) {
    const fullNames = {
      gal: 'gallons', L: 'liters',
      mi: 'miles', km: 'kilometers',
      lbs: 'pounds', kg: 'kilograms'
    };
    return fullNames[unit] || 'invalid unit';
  };
  
  //calculate conversion
  this.convert = function(initNum, initUnit) {
    const conversionRates = {
      gal: 3.78541, L: 1/3.78541,
      mi: 1.60934, km: 1/1.60934,
      lbs: 0.453592, kg: 1/0.453592
    }
    let result = initNum * (conversionRates[initUnit] || 1);
    return parseFloat(result.toFixed(5));
  };
  
  //format the result as a string
  this.getString = function(initNum, initUnit, returnNum, returnUnit) {
    return `${initNum} ${this.spellOutUnit(initUnit)} converts to ${returnNum} ${this.spellOutUnit(returnUnit)}`;
  };
}

module.exports = ConvertHandler;
