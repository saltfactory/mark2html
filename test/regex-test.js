//var text = '안드로이드 백그라운 알림 {width:320px}';
//
//text = text.replace(/{(.+?)}/g, function (a, b, c, d) {
//  console.log(a);
//  console.log(b);
//  console.log(c);
//  console.log(d);
//  return ''
//});
//
//
//console.log(text);
//
//var rex=/w/
//console.log(text.search(rex));

//var Gallery3 = require('node-gallery3')
//var gallery3 = new Gallery3();
//gallery3.upload


var text = '<p><img src="./images/test.png" alt="naver" style="with:82px"/><img src="http://test.net"/><img src="https://abc.net"/><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==" alt="Red dot" /></p>';
var pattern =
  ///(<img[^>]+src=")([^">]+)(")/g
  ///<img[^>]+src="?([^"\s]+)"?\s*\/>/g;
/(<img *src=")(?!http|data)(.*?)(")/g
text = text.replace(pattern, function (a, b, c, d) {
  console.log('a:'+ a);
  console.log('b:'+b);
  console.log('c:'+ c);
  console.log('d:' + d);
  return b + 'replace'+d;
});


console.log("output:" + text);