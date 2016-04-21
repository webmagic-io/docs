### 5.2 TargetUrl and HelpUrl

In the second step, we still have to define how to discover URL. Here we first introduce two concepts: `@TargetUrl` and `@HelpUrl`.

#### 5.2.1 TargetUrl and HelpUrl

`HelpUrl/TargetUrl` reptile is a very effective development model, TargetUrl we eventually crawled URL, eventually want the data from here; and HelpUrl is to find the final URL, we need to access the page. Almost all vertical reptile needs, can be attributed to these two types of URL processing:

* For the blog page, HelpUrl is a list of pages, TargetUrl article pages.
* For the forum, HelpUrl is the list of posts, TargetUrl is a post for details.
* For the electricity supplier website, HelpUrl is a list of categories, TargetUrl commodity details.

In this example, TargetUrl page is the final project, and the project is HelpUrl search page, which will display links to all projects.

With this knowledge, we have for example defined URL format:

```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {
	……
}
```

##### TargetUrl custom regular expressions

Here we are using regular expressions to specify the URL scope. Careful friends may be, will know `.` reserved character is a regular expression, this is not it wrong? In fact, here for the convenience, WebMagic own custom regex for URL's, mainly by two changes:

* The URL of characters commonly used default `.` do escape into the`\.`
* The "\*" replaced. "*" Wildcard may be used directly.

For example, `https://github.com/*` here is a valid expression that all URL under `https://github.com/`.

In WebMagic, a page from the URL `TargetUrl` obtained, provided that they meet TargetUrl format, will also be downloaded. So even if you do not specify `HelpUrl` also possible - for example, there will always be some blog page" Next "link, in this case need to specify HelpUrl.

##### sourceRegion

TargetUrl also supports the definition of `sourceRegion`, this parameter is an XPath expression that specifies the URL from where to get - not sourceRegion the URL will not be extracted.
