WebMagic使用说明-基本的爬虫
=========

本文是WebMagic文档的一部分。系列文章写完后，会整合到[WebMagic新版文档](http://my.oschina.net/flashsword/blog/193273)中。

## 3. 基本的爬虫

### 3.1 实现PageProcessor

在WebMagic里，实现一个基本的爬虫只需要编写一个类，实现`PageProcessor`接口即可。这个类基本上包含了抓取一个网站，你需要写的所有代码。

以之前的`GithubRepoPageProcessor`为例，我将PageProcessor的定制分为三个部分，分别是爬虫的配置、页面元素的抽取和链接的发现。

```java
public class GithubRepoPageProcessor implements PageProcessor {

    // 部分一：抓取网站的相关配置，包括编码、抓取间隔、重试次数等
    private Site site = Site.me().setRetryTimes(3).setSleepTime(1000);

    @Override
    // process是定制爬虫逻辑的核心接口，在这里编写抽取逻辑
    public void process(Page page) {
        // 部分二：定义如何抽取页面信息，并保存下来
        page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
        page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
        if (page.getResultItems().get("name") == null) {
            //skip this page
            page.setSkip(true);
        }
        page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));

        // 部分三：从页面发现后续的url地址来抓取
        page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    }

    @Override
    public Site getSite() {
        return site;
    }

    public static void main(String[] args) {

        Spider.create(new GithubRepoPageProcessor())
                //从"https://github.com/code4craft"开始抓
                .addUrl("https://github.com/code4craft")
                //开启5个线程抓取
                .thread(5)
                //启动爬虫
                .run();
    }
}
```

#### 3.1.1 爬虫的配置

第一部分关于爬虫的配置，包括编码、抓取间隔、超时时间、重试次数等，也包括一些模拟的参数，例如User Agent、cookie，以及代理的设置，我们会在第5章-“爬虫的配置”里进行介绍。在这里我们先简单设置一下：重试次数为3次，抓取间隔为一秒。

#### 3.1.2 页面元素的抽取

第二部分是爬虫的核心部分：对于下载到的Html页面，你如何从中抽取到你想要的信息？WebMagic里主要使用了三种抽取技术：XPath、正则表达式和CSS选择器。

1. XPath

	XPath本来是用于XML中获取元素的一种查询语言，但是用于Html也是比较方便的。例如：

	```java
	page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()")
	```
	这段代码使用了XPath，它的意思是“查找所有class属性为'entry-title public'的h1元素，并找到他的strong子节点的a子节点，并提取a节点的文本信息”。
对应的Html是这样子的：

	![xpath-html](http://static.oschina.net/uploads/space/2014/0404/104607_Aqq8_190591.png)

2. CSS选择器

	CSS选择器是与XPath类似的语言。如果大家做过前端开发，肯定知道$('h1.entry-title')这种写法的含义。客观的说，它比XPath写起来要简单一些，但是如果写复杂一点的抽取规则，就相对要麻烦一点。

3. 正则表达式

	正则表达式则是一种通用的文本抽取语言。
	
	```java
	page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
	```

	这段代码就用到了正则表达式，它表示匹配所有"https://github.com/code4craft/webmagic"这样的链接。

XPath、CSS选择器和正则表达式的具体用法会在第4章“抽取工具详解”中讲到。

#### 3.1.3 链接的发现

有了处理页面的逻辑，我们的爬虫就接近完工了！

但是现在还有一个问题：一个站点的页面是很多的，一开始我们不可能全部列举出来，于是如何发现后续的链接，是一个爬虫不可缺少的一部分。

```java
page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
```

这段代码的分为两部分，`page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all()`用于获取所有满足"(https://github\\.com/\\w+/\\w+)"这个正则表达式的链接，`page.addTargetRequests()`则将这些链接加入到待抓取的队列中去。

### 3.2 使用Selectable的链式API

`Selectable`相关的链式API是WebMagic的一个核心功能。使用Selectable接口，你可以直接完成页面元素的链式抽取，也无需去关心抽取的细节。

在刚才的例子中可以看到，page.getHtml()返回的是一个`Html`对象，它实现了`Selectable`接口。


