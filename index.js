/**
 * Modules dependencies
 */

var through = require('through')

/** 
 * Factory of the `ObjectMapperStream`
 */

exports.createStream = function(options){
	return new ObjectMapperStream(options);
}

/**
 * Expose bag object containing all formats method available to use.
 */

exports.format = {};

/**
 * Contructor of `ObjectMapperStream`
 *
 * @param {Object} options - set of options to customize the behavior of the mapper
 * @param {Object} options.map - set of keys with their relation and options
 * @param {Object} options.map.key - `key` of the relationship, `key` could be anything
 * @param {String} options.map.key.to - new name of the key
 * @param {String} options.map.key.bydefault - default value of the new key
 * @param {Boolean} options.map.key.common - previous value should be used if current value is empty
 * @param {String} options.map.key.format - name of the function to apply on the value found
 *
 */

function ObjectMapperStream(options){
	var self = this;
	this.options = options;
	this.map = options.map;
	this.commons = {};
	this.keys = Object.keys(this.map);
	function write(data){
		if(typeof data !== 'object') return console.error('skip this write call, `data` written is not an Object');
		var newData = {};
		self.keys.forEach(function(key){
			var newKey = self.map[key]['to'];
			if(!newKey) return newData[self.map[key]] = data[key];
			
			newData[newKey] = data[key];

			standardize(key,newKey);
		});

		// Second pass to take care of the `copy` options
		self.keys.forEach(function(key){
			var copy = self.map[key]['copy'];
			if(!copy) return;

			var newKey = self.map[key]['to'];
			var copyKeys = copy.split(',');
			newData[newKey] = '';
			copyKeys.forEach(function(copyKey){
				newData[newKey] += newData[copyKey]
			});

			standardize(key,newKey);
		});

		function standardize(key,newKey){
			var common = self.map[key]['common'];
			var defaultValue = self.map[key]['bydefault'];
			var format = self.map[key]['format'] && exports.format[self.map[key]['format']];
			if(!newData[newKey] && defaultValue) newData[newKey] = defaultValue;
			if(newData[newKey] && common) self.map[key]['bydefault'] = newData[newKey];
			if(newData[newKey] && format) newData[newKey] = format(newData[newKey]);	
		}

		this.emit('data', newData);
	}	
	return through(write);
}
