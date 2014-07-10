mark2html
=========

> Markdown to HTML

**mark2html**은 Markdown 문서를 HTML 문서로 변환시켜서 저장할 수 있게 도와준다. mark2html은 [marked]()를 사용하여 Markdown을 HTML으로 변환한다. 

## mark2html 설치
### global 설치 

`mark2html`은 npm을 사용하여 간단하게 설치할 수 있다.

```
npm install -g mark2html
```
### local 설치 
`mark2html` 명령어는 사용하지 않고 node.js의 모듈로 사용하기 위해서는 **-g** 옵션을 제외하고 node 프로젝트 디렉토리 안에서 다음과 같이 설치한다.

```
npm install mark2html
```

### ATOM 패키지 설치
`mark2html`은 ATOM editor의 패키지로 설치해서 사용할 수 있다. ATOM editor가 설치가 되어 있을 경우 터미널에서 다음 명령어로 설치가 가능하다. 

```
apm install mark2html
```


### .mark2html.json 파일 생성 
`.mark2html.json`은 **mark2html**의 글로벌 설정 파일로 `$HOME` 디렉토리 밑에 위치한다. `mark2html`의 command 명령어는 `~/.mark2html.json` 파일의 옵션을 로드 한 후 동작한다. 

```
echo '{
	destDir: "/output",	
	subDir: true
}' > ~/.mark2html.json
```
## option 파일 설정 
**mark2html**의 옵션 파일은 `~/.mark2html.json` 파일로 저장된다. `.mark2html.json` 파일에 들어갈 수 있는 옵션은 다음과 같다.
 
* **destDir** : *Markdown* 파일이 *HTML*로 변환되어 저장되는 디렉토리 경로를 지정한다. 이때, `destDir` 디렉토리 밑에 *Markdown* 파일의 이름과 동일한 디렉토리를 만들고 그 아래 *Markdown*과 동일한 이름.htlm 파일을 만든다.
	
	예) 2014-07-10-create-markdown-to-html.md 파일 변환하기. 
	
	```
echo '{
	destDir: "/output",	
	subDir: true
}' > ~/.mark2html.json
	```
	```
mark2html 2014-07-10-create-markdown-to-html.md 
	```	
	
	