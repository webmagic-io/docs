### Crawl tip rendered page

With the continued popularity of AJAX technology and the emergence of such AngularJS Single-page application framework now, now js render pages more and more. For reptiles, this page is more annoying: Just extract HTML content, are often unable to get valid information. So how do you deal with this pages? In general there are two approaches:

1. In the crawl phase, reptile built a browser kernel, after performing js rendering the page, and then crawl. This aspect of the corresponding tools `Selenium`,`HtmlUnit` or `PhantomJs`. But these tools there are some efficiency, at the same time it is not so stable. Benefit is to write the rules, like static pages.
2. Because js rendering data page is from the rear end to get, and basically get AJAX, so analysis AJAX request, a request to find the corresponding data is also more feasible approach. And with respect to the page style, this interface is less likely to change. The disadvantage is to find the request, and simulation, is a relatively difficult process, but also requires a relatively large number of analytic experience.

Comparison of two ways, my view is that the demand for one-time or small-scale, with the first approach saves time and effort. But for long-term, large-scale demand, or the second would be ideal. For some sites, and even some js confusing technology, this time, the first way is basically a panacea, while the second will be very complicated.

For the first method, `webmagic-selenium` is one such attempt, which defines a `Downloader`, at the time of the download page, the browser is the core rendering. selenium configuration is relatively complex, but with the version of the platform and, not too stable solution. I can see this blog interested in: [use Selenium to crawl dynamic loading pages](http://my.oschina.net/flashsword/blog/147334)

Here I introduced a second, and I hope in the end you will find: the original page parsing a front-end rendering, it is not so complicated. Here we AngularJS Chinese community [http://angularjs.cn/](http://angularjs.cn/) as an example.

#### 1 How to determine the front-end rendering

Determine whether the page is rendered js relatively simple way, in a browser to view the source code directly (Windows under Ctrl + U, Mac under the command + alt + u), if no effective information is almost certain to js rendering.

![angular-view](http://webmagic.qiniudn.com/oscimages/214310_cMYk_190591.png)

![angular-source]( http://webmagic.qiniudn.com/oscimages/214226_8s1v_190591.png)

This example, the page heading "Corfu computer network - Front siege division" can not be found in the source code, it can be concluded that js rendering, and this data is obtained AJAX.

#### 2 analysis request

Here we enter the hardest part: finding the data request. This step helps our tools is the development of tools to view web browser requests.

In Chome example, we open the "Developer Tools" (under Windows is F12, the next Mac is command + alt + i), then refresh the page (there may be a drop-down pages, in short, all that you think might trigger a new data operations ), and remember to retain the scene, the one used to request analysis of it!

This step requires a bit of patience, but it is not out of nowhere. First, to help us is above the Sort (All, Document and other options). If it is normal AJAX, appear under `XHR` label, JSONP request under `Scripts` labels, which are two of the more common data types.

Then you can look at the data to determine the size, the results are generally more likely to be larger return data interface. The rest, basically rely on the experience of, for example, where the "latest? P = 1 & s = 20" look very suspicious ...

![angular-ajax-list](http://webmagic.qiniudn.com/oscimages/233924_6rXz_190591.png)

For suspicious address, this time can look at what is the response body. Here not clear in developer tools, we URL`http://angularjs.cn/api/article/latest?p=1&s=20` copied into the address bar, the request once again (if Chrome recommend installing a jsonviewer,? Show AJAX results easily). See the results, it seems that we want to find.

![json](http://webmagic.qiniudn.com/oscimages/235310_8gHe_190591.png)

The same way, we enter into the post details page, find the specific content of the request`http://angularjs.cn/api/article/A0y2`.

#### 3 programming

Recall that before the target page list + example, we will find this demand, with the previous similar, but replaced with a list of ways -AJAX AJAX mode, the data AJAX mode, and returns the data into a JSON. Well, we can still use the way last time, into two pages to be written:

1. Data List

	In this list page, we need to find effective information to help us build targets AJAX URL's. Here we see, this is what we should `_id` want id's posts, and posts details of the request, by a few fixed URL plus the id components. Therefore, in this step, we have to manually construct URL, and added to the queue to be crawled. Here we use language JsonPath this option to select the data (webmagic-extension package that provides `JsonPathSelector` to support it).

	```java
    if (page.getUrl().regex(LIST_URL).match()) {
        //Here we use language JSONPATH this option to select the data
        List<String> ids = new JsonPathSelector("$.data[*]._id").selectList(page.getRawText());
        if (CollectionUtils.isNotEmpty(ids)) {
            for (String id : ids) {
                page.addTargetRequest("http://angularjs.cn/api/article/"+id);
            }
        }
    }
	```

2. Objectives data

	With the URL, in fact resolve the target data is very simple, because the JSON data is completely structured, so eliminating the need for our analysis page, write XPath process. Here we still use JsonPath to get the title and content.

	```java
    page.putField("title", new JsonPathSelector("$.data.title").select(page.getRawText()));
    page.putField("content", new JsonPathSelector("$.data.content").select(page.getRawText()));
    ```

Consider this example the complete code [AngularJSProcessor.java](https://github.com/code4craft/webmagic/blob/master/webmagic-samples/src/main/java/us/codecraft/webmagic/samples/AngularJSProcessor.java)

#### 4 Summary

In this example, we analyzed the crawling process a more classic dynamic pages. In fact, the dynamic pages crawled, the biggest difference is: it increases the difficulty of links found. We compare the two development models:

1. The rear end of the rendered page

	Download Helper page => find links => download and analyze the target HTML

2. The front-end rendering pages

	Found auxiliary data => constructing a link => download and analyze the target AJAX

For a different site, the auxiliary data may have been previously output in page HTML, it may be to request through AJAX, perhaps even process multiple data requests, but the basic pattern is fixed.

However, analysis of these data requests than the page analysis, it is still much more complicated, so this is actually a dynamic page fetch difficult.

The example in this section do hope that in the analysis of the request, provide a model to follow for such reptiles write that `find secondary data => constructing a link => download and analyze the target AJAX` this mode.

PS:

After WebMagic 0.5.0 support will be added to the chain of Json API, later you can use:

```java
page.getJson().jsonPath("$.name").get();
```
In such a way to resolve AJAX requests.

Also supports
```java
page.getJson().removePadding("callback").jsonPath("$.name").get();
```
JSONP such a way to resolve the request.
