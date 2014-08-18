'use strict';

var Mongo = require('mongodb'),
    _     = require('lodash');

function Person(obj){
  this.name   = obj.name;
  this.photo  = obj.photo;
  this.cash   = parseFloat(obj.cash);
  this.assets = [];
  this._assetTotal = 0;
}

Object.defineProperty(Person, 'collection', {
  get: function(){return global.mongodb.collection('people');}
});

Person.all = function(cb){
  Person.collection.find().toArray(function(err, results){
    var people = results.map(function(person){
      return changePrototype(person);
    });
    cb(people);
  });
};

Person.findById = function(id, cb){

  var _id = Mongo.ObjectID(id);
  Person.collection.findOne({_id:_id}, function(err, result){
    if(result === null){ cb(null); return; }
    var person = changePrototype(result);
    cb(person);
  });
};

Person.prototype.save = function(cb){
  Person.collection.save(this, cb);
};

Person.prototype.addAsset = function(obj){
  var asset = {
    name: obj.name,
    photo: obj.photo,
    count: obj.count,
    value: parseFloat(obj.value)
  };
  if (typeof(this.assets) === 'undefined'){
    this.assets = [];
  }
  this._assetTotal += asset.value * asset.count;
  this.assets.push(asset);
};

Person.prototype.destroy = function(cb){
  Person.collection.remove(this, cb);
};

//private function
function changePrototype(obj){
  var people = _.create(Person.prototype, obj);
  return people;
}

module.exports = Person;

