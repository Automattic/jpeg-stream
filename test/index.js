var JPEGStream = require('..');
var assert = require('assert');
var fs = require('fs');
var j1 = read('1.jpg');
var j2 = read('2.jpg');

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

  it('should transform 2 jpegs', function(done){
    var parser = new JPEGStream;

    parser.on('data', function(jpeg){
      assert(jpeg instanceof Buffer);
      if (1 == parser.count) {
        assert(jpeg.length == j1.length);
      } else if (2 == parser.count) {
        assert(jpeg.length == j2.length);

        done();
      }
    });

    parser.write(j1.slice(0,100));
    parser.write(j1.slice(100));
    parser.write(j2.slice(0,100));
    parser.write(j2.slice(100));
  });

  it('should not transform jpeg without proper end', function(done){
    var parser = new JPEGStream;
    parser.write(j1.slice(0, 100));
    parser.on('data', function(){
      throw new Error('Unexpected');
    });
    process.nextTick(function(){
      assert(0 == parser.count);
      done();
    });
  });

  it('should not transform jpeg without proper beginning', function(done){
    var parser = new JPEGStream;
    try {
      parser.write(j1.slice(10));
      parser.on('data', function () {
        throw new Error('Unexpected');
      });
    } catch (error) {
      assert(0 == parser.count);

      done();
    }
  });

  it('should not transform mixed up jpegs', function(done){
    var parser = new JPEGStream;

    parser.once('data', function(jpeg) {
      assert(jpeg instanceof Buffer);
      assert(0 == parser.count);

        parser.once('data', function (jpeg2) {
          throw new Error('Unexpected');
        });
    });

    parser.write(j1.slice(0,100));
    try {
      parser.write(j2.slice(0,100));
      parser.write(j1.slice(100));
      parser.write(j2.slice(100));
    } catch (error) {
      assert(0 == parser.count);

      done();
    }
  });
});

function read(name){
  return fs.readFileSync(__dirname + '/' + name);
}
