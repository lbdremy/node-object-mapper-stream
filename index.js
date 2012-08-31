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
 * Expose object containing all formats method available/use.
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
	var keys = Object.keys(this.map);
	function write(data){
		if(typeof data !== 'object') return console.error('skip this write call, `data` written is not an Object');
		var newData = {};
		keys.forEach(function(key){
			var value = data[key];
			var newKey = self.map[key].to || self.map[key];
			var format = exports.format[self.map[key].format];
			if(value && format) return newData[newKey]  = format(value);
			if(value) newData[newKey] = value;
			var common = self.map[key].common;
			if(common && value) return self.commons[key] = value;
			if(common && !value) return newData[newKey] = self.commons[key];
			var bydefault = self.map[key].bydefault;
			if(bydefault) return newData[newKey] = bydefault;
			return newData[newKey] = value;
		});
		this.emit('data', newData);
	}	
	return through(write);
}
