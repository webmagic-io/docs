### 5.2 TargetUrl与HelpUrl

在第二步，我们仍然要定义如何发现URL。这里我们要先引入两个概念：`@TargetUrl`和`@HelpUrl`。

#### 5.2.1 TargetUrl与HelpUrl

`HelpUrl/TargetUrl`是一个非常有效的爬虫开发模式，TargetUrl是我们最终要抓取的URL，最终想要的数据都来自这里；而HelpUrl则是为了发现这个最终URL，我们需要访问的页面。几乎所有垂直爬虫的需求，都可以归结为对这两类URL的处理：

* 对于博客页，HelpUrl是列表页，TargetUrl是文章页。
* 对于论坛，HelpUrl是帖子列表，TargetUrl是帖子详情。
* 对于电商网站，HelpUrl是分类列表，TargetUrl是商品详情。

在这个例子中，TargetUrl是最终的项目页，而HelpUrl则是项目搜索页，它会展示所有项目的链接。

有了这些知识，我们就为这个例子定义URL格式：

```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {
	……
}
```

##### TargetUrl中的自定义正则表达式

这里我们使用的是正则表达式来规定URL范围。可能细心的朋友，会知道`.`是正则表达式的保留字符，那么这里是不是写错了呢？其实是这里为了方便，WebMagic自己定制的适合URL的正则表达式，主要由两点改动：

* 将URL中常用的字符`.`默认做了转义，变成了`\.`
* 将"\*"替换成了".*"，直接使用可表示通配符。

例如，`https://github.com/*`在这里是一个合法的表达式，它表示`https://github.com/`下的所有URL。

在WebMagic中，从`TargetUrl`页面得到的URL，只要符合TargetUrl的格式，也是会被下载的。所以即使不指定`HelpUrl`也是可以的——例如某些博客页总会有“下一篇”链接，这种情况下无需指定HelpUrl。

##### sourceRegion

TargetUrl还支持定义`sourceRegion`，这个参数是一个XPath表达式，指定了这个URL从哪里得到——不在sourceRegion的URL不会被抽取。