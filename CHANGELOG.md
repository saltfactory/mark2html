0.0.4
=====
## feature
- **add -style option** : image style attribute from image alt of Markdown

from markdown
```markdown
![Alt {width:320px;}](http://http://cfile8.uf.tistory.com/image/276B443353A1528A2F8CBA "Title")
```
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -style
```
after rendering
```html
<img src="http://cfile8.uf.tistory.com/image/276B443353A1528A2F8CBA" style="width:320px;" alt="Alt" title="Title"/>
```

0.0.3
======

## bug Fixes
- **file creation** : async file creation problems [#1](https://github.com/saltfactory/mark2html/issues/1)

## feature

- **copy .md file with datauri** : copy `.md` file with encoding image ***datauri***, global command option is `-mdatauri`
```
mark2html -s /Users/saltfactory/blog/posts/2014-07-16-example.md -d /User/saltfactory/blog/output -mdatauri
```
