/**
 * Modules dependencies
 */

var mocha = require('mocha'),
	assert = require('chai').assert,
	libPath = process.env['MAPPER_STREAM_COV'] ? '../lib-cov' : '../lib';
	mapper = require( libPath + '/../'),
	tester = require('stream-tester');

describe('ObjectMapperStream',function(){
	describe('#write()',function(){
		it('should emit `data` event with the right data',function(done){
			var options = {
				map : {
					id : { to : 'newID' },
					title : { to : 'newTitle'},
					description : 'newDescription'
				}
			};
			var stream = mapper.createStream(options);
			tester.createRandomStream(function(){
				var id = Math.random();
				var o = { id : id , title : 'title' + id , description : 'description' + id}
				return o;
			},10)
				.pipe(stream)
				.on('data',function(data){
					assert.isObject(data);
					assert.isNotNull(data.newID);
					assert.isNotNull(data.newTitle);
					assert.isNotNull(data.newDescription);
					var id = data.newID;
					assert.deepEqual(data , { newID : id, newTitle : 'title'+ id, newDescription : 'description'+ id});
				})
				.on('end',done);
		});
		it('should emit `data` events with the right data by applying the `bydefault` option.',function(done){
			var options = {
				map : {
					id : { to : 'newID', bydefault : 0},
					title : { to : 'newTitle' , bydefault : 'defaultTitle' },
				}
			};
			var stream = mapper.createStream(options);
			tester.createRandomStream(function(){
				var id = Math.random();
				var o = { id : id , title : ''}
				return o;
			},10)
				.pipe(stream)
				.on('data',function(data){
					assert.isObject(data);
					assert.isNotNull(data.newID);
					assert.isNotNull(data.newTitle);
					var id = data.newID;
					assert.notEqual(id, 0);
					assert.deepEqual(data , { newID : id, newTitle : 'defaultTitle'});
				})
				.on('end',done);
		});
		it('should emit `data` events with the right data by applying the `common` option',function(done){
			var options = {
				map : {
					id : { to : 'newID', common : false },
					title : { to : 'newTitle', common : true}
				}
			};
			var stream = mapper.createStream(options);
			var first = true;
			tester.createRandomStream(function(){
				var id = Math.random();
				var o = { id : id , title : first ? 'commonTitle' : ''}
				first = false;
				return o;
			},10)
				.pipe(stream)
				.on('data',function(data){
					assert.isObject(data);
					assert.isNotNull(data.newID);
					assert.isNotNull(data.newTitle);
					var id = data.newID;
					assert.deepEqual(data , { newID : id, newTitle : 'commonTitle'});
				})
				.on('end',done);
		});
		it('should emit `data` events with the right data by applying the `format` option.',function(done){
			var options = {
				map : {
					id : { to : 'newID' , format : 'createMD5Hash'},
					title : { to : 'newTitle'}
				}
			};
			// Extend the format Object expose by `mapper`.
			mapper.format.createMD5Hash = function(s){
				var crypto = require('crypto');
				return crypto.createHash('md5').update(s.toString(),'utf-8').digest('hex');
			}
			var stream = mapper.createStream(options);
			tester.createRandomStream(function(){
				var o = { id : '0' , title : 'title'}
				return o;
			},10)
				.pipe(stream)
				.on('data',function(data){
					assert.isObject(data);
					assert.isNotNull(data.newID);
					assert.isNotNull(data.newTitle);
					assert.deepEqual(data , { newID : 'cfcd208495d565ef66e7dff9f98764da', newTitle : 'title'});
				})
				.on('end',done);
		});
		it('should emit `data` events with the right data by applying the `copy` option.',function(done){
			var options = {
				map : {
					id : { to : 'newID'},
					title : { to : 'newTitle'},
					description : { to : 'newDescription' , copy : 'newID,newTitle'}
				}
			};
			var stream = mapper.createStream(options);
			tester.createRandomStream(function(){
				var o = { id : 0 , title : 'title'}
				return o;
			},10)
				.pipe(stream)
				.on('data',function(data){
					assert.isObject(data);
					assert.isNotNull(data.newID);
					assert.isNotNull(data.newTitle);
					assert.isNotNull(data.newDescription);
					assert.deepEqual(data , { newID : 0, newTitle : 'title' , newDescription : '0title'});
				})
				.on('end',done);
		});
		it('should emit `data` events with the right data by applying the `copy` and `format` options.',function(done){
			var options = {
				map : {
					id : { to : 'newID' , format :'createMD5Hash'},
					title : { to : 'newTitle'},
					description : { to : 'newDescription' , copy : 'newID,newTitle' , format :'createMD5Hash'}
				}
			};
			// Extend the format Object expose by `mapper`.
			mapper.format.createMD5Hash = function(s){
				var crypto = require('crypto');
				return crypto.createHash('md5').update(s.toString(),'utf-8').digest('hex');
			}
			var stream = mapper.createStream(options);
			tester.createRandomStream(function(){
				var o = { id : '0' , title : 'title'}
				return o;
			},10)
				.pipe(stream)
				.on('data',function(data){
					assert.isObject(data);
					assert.isNotNull(data.newID);
					assert.isNotNull(data.newTitle);
					assert.isNotNull(data.newDescription);
					assert.deepEqual(data , { newID : 'cfcd208495d565ef66e7dff9f98764da', newTitle : 'title' , newDescription : 'eabcfd6054d4267bd5f83ba06a0e5540'});
				})
				.on('end',done);
		});
	});
});