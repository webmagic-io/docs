### 4.5 Jsoup和Xsoup

WebMagic的抽取主要用到了[Jsoup](http://jsoup.org/)和我自己开发的工具[Xsoup](https://github.com/code4craft/xsoup)。

#### 4.5.1 Jsoup

Jsoup是一个简单的HTML解析器，同时它支持使用CSS选择器的方式查找元素。为了开发WebMagic，我对Jsoup的源码进行过详细的分析，具体文章参见[Jsoup学习笔记](https://github.com/code4craft/jsoup-learning)。

#### 4.5.2 Xsoup

[Xsoup](https://github.com/code4craft/xsoup)是我基于Jsoup开发的一款XPath解析器。

之前WebMagic使用的解析器是[HtmlCleaner](http://htmlcleaner.sourceforge.net/)，使用过程存在一些问题。主要问题是XPath出错定位不准确，并且其不太合理的代码结构，也难以进行定制。最终我自己实现了Xsoup，使得更加符合爬虫开发的需要。令人欣喜的是，经过测试，Xsoup的性能比HtmlCleaner要快一倍以上。

Xsoup发展到现在，已经支持爬虫常用的语法，以下是一些已支持的语法对照表：

<table>
    <tr>
        <td>Name</td>
        <td>Expression</td>
        <td>Support</td>
    </tr>
    <tr>
        <td>nodename</td>
        <td>nodename</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>immediate parent</td>
        <td>/</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>parent</td>
        <td>//</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>attribute</td>
        <td>[@key=value]</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>nth child</td>
        <td>tag[n]</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>attribute</td>
        <td>/@key</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>wildcard in tagname</td>
        <td>/*</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>wildcard in attribute</td>
        <td>/[@*]</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>function</td>
        <td>function()</td>
        <td>part</td>
    </tr>
    <tr>
        <td>or</td>
        <td>a | b</td>
        <td>yes since 0.2.0</td>
    </tr>
    <tr>
        <td>parent in path</td>
        <td>. or ..</td>
        <td>no</td>
    </tr>
    <tr>
        <td>predicates</td>
        <td>price>35</td>
        <td>no</td>
    </tr>
    <tr>
        <td>predicates logic</td>
        <td>@class=a or @class=b</td>
        <td>yes since 0.2.0</td>
    </tr>
</table>

另外我自己定义了几个对于爬虫来说，很方便的XPath函数。但是请注意，这些函数式标准XPath没有的。

| Expression	| Description |	XPath1.0 |
| -------- | ------- | ------- |
| text(n)| 第n个直接文本子节点，为0表示所有|	text() only|
|allText()	| 所有的直接和间接文本子节点	| not support|
|tidyText()	| 所有的直接和间接文本子节点，并将一些标签替换为换行，使纯文本显示更整洁 |	not support |
| html()	| 内部html，不包括标签的html本身 |	not support |
| outerHtml() |	内部html，包括标签的html本身|	not support
|regex(@attr,expr,group) | 这里@attr和group均可选，默认是group0|	not support

#### 4.5.3 Saxon

Saxon是一个强大的XPath解析器，支持XPath 2.0语法。`webmagic-saxon`是对Saxon尝试性的一个整合，但是目前看来，XPath 2.0的高级语法，似乎在爬虫开发中使用者并不多。