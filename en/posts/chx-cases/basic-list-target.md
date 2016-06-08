### List details the basic combination of page

We start with a simple example to start. For this example, we have a list of pages, this list tab page to show the form that we can traverse these tabs to find all the target page.

#### 1 Introduction example

Here we are with the author's Sina blog [http://blog.sina.com.cn/flashsword20](http://blog.sina.com.cn/flashsword20) as an example. In this example, we want the final blog page article, crawling blog title, content, date and other information, but also to crawl blog links and other information from the list of pages, in order to gain all articles of this blog.

* Page

	Page format is "http://blog.sina.com.cn/s/articlelist_1487828712_0_1.html", where "0_1" in the "1" is a variable number of pages.

	![Page](http://webmagic.qiniudn.com/oscimages/193620_Hr9E_190591.png)

* Article Page

	The article on page format is "http://blog.sina.com.cn/s/blog_58ae76e80100g8au.html", where "58ae76e80100g8au" is variable character.

	![Article Page](http://webmagic.qiniudn.com/oscimages/193102_ZleC_190591.png)

#### 2 article URL found

In this crawler demand, the article URL is our ultimate concern, so how to find all the articles in this blog address is the first step crawlers.

We can use the regular expression `http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html` a coarse filter for URL. More complicated here is that this URL is too broad and could crawl to the other blog information, so we must specify the area from the list page Get URL.

Here, we use xpath `//div[@class=\\"articleList\\"]` select all regions, then use links () or xpath `//a/@href` get all the links, and finally the use of regular expression `http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html`, a URL filtering to remove some of the" edit "or" more "category links. Thus, we can write:

```java
page.addTargetRequests(page.getHtml().xpath("//div[@class=\"articleList\"]").links().regex("http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html").all());
```

At the same time, we need to find a list of all the pages are added to the URL to be downloaded to go:

```java
page.addTargetRequests(page.getHtml().links().regex("http://blog\\.sina\\.com\\.cn/s/articlelist_1487828712_0_\\d+\\.html").all());
```

#### 3 Content Extraction

Extracting the article page of information is relatively simple, written corresponding xpath expression to extract it.

```java
page.putField("title", page.getHtml().xpath("//div[@class='articalTitle']/h2"));
page.putField("content", page.getHtml().xpath("//div[@id='articlebody']//div[@class='articalContent']"));
page.putField("date",
        page.getHtml().xpath("//div[@id='articlebody']//span[@class='time SG_txtc']").regex("\\((.*)\\)"));
```

#### 4 distinguish lists and landing pages

Now, we have defined the target page list and processing the way, now we need to deal with when they make that distinction. In this case, the distinction is very simple, because the list on the page and the destination page URL format is different, so the URL directly distinguish it!

```java
// List
if (page.getUrl().regex(URL_LIST).match()) {
    page.addTargetRequests(page.getHtml().xpath("//div[@class=\"articleList\"]").links().regex(URL_POST).all());
    page.addTargetRequests(page.getHtml().links().regex(URL_LIST).all());
    // Article Page
} else {
    page.putField("title", page.getHtml().xpath("//div[@class='articalTitle']/h2"));
    page.putField("content", page.getHtml().xpath("//div[@id='articlebody']//div[@class='articalContent']"));
    page.putField("date",
            page.getHtml().xpath("//div[@id='articlebody']//span[@class='time SG_txtc']").regex("\\((.*)\\)"));
}
```

Consider this example the complete code [SinaBlogProcessor.java](https://github.com/code4craft/webmagic/blob/master/webmagic-samples/src/main/java/us/codecraft/webmagic/samples/SinaBlogProcessor.java).

#### 5 Summary

In this example, we use several main methods:

* Found a link from a page using regular expressions to specify the location of the filter link.
* PageProcessor deal with two pages, depending on page URL to distinguish between what is required.

Some friends of the reaction, if-else deal with some inconvenience to differentiate [#issue83](https://github.com/code4craft/webmagic/issues/83). WebMagic planned future version 0.5.0 added [`SubPageProcessor`](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/handler/SubPageProcessor.java) to solve this problem.
