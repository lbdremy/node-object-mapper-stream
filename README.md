# object-mapper-stream - 

map an object against a desired object and apply some transformations in a stream context

[![](http://travis-ci.org/lbdremy/node-object-mapper-stream.png)](http://travis-ci.org/#!/lbdremy/node-object-mapper-stream)

## Install

Not yet available in npm

## Usage

```js
/**
 * Module dependencies
 */

var objectMapper = require('object-mapper-stream'),
	tester = require('tester-stream'),
	crypto = require('crypto');

mapper.format.createMD5Hash = function(s){
	return crypto.createHash('md5').update(s,'utf-8').digest('hex');
}
var options = {
	map : {
		id : { to : 'newID', format : 'createMD5Hash', bydefault : '00000'},
		title : { to : 'customTitle' , bydefault : 'noTitle'}
	}
};
var objectMapperStream = objectMapper.createStream(options);

tester.createRandomStream(function(){
	var id = 'azerty';	
	return { id : id , title : 'title' + id};
},1)
	.pipe(objectMapperStream)
	.on('data',function(data){
		// Output { newID : 'ab4f63f9ac65152575886860dde480a1', customTitle : 'titleazerty'}
		console.log(data);
	})
	.on('end',function(){
		console.log('end!');
	});
```

## Test

```sh
npm test
```

## Licence

(The MIT License)

Copyright (c) 2012 HipSnip Limited

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the 'Software'), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.