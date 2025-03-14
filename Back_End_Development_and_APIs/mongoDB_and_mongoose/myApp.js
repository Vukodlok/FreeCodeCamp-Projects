const mongoose = require('mongoose');
require('dotenv').config();

mongoose.connect('mongodb+srv://Mark:learn@cluster0.8c15z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const personSchema = new mongoose.Schema({
  name: { type: String, required: true },
  age: Number,
  favoriteFoods: [String]
});

let Person = mongoose.model('Person', personSchema);
//example data
const simpsonsCharacters = [
  { name: "Homer Simpson", age: 39, favoriteFoods: ["Donuts", "Bacon", "Beer"] },
  { name: "Marge Simpson", age: 36, favoriteFoods: ["Pork Chops", "Salad"] },
  { name: "Bart Simpson", age: 10, favoriteFoods: ["Krusty Burger", "Slushies"] },
  { name: "Lisa Simpson", age: 8, favoriteFoods: ["Vegetarian Pizza", "Tofu"] },
  { name: "Maggie Simpson", age: 1, favoriteFoods: ["Baby Formula", "Pacifier"] }
];

//create new person object
const createAndSavePerson = (done) => {
  const person = new Person({
    name: "Homer Simpson",
    age: 38,
    favoriteFoods: ["Doughnuts", "Duff Beer"]
  });
  //save to database
  person.save((err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

//create and save multiple person objects
const createManyPeople = (arrayOfPeople, done) => {
  Person.create(arrayOfPeople, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

//find data
const findPeopleByName = (personName, done) => {
  Person.find({ name: personName }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

//find single record
const findOneByFood = (food, done) => {
  Person.findOne({ favoriteFoods: food }, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

//find data by id
const findPersonById = (personId, done) => {
  Person.findById(personId, (err, data) => {
    if (err) return done(err);
    done(null, data);
  });
};

//find, edit, and save data
const findEditThenSave = (personId, done) => {
  Person.findById(personId, (err, person) => {
    if (err) return done(err);
    //push new data
    person.favoriteFoods.push('hamburger');
    //save data
    person.save((err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    });
  });
};

const findAndUpdate = (personName, done) => {
  const ageToSet = 20;
  Person.findOneAndUpdate(
    { name: personName }, //search criteria
    { age: ageToSet }, //update to make
    { new: true }, //option to return updated document
    (err, updatedPerson) => {
      if (err) return done(err);
      done(null, updatedPerson);
    }
  );
};

//delete a record
const removeById = (personId, done) => {
  Person.findByIdAndRemove(personId, (err, removedPerson) => {
    if (err) return done(err);
    done(null, removedPerson);
  });
};

//delete many records
const removeManyPeople = (done) => {
  const nameToRemove = 'Mary';
  Person.remove({ name: nameToRemove }, (err, dataToRemove) => {
    if (err) return console.log(err);
    done(null, dataToRemove);
  });
};

//chain query handlers to refine results
const queryChain = (done) => {
  const foodToSearch = 'burrito';
  Person.find({ favoriteFoods: foodToSearch })
  .sort('name') //sort by name (1 for ascending, -1 for descending)
  .limit(2) //limit results to 2 documents
  .select(['name', 'favouriteFoods']) //exclude the age field
  .exec((err, data) => { //execute the query
    if (err) return console.log(err);
    done(err, data);
  });
};

/** **Well Done !!**
/* You completed these challenges, let's go celebrate !
 */

//----- **DO NOT EDIT BELOW THIS LINE** ----------------------------------

exports.PersonModel = Person;
exports.createAndSavePerson = createAndSavePerson;
exports.findPeopleByName = findPeopleByName;
exports.findOneByFood = findOneByFood;
exports.findPersonById = findPersonById;
exports.findEditThenSave = findEditThenSave;
exports.findAndUpdate = findAndUpdate;
exports.createManyPeople = createManyPeople;
exports.removeById = removeById;
exports.removeManyPeople = removeManyPeople;
exports.queryChain = queryChain;
