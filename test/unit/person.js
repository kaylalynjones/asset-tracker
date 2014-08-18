/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect,
    Person    = require('../../app/models/person'),
    dbConnect = require('../../app/lib/mongodb'),
    cp        = require('child_process'),
    Mongo     = require('mongodb'),
    db        = 'asset-tracker-test';

describe('Person', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/clean-db.sh', [db], {cwd:__dirname + '/../scripts'}, function(err, stdout, stderr){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Person object', function(){
      var a = {name:'Sandra Collinsworth', photo:'http://d1zvlllbcin35p.cloudfront.net/t/2014/07/10/20140710155849464226.jpg', cash:6000.60},
          p = new Person(a);
      expect(p).to.be.instanceof(Person);
      expect(p).to.be.okay;
      expect(p.cash).to.equal(6000.60);
    });
  });

  describe('.all', function(){
    it('should get all people', function(done){
      Person.all(function(people){
        expect(people).to.have.length(3);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a person by their id', function(done){
      var id = '000000000000000000000001';
      Person.findById(id, function(person){
        expect(person).to.not.be.null;
        expect(person).to.be.instanceof(Person);
        done();
      });
    });
  });

  describe('#save', function(){
    it('should save an object to the database', function(done){
      var a = {name:'Sandra Collinsworth', photo:'http://d1zvlllbcin35p.cloudfront.net/t/2014/07/10/20140710155849464226.jpg', cash:6000.60},
          person = new Person(a);
      person.save(function(err){
        expect(person._id).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('#addAsset', function(){
    it('should add an asset to the person', function(done){
      var id  = '000000000000000000000002',
          obj = {name:'House', photo:'http://ind.ccio.co/s6/b6/6A/130815564145788219EB0nqwi6c.jpg', count:1, value:140000};
      Person.findById(id, function(person){
        person.addAsset(obj);
        expect(person.assets).to.have.length(4);
        expect(person._assetTotal).to.equal(165000);
        done();
      });
    });
  });

  describe('#destroy', function(){
    it('should delete a person from the database', function(done){
      var id  = '000000000000000000000003';
      Person.findById(id, function(person){
        person.destroy(function(){
          Person.findById(id, function(person){
            expect(person).to.be.a('null');
            expect(person).to.not.be.instanceof(Person);
            done();
          });
        });
      });
    });
  });

});

