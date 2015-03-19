### 4.2 使用Selectable的链式API

`Selectable`相关的链式API是WebMagic的一个核心功能。使用Selectable接口，你可以直接完成页面元素的链式抽取，也无需去关心抽取的细节。

在刚才的例子中可以看到，page.getHtml()返回的是一个`Html`对象，它实现了`Selectable`接口。这个接口包含一些重要的方法，我将它分为两类：抽取部分和获取结果部分。

#### 4.2.1 抽取部分API：

| 方法 | 说明 | 示例 |
| ------------ | ------------- | ------------ |
| xpath(String xpath) | 使用XPath选择  | html.xpath("//div[@class='title']") |
| $(String selector) | 使用Css选择器选择  | html.$("div.title") |
| $(String selector,String attr) | 使用Css选择器选择  | html.$("div.title","text") |
| css(String selector) | 功能同$()，使用Css选择器选择  | html.css("div.title") |
| links() | 选择所有链接  | html.links() |
| regex(String regex) | 使用正则表达式抽取  | html.regex("\<div\>(.\*?)\</div>") |
| regex(String regex,int group) | 使用正则表达式抽取，并指定捕获组  | html.regex("\<div\>(.\*?)\</div>",1) |
| replace(String regex, String replacement) | 替换内容| html.replace("\<script>.\*\</script>","")|

这部分抽取API返回的都是一个`Selectable`接口，意思是说，抽取是支持链式调用的。下面我用一个实例来讲解链式API的使用。

例如，我现在要抓取github上所有的Java项目，这些项目可以在[https://github.com/search?l=Java&p=1&q=stars%3A%3E1&s=stars&type=Repositories](https://github.com/search?l=Java&p=1&q=stars%3A%3E1&s=stars&type=Repositories)搜索结果中看到。

为了避免抓取范围太宽，我指定只从分页部分抓取链接。这个抓取规则是比较复杂的，我会要怎么写呢？

![selectable-chain-ui](http://webmagic.qiniudn.com/oscimages/151454_2T01_190591.png)

首先看到页面的html结构是这个样子的：

![selectable-chain](http://webmagic.qiniudn.com/oscimages/151632_88Oq_190591.png)

那么我可以先用CSS选择器提取出这个div，然后在取到所有的链接。为了保险起见，我再使用正则表达式限定一下提取出的URL的格式，那么最终的写法是这样子的：

```java
List<String> urls = page.getHtml().css("div.pagination").links().regex(".*/search/\?l=java.*").all();
```

然后，我们可以把这些URL加到抓取列表中去：

```java
List<String> urls = page.getHtml().css("div.pagination").links().regex(".*/search/\?l=java.*").all();
page.addTargetRequests(urls);
```

是不是比较简单？除了发现链接，Selectable的链式抽取还可以完成很多工作。我们会在第9章示例中再讲到。

#### 4.2.2 获取结果的API：

当链式调用结束时，我们一般都想要拿到一个字符串类型的结果。这时候就需要用到获取结果的API了。我们知道，一条抽取规则，无论是XPath、CSS选择器或者正则表达式，总有可能抽取到多条元素。WebMagic对这些进行了统一，你可以通过不同的API获取到一个或者多个元素。

| 方法 | 说明 | 示例 |
| ------------ | ------------- | ------------ |
| get() | 返回一条String类型的结果 | String link= html.links().get()|
| toString() | 功能同get()，返回一条String类型的结果 | String link= html.links().toString()|
| all() | 返回所有抽取结果 | List<String> links= html.links().all()|
| match() | 是否有匹配结果 | if (html.links().match()){ xxx; }|

例如，我们知道页面只会有一条结果，那么可以使用selectable.get()或者selectable.toString()拿到这条结果。

这里selectable.toString()采用了toString()这个接口，是为了在输出以及和一些框架结合的时候，更加方便。因为一般情况下，我们都只需要选择一个元素！

selectable.all()则会获取到所有元素。

好了，到现在为止，在回过头看看3.1中的GithubRepoPageProcessor，可能就觉得更加清晰了吧？指定main方法，已经可以看到抓取结果在控制台输出了。
