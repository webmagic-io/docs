### 4.1 Implement PageProcessor

This is part of our `GithubRepoPageProcessor` directly through this example to introduce the write mode `PageProcessor`. I will PageProcessor customization is divided into three parts, namely, crawlers configuration, extracted page elements and links discovery.

```java
public class GithubRepoPageProcessor implements PageProcessor {

    // Part I: crawl the site configuration, including coding, crawler space, retries, etc.
    private Site site = Site.me().setRetryTimes(3).setSleepTime(1000);

    @Override
    // Process custom crawler logic core interfaces, where the preparation of extraction logic
    public void process(Page page) {
        // Part II: the definition of how to extract information about the page, and preserved
        page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
        page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
        if (page.getResultItems().get("name") == null) {
            //skip this page
            page.setSkip(true);
        }
        page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));

        // Part III: From the subsequent discovery page url address to crawler
        page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    }

    @Override
    public Site getSite() {
        return site;
    }

    public static void main(String[] args) {

        Spider.create(new GithubRepoPageProcessor())
                //From "https://github.com/code4craft" began to grasp
                .addUrl("https://github.com/code4craft")
                //Open 5 threads of Crawler
                .thread(5)
                //Start Crawler
                .run();
    }
}
```

#### 4.1.1 Crawler configuration

The first part on the configuration of crawlers, including coding, crawl interval, timeout, retries, but also includes some analog parameters such as User Agent, cookie, and proxy settings, we'll Chapter 5 - "crawlers configuration" in introduced. Here we briefly set about: retries 3 times, crawl interval of 1 second.

#### 4.1.2 Extraction of page elements

The second part is the core of the crawlers: for download to Html page from you how to extract the information you want? WebMagic uses mainly three extraction technologies: XPath, regular expressions and CSS selectors. In addition, the content JSON format, you can use JsonPath resolution.

1. XPath

  Originally XPath is a query language for XML elements acquired, but also more convenient for Html. E.g:

	```java
	page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()")
	```

  This code uses XPath, it means "find all the class attribute 'entry-title public' the h1 element, and find a child node of his strong child node, a node and extracts text information."
Corresponding Html is like this:

  ![Xpath-html](http://webmagic.qiniudn.com/oscimages/104607_Aqq8_190591.png)

2. CSS selector

  CSS and XPath selectors are similar language. If we did front-end development, know for sure that $('h1.entry-title') the wording of meaning. Objectively speaking, it is more than XPath to write simpler, but if you write more complex extraction rules, it is relatively little trouble.

3. Regular Expressions

  Regular expressions are a universal language text extraction.

	```java
	page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
	```

  This code uses a regular expression that matches all "https://github.com/code4craft/webmagic" such a link.

4. JsonPath

  JsonPath in XPath is a language very similar to that used to quickly locate a Json from content. WebMagic used JsonPath format can be found here: [https://code.google.com/p/json-path/](https://code.google.com/p/json-path/)

#### 4.1.3 link found

With the processing logic page, our crawlers will be close to done!

But now there is a problem: a page of the site is a lot of from the beginning we can not all listed, then follow the link to discover how, is an indispensable part of a crawler.

```java
page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
```

This code is divided into two parts, `page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all()` With Get to meet all "(https://github\\.com/\\w+/\\w+)" this regular expression links, `page.addTargetRequests()` these links will be added to the queue to be crawled go.
