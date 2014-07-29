var text = '안드로이드 백그라운 알림 {width:320px}';

text = text.replace(/{(.+?)}/g, function (a, b, c, d) {
  console.log(a);
  console.log(b);
  console.log(c);
  console.log(d);
  return ''
});


console.log(text);

var rex=/w/
console.log(text.search(rex));