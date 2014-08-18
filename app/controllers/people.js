'use strict';

var Person = require('../models/person');

exports.init = function(req, res){
  res.render('people/init');
};

exports.addPerson = function(req, res){
  var person = new Person(req.body);
  person.save(function(){
    res.redirect('/people');
  });
};

exports.index = function(req, res){
  Person.all(function(people){
    res.render('people/index', {people:people});
  });
};

exports.show = function(req, res){
  Person.findById(req.params.id, function(person){
    res.render('people/show', {person:person});
  });
};

exports.destroy = function(req, res){
  Person.findById(req.params.id, function(person){
    person.destroy(function(){
      res.redirect('/people');
    });
  });
};

exports.initAsset = function(req, res){
  res.render('people/init-item', {id:req.params.id});
};

exports.addAsset = function(req, res){
  Person.findById(req.params.id, function(person){
    person.addAsset(req.body.asset);
    person.save(function(){
      res.redirect('/people/' + req.params.id);
    });
  });
};
