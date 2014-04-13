### 列表+详情的基本页面组合

我们先从一个最简单的例子入手。这个例子里，我们有一个列表页，这个列表页以分页的形式展现，我们可以遍历这些分页找到所有目标页面。

#### 1 示例介绍

这里我们以作者的新浪博客[http://blog.sina.com.cn/flashsword20](http://blog.sina.com.cn/flashsword20)作为例子。在这个例子里，我们要从最终的博客文章页面，抓取博客的标题、内容、日期等信息，也要从列表页抓取博客的链接等信息，从而获取这个博客的所有文章。

* 列表页

	列表页的格式是“http://blog.sina.com.cn/s/articlelist_1487828712_0_1.html“， 其中“0_1”中的“1”是可变的页数。
	
	![列表页](http://static.oschina.net/uploads/space/2014/0412/193620_Hr9E_190591.png)

* 文章页

	文章页的格式是“http://blog.sina.com.cn/s/blog_58ae76e80100g8au.html”， 其中“58ae76e80100g8au”是可变的字符。

	![文章页](http://static.oschina.net/uploads/space/2014/0412/193102_ZleC_190591.png)

#### 2 发现文章URL

在这个爬虫需求中，文章URL是我们最终关心的，所以如何发现这个博客中所有的文章地址，是爬虫的第一步。

我们可以使用正则表达式`http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html`对URL进行一次粗略过滤。这里比较复杂的是，这个URL过于宽泛，可能会抓取到其他博客的信息，所以我们必须从列表页中指定的区域获取URL。

在这里，我们使用xpath`//div[@class=\\"articleList\\"]`选中所有区域，再使用links()或者xpath`//a/@href`获取所有链接，最后再使用正则表达式`http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html`，对URL进行过滤，去掉一些“编辑”或者“更多”之类的链接。于是，我们可以这样写：

```java
page.addTargetRequests(page.getHtml().xpath("//div[@class=\"articleList\"]").links().regex("http://blog\\.sina\\.com\\.cn/s/articlelist_1487828712_0_\\d+\\.html").all());
```

同时，我们需要把所有找到的列表页也加到待下载的URL中去：

```java
page.addTargetRequests(page.getHtml().links().regex("http://blog\\.sina\\.com\\.cn/s/articlelist_1487828712_0_\\d+\\.html").all());
```

#### 3 抽取内容

文章页面信息的抽取是比较简单的，写好对应的xpath抽取表达式就可以了。

```java
page.putField("title", page.getHtml().xpath("//div[@class='articalTitle']/h2"));
page.putField("content", page.getHtml().xpath("//div[@id='articlebody']//div[@class='articalContent']"));
page.putField("date",
        page.getHtml().xpath("//div[@id='articlebody']//span[@class='time SG_txtc']").regex("\\((.*)\\)"));
```

#### 4 区分列表和目标页

现在，我们已经定义了对列表和目标页进行处理的方式，现在我们需要在处理时对他们进行区分。在这个例子中，区分方式很简单，因为列表页和目标页在URL格式上是不同的，所以直接用URL区分就可以了！

```java
//列表页
if (page.getUrl().regex(URL_LIST).match()) {
    page.addTargetRequests(page.getHtml().xpath("//div[@class=\"articleList\"]").links().regex(URL_POST).all());
    page.addTargetRequests(page.getHtml().links().regex(URL_LIST).all());
    //文章页
} else {
    page.putField("title", page.getHtml().xpath("//div[@class='articalTitle']/h2"));
    page.putField("content", page.getHtml().xpath("//div[@id='articlebody']//div[@class='articalContent']"));
    page.putField("date",
            page.getHtml().xpath("//div[@id='articlebody']//span[@class='time SG_txtc']").regex("\\((.*)\\)"));
}
```

这个例子完整的代码请看[SinaBlogProcessor.java](https://github.com/code4craft/webmagic/blob/master/webmagic-samples/src/main/java/us/codecraft/webmagic/samples/SinaBlogProcessor.java)。

#### 5 总结

在这个例子中，我们的主要使用几个方法：

* 从页面指定位置发现链接，使用正则表达式来过滤链接.
* 在PageProcessor中处理两种页面，根据页面URL来区分需要如何处理。

有些朋友反应，用if-else来区分不同处理有些不方便[#issue83](https://github.com/code4craft/webmagic/issues/83)。WebMagic计划在将来的0.5.0版本中，加入[`SubPageProcessor`](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/handler/SubPageProcessor.java)来解决这个问题。