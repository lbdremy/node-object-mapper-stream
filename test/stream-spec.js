/** 
 * Modules dependencies
 */

var spec = require('stream-spec'),
	tester = require('stream-tester'),
	mapper = require('./../');

var options = {
	map : {
		key1 : { to : 'key1plus', bydefault : 'defaultValue', common : true , format : 'nameOftheFunction'},
		key2 : { to : 'key2plus', bydefault : 'defaultValue', common : true , format : 'nameOftheFunction'}
	}
};

var stream = mapper.createStream(options);

spec(stream)
	.through({ strict : true , error : false })
	.validateOnExit();

tester.createRandomStream(function(){
	var id = Math.random();
	return { id : id, title : 'title' + id, description : 'description' + id};
},1000)
	.pipe(stream)
	.pipe(tester.createPauseStream());