### 4.4 抽取工具简介

WebMagic的抽取主要用到了[`Jsoup`](http://jsoup.org/)和我自己开发的工具[`Xsoup`](https://github.com/code4craft/xsoup)。

#### 4.4.1 Jsoup

Jsoup是一个简单的HTML解析器，同时它支持使用CSS选择器的方式查找元素。为了开发WebMagic，我对Jsoup的源码进行过详细的分析，具体文章参见[Jsoup学习笔记](https://github.com/code4craft/jsoup-learning)。

#### 4.4.2 Xsoup

[Xsoup](https://github.com/code4craft/xsoup)是我基于Jsoup开发的一款XPath解析器。

之前WebMagic使用的解析器是[`HtmlCleaner`](http://htmlcleaner.sourceforge.net/)，使用过程存在一些问题。主要问题是XPath出错定位不准确，并且其不太合理的代码结构，也难以进行定制。最终我自己实现了Xsoup，使得更加符合爬虫开发的需要。令人欣喜的是，经过测试，Xsoup的性能比HtmlCleaner要快一倍以上。

Xsoup发展到现在，已经支持爬虫常用的语法，以下是一些已支持的语法对照表：

| Name	 | Expression	| Support|
| ------------ | ---------|--|
|nodename	| nodename |yes |
|immediate parent |	/ |	yes|
|parent	| //	|yes|
|attribute |	[@key=value] |	yes|
|nth child |	tag[n]	 |yes |
| attribute |	/@key |	yes |
|wildcard in tagname	| /*	 | yes|
| wildcard in attribute|	/[@*]	| yes
|function |	function()	| yes |
| or |	a \| b	 | yes since 0.2.0
| parent in path |	. or .. |	no |
| predicates	| price>35 |	no |
|predicates logic |	@class=a or @class=b |	yes since 0.2.0|

另外我自己定义了几个对于爬虫来说，很方便的XPath函数：

| Expression	| Description |	XPath1.0 |
| ------------ | ---------|--|
| text(n)|	nth text content of element(0 for all)|	text() only|
|allText()	| text including children	| not support|
|tidyText()	| text including children, well formatted |	not support |
| html()	| innerhtml of element |	not support |
| outerHtml() |	outerHtml of element|	not support
|regex(@attr,expr,group) | use regex to extract content|	not support

#### 4.4.3 Saxon

Saxon是一个强大的XPath解析器，支持XPath 2.0语法。`webmagic-saxon`是对Saxon尝试性的一个整合，但是目前看来，因为XPath 2.0的复杂性，这个功能的使用者并不多。