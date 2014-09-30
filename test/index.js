
var JPEGStream = require('..');
var assert = require('assert');
var fs = require('fs');
var j1 = read('1.jpg');

describe('jpeg-stream', function(){
  it('should work', function(done){
    var parser = new JPEGStream;
    parser.on('data', function(jpeg){
      assert(jpeg instanceof Buffer);
      assert(jpeg.length == j1.length);
      done();
    });
    parser.write(j1.slice(0, 100));
    process.nextTick(function(){
      parser.write(j1.slice(100));
    });
  });

  it('should not transform partial jpegs', function(done){
    var parser = new JPEGStream;
    parser.write(j1.slice(0, 100));
    parser.on('data', function(){
      throw new Error('Unexpected');
    });
    process.nextTick(done);
  });
});

function read(name){
  return fs.readFileSync(__dirname + '/' + name);
}
