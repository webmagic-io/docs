### 4.5 Introduction extraction tools

WebMagic extraction main use of the [Jsoup](http://jsoup.org/) and my own development tools [Xsoup](https://github.com/code4craft/xsoup).

#### 4.5.1 Jsoup

Jsoup is a simple HTML parser, and it supports the use of CSS selectors way to find elements. In order to develop WebMagic, I Jsoup source conducted a detailed analysis of specific articles see [Jsoup study notes](https://github.com/code4craft/jsoup-learning).

#### 4.5.2 Xsoup

[Xsoup](https://github.com/code4craft/xsoup) is based Jsoup I developed an XPath parser.

Before using the parser WebMagic [HtmlCleaner](http://htmlcleaner.sourceforge.net/), there are some problems during use. The main problem is XPath error position is not accurate, and it is not reasonable code structure, it is difficult to customize. I finally realized Xsoup, making it necessary to develop more in line with crawlers. It is gratifying, tested, Xsoup performance than HtmlCleaner faster than doubled.

Xsoup development up to now, has been supported crawler common syntax, the following are some of them have supported syntax table:

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

Also my own definition for several crawlers, it is very convenient XPath functions. Note, however, these functions are not XPath standards.

| Expression | Description | XPath1.0 |
| -------- | ------- | ------- |
| text(n)| n-th child node text directly and 0 for all  |	text() only|
|allText()	| all direct and indirect text child	| not support|
|tidyText()	| all direct and indirect child nodes text, and replace some of the labels wrap, so plain text display cleaner |	not support |
| html()	| internal html, html tag does not include itself |	not support |
| outerHtml() |	internal html, including tags html itself |	not support
|regex(@attr,expr,group) | @attr here and can be selected from the group, the default is group0 |	not support

#### 4.5.3 Saxon

Saxon is a powerful parser XPath support XPath 2.0 syntax. `Webmagic-saxon` integration of Saxon is a tentative, but now it seems, XPath 2.0's advanced grammar, it seems that users are not many crawlers development.
