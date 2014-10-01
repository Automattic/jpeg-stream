
# jpeg-stream

Splits a stream of bytes representing JPEGs into individual images

## How to use

```js
var JPEGStream = require('jpeg-stream');
var spawn = require('child_process').spawn;
var proc = spawn('ffmpeg', [
  '-i',
  'test.mov',
  '-f',
  'image2',
  '-vframes',
  '5',
  '-'
]);
var parser = new JPEGStream;
proc.stdout.pipe(parser).on('data', function(buf){
  // each jpeg in its own `buf`
});
```

## License

MIT – Copyright (c) 2014 Automattic, Inc.
