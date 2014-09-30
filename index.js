var inherits = require('util').inherits;
var Transform = require('stream').Transform;

module.exports = JPEGStream;

function JPEGStream(){
  Transform.call(this);
  this.jpeg = null;
  this.count = 0;
  this.expectEnd = false;
  this.expectStart = false;
}

inherits(JPEGStream, Transform);

JPEGStream.prototype._transform = function(buf, enc, fn){
  for (var i = 0; i < buf.length; i++) {
    if (!this.jpeg) {
      if (0xff == buf[i]) {
        this.jpeg = [buf[i]];
        this.expectStart = true;
      }
    } else {
      this.jpeg.push(buf[i]);

      if (this.expectStart) {
        if (0xd8 == buf[i]) {
          this.expectStart = false;
          continue;
        }

        this.jpeg = null;

        if (!this.count) {
          return this.emit('error', new Error('Expected JPEG start'));
        }
      }

      if (this.expectEnd) {
        if (0xd9 == buf[i]) {
          var jpeg = new Buffer(this.jpeg);
          this.count++;
          this.push(jpeg);
          this.jpeg = null;
        } else if (0xd8 == buf[i]) {
          return this.emit('error', new Error('Expected JPEG end, but found start'));
        }

        this.expectEnd = false;
        continue;
      }

      if (0xff == buf[i]) {
        this.expectEnd = true;
      }
    }
  }

  fn();
};
