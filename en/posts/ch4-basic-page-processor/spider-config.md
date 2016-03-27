### 4.4 Crawler configuration, start and stop

#### 4.4.1 Spider

`Spider` crawler start entrance. Before starting the crawlers, we need to use a `PageProcessor` create a Spider object, and then use the `run()` to start. While other components of the Spider (Downloader, Scheduler, Pipeline) can be set by a set method.

| Method | Description | Examples |
| -------- | ------- | ------- |
| create(PageProcessor)| Create Spider | Spider.create(new GithubRepoProcessor())|
|addUrl(String…) | Add initial URL |spider .addUrl("http://webmagic.io/docs/") |
|addRequest(Request...) | Add initial Request |spider .addRequest("http://webmagic.io/docs/") |
| thread(n)| n threads open | spider.thread(5)| 
|run()|starts, blocking the current thread of execution| spider.run() |
|start()/runAsync()|asynchronous start, continue with the current thread | spider.start() |  
|stop()|stop crawler | spider.stop() |  
|test(String)|crawl a page to test | spider .test("http://webmagic.io/docs/") |
| addPipeline(Pipeline) | add a Pipeline, a Spider can have multiple Pipeline | spider .addPipeline(new ConsolePipeline())|
| setScheduler(Scheduler) | Settings Scheduler, a Spider must have at a Scheduler |  spider.setScheduler(new RedisScheduler()) |
| setDownloader(Downloader) | Settings Downloader, a Spider must have at a Downloader |  spider .setDownloader(new SeleniumDownloader()) |
| get(String) | synchronous calls, and direct access to the results | ResultItems result = spider .get("http://webmagic.io/docs/")
| getAll(String…) | synchronous calls, and direct access to a bunch of results | List&lt;ResultItems&gt; results = spider .getAll("http://webmagic.io/docs/", "http://webmagic.io/xxx")

#### 4.4.2 Site

The site itself, some configuration information, such as encoding, HTTP headers, timeout, retry strategies, agents, etc., can be configured by setting `Site` object.

| Method | Description | Examples |
| -------- | ------- | ------- |
|setCharset(String)|set the encoding|site.setCharset("utf-8")|
| setUserAgent(String)| Settings UserAgent | site.setUserAgent("Spider") |
| setTimeOut(int)| set the timeout in milliseconds  | site.setTimeOut(3000)|
| setRetryTimes(int)| Settings retries | site.setRetryTimes(3) |
| setCycleRetryTimes(int)| Setting cycle retries | site.setCycleRetryTimes(3) |
|addCookie(String,String)| add a cookie | site.addCookie("dotcomt_user","code4craft") |
|setDomain(String)| set up the domain name, the domain name to be set later, addCookie only take effect | site.setDomain("github.com")
|addHeader(String,String)| add a addHeader | site.addHeader("Referer","https://github.com") |
|setHttpProxy(HttpHost) | Http proxy settings | site.setHttpProxy(new HttpHost("127.0.0.1",8080)) |

Wherein the loop retry cycleRetry version 0.3.0 is added mechanism.

This mechanism will fail to download url back into the tail of the queue retry until the number of retries to ensure that no leakage grasping for some reason the network page.
