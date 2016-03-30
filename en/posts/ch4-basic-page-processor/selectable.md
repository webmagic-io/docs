## 4.2 Selectable chain API

Chain API `Selectable` relevant is a core function of WebMagic. Selectable interface to use, you can complete extraction chain directly to page elements, and need to take care of details withdrawn.

Can be seen in the earlier example, page.getHtml() returns a `Html` object that implements the `Selectable` interface. This interface contains a number of important ways. I divide it into two categories: partial extraction section and get results.

#### Extraction section 4.2.1 API:

| Method | Description | Examples |
| ------------ | ------------- | ------------ |
| xpath(String xpath) | Using XPath selectors  | html.xpath("//div[@class='title']") |
| $(String selector) | Use CSS selector to choose  | html.$("div.title") |
| $(String selector,String attr) | Use CSS selector to choose  | html.$("div.title","text") |
| css(String selector) | Function with $(), using CSS selector to choose  | html.css("div.title") |
| links() | Select All link  | html.links() |
| regex(String regex) | Use regular expressions to extract  | html.regex("\<div\>(.\*?)\</div>") |
| regex(String regex,int group) | Use regular expressions to extract and specify the capture group  | html.regex("\<div\>(.\*?)\</div>",1) |
| replace(String regex, String replacement) | Replace the contents  | html.replace("\<script>.\*\</script>","")|

This part is extracted API returns a `Selectable` interfaces, meaning that extraction is supported chained calls. Let me use an example to explain the use of chain API.

For example, I now want to grab all Java projects on github, these items can be [https://github.com/search?l=Java&p=1&q=stars%3A%3E1&s=stars&type=Repositories](https:// github.com/search?l=Java&p=1&q=stars%3A%3E1&s=stars&type=Repositories) see the search results.

To avoid crawling too wide, I specify to crawl only link from the tab section. The crawl rules are more complex, I would be how to write?

![selectable-chain-ui](http://webmagic.qiniudn.com/oscimages/151454_2T01_190591.png)

First, see page html structure looks like this:

![selectable-chain](http://webmagic.qiniudn.com/oscimages/151632_88Oq_190591.png)

Then I can use CSS selectors to extract this div, and then to take all the links. For insurance purposes, I'll use regular expressions to define what the format of the extracted URL, and then the final wording is like this:

```java
List<String> urls = page.getHtml().css("div.pagination").links().regex(".*/search/\?l=java.*").all();
```

Then we can put these URL added to the list to crawl:

```java
List<String> urls = page.getHtml().css("div.pagination").links().regex(".*/search/\?l=java.*").all();
page.addTargetRequests(urls);
```

It is not simple? In addition to finding the link, chain drawn Selectable can also do a lot of work. In Chapter 9, we will re-mentioned examples.

#### 4.2.2 Get Results API:

When the call chain, we generally want to get a string type of result. This time we need to use the API to obtain the results. We know that an extraction rule, either XPath, CSS selectors or regular expression, it is always possible to extract a plurality of elements. WebMagic these were unified, you can get to one or more elements through different API.

| Method | Description | Examples |
| ------------ | ------------- | ------------ |
| get() | returns a result of type String | String link= html.links().get()|
| toString() | function with get (), returns a result of type String | String link= html.links().toString()|
| all() | returns all extraction results | List<String> links= html.links().all()|
| match() | is there a match result | if (html.links().match()){ xxx; }|

For example, we know that the page will have a result, you can use selectable.get() or selectable.toString() to get this result.

Here selectable.toString() uses the toString() this interface, as well as to output and frameworks when combined, more convenient. Because under normal circumstances, we only need to select one element!

selectable.all() will get to all the elements.

Well, up to now, look back at 3.1 GithubRepoPageProcessor, you may feel more clear, right? Specifies the main method, the results can already be seen crawling in the console output.
