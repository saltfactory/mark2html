mark2html
=========

> Markdown to HTML.

### **mark2html** features
- using .json option file
- copy image files in .markdown file
- from image src to datauri in .markdown file

**mark2html**은 Markdown 문서를 HTML 문서로 변환시켜서 저장할 수 있게 도와준다. mark2html은 markdown에 포함된 images를 일괄적으로 복사하거나 datauri로 변환해서 렌더링을 할 수 있다.

### **mark2html**의 특징
- .json 옵션 파일을 사용
- .markdown 파일 안에 있는 img를 HTML이 변환되는 곳에 images 파일로 복사
- .markdown 파일 안에 있는 img의 src를 datauri로 변환


mark2html 설치
=============

## global 설치

`mark2html`은 npm을 사용하여 간단하게 설치할 수 있다. mark2html을 global로 설치하면 터미널에서 mark2html 명령어를 사용할 수 있다.

```
npm install -g mark2html
```

### mark2html 명령어 옵션

| 옵션 | 옵션 값 | 비고 |
|-----|-------|-----|
| -s / -src | .markdown 파일의 경로 지정 ||
| -d / -dest | 결과물이 만들어질 디렉토리 경로 지정||
| -cfg | 옵션 파일 경로 지정 ||
| -opt | 옵션을 JSON 타입으로 지정 ||
| -md | 값 없이 옵션만 지정| .markdown 파일 dest로 복사|
| -img | 값 없이 옵션만 지정| .markdown 파일 내용에 포함된 이미지를 dest로 함께 복사|
| -datauri | 값 없이 옵션만 지정 | .markdown 파일에 포함된 이미지를 datauri로 변경하여 HTML에 적용 |
| -mdatauri | 값 없이 옵션만 지정 | .markdown 파일에 포함된 이미지를 datauri로 변경하여 복사되는 .md 파일에 적용 |
| -code | 0:ignore, 1:pygments, 2:highlight.js| .markdown 파일에 포함된 소스코드 블럭의 코드를 하이라이팅하기 위한 HTML 코드로 변한 | 
| -style | 값 없이 옵션만 지정 | .markdown 파일의 image의 alert에 style 속성을 분석해서 적용|



#### `-s` 옵션 예제
```
mark2html -s /Users/saltfactory/blog/2014-07-16-example.md
```
```
mark2html -src /Users/saltfactory/blog/2014-07-16-example.md
```

#### `-d` 옵션 예제
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output
```
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -dest /User/saltfactory/blog/output
```

#### `-cfg` 옵션 예제

-cfg 옵션을 사용하면 여러가지 옵션 설정은 저장해서 불러와서 사용할 수 있다.

1. 먼저 옵션정보를 .json 파일로 만든다.
2. -cfg 옵션을 사용하여 생성한 .json 파일의 경로를 추가한다.

```
echo '{
	"destDir": "/Users/saltfactory/blog/output",
	"imageCopy":true,
	"datauri":true,
	"markdownCopy":true,
	"markdownDatauri":false
}' > options.json
```
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md  -cfg options.json
```

#### `-opt` 옵션 예제
```
makr2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md \
-d /User/saltfactory/blog/output \
-opt '{ \
	"destDir": "/Users/saltfactory/blog/output", \
	"imageCopy":true, \
	"datauri":true, \
	"markdownCopy":true, \
	"markdownDatauri":false \
	}'
```

#### `-md` 옵션 예제
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -md
```

#### `-img` 옵션 예제
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -img
```

#### `-datauri` 옵션 예제
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -datauri
```

#### `-mdatauri` 옵션 예제
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -mdatauri
```

#### `-code` 옵션 예제
`-code` 디폴트값은 1 (pygments)이다. `-code` 옵션이 있으면 기본적으로 pygments를 사용해서 코드하이라이팅을 한다.
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -code
```

`-code` 값이 1일 경우 pygments([node-pygmentize-bundled](https://github.com/rvagg/node-pygmentize-bundled))를 사용해서 코드하이라이팅을 한다.
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -code 1
```
pygments의 style은 [pygments-css](https://github.com/richleland/pygments-css)에서 필요한 css를 선택하여 사용한다.


`-code` 값이 2일 경우 [highlgiht.js](https://github.com/isagalaev/highlight.js)를 사용해서 코드하이라이팅을 한다.
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -code 2
```

#### `-style` 옵션 예제
Markdown 문서에 이미지 마커중 alt의 값에 들어있는 `{}`값을 HTML로 변환할 때 `img` 태그의 `style` 값으로 변환한다.

만약 Markdown 문서에 다음과 같이 이미지를 표현했다고 보자
```markdown
![Alt {width:320px;}](http://http://cfile8.uf.tistory.com/image/276B443353A1528A2F8CBA "Title")
```
`-style` 옵션을 추가하여 렌더링
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -style
```
HTML 변환 결과
```html
<img src="http://cfile8.uf.tistory.com/image/276B443353A1528A2F8CBA" style="width:320px;" alt="Alt" title="Title"/>
```

## local 모듈 설치
`mark2html` 명령어는 사용하지 않고 node.js의 모듈로 사용하기 위해서는 **-g** 옵션을 제외하고 node 프로젝트 디렉토리 안에서 다음과 같이 설치한다.

```
npm install mark2html
```

#### node.js 모듈로 사용하는 예제
```javascript
var mark2html = require('mark2html');

var options = {
  src:'/Users/saltfactory/blog/posts/2014-07-16-example.md',
  destDir:'/Users/saltfactory/blog/output',
  imageCopy:true,
  datauri:true,
  markdownCopy:true,
  markdownDatauri:false,
  marked:{
    gfm: true,
    tables: true,
    breaks: false,
    pedantic: false,
    sanitize: true,
    smartLists: true,
    smartypants: false,
    xhtml: true
  }
};

mark2html.convert(options);

```

## $HOME/.mark2html.json 글로벌 설정 파일
`.mark2html.json`은 **mark2html**의 글로벌 설정 파일로 `$HOME` 디렉토리 밑에 위치한다. `mark2html`의 command 명령어는 `~/.mark2html.json` 파일의 옵션을 로드 한 후 동작한다.
글로벌 설정 파일을 로드하더라도 command 옵션이 추가가되면 글로벌 설정 파일의 옵션을 갱신해서 command 옵션 값을 우선으로 한다. local 모듈로 설치를 하더라도 글로벌 설정파일을 사용할 수 있다.

```
echo '{
	"destDir": "/Users/saltfactory/blog/output",
	"imageCopy":true,
	"datauri":true,
	"markdownCopy":true,
	"markdownDatauri":false,
}' > ~/.mark2html.json
```

Copyright and License
=====================

The MIT License (MIT)

Copyright (c) 2014 SungKwang Song

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
