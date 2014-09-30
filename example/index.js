var spawn = require('child_process').spawn;
var proc = spawn('ffmpeg', [
  '-i',
  'sample.mov',
  '-ss',
  '00:00:00',
  '-f',
  'image2',
  '-vf',
  'fps=1/5',
  '-q',
  '31',
  '-vframes',
  '10',
  '-updatefirst',
  '1',
  '-'
]);

var JPEGStream = require('..');
var parser = new JPEGStream;

proc.stdout.pipe(parser).on('data', function(buf) {
  console.log('JPEG!');
});

proc.stdout.on('end', function(){
  console.log('\nFound %d JPEGs', parser.count);
});
