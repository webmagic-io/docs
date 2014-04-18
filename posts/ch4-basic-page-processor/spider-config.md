### 4.4 爬虫的配置、启动和终止

#### 4.4.1 Spider

`Spider`是爬虫启动的入口。在启动爬虫之前，我们需要使用一个`PageProcessor`创建一个Spider对象，然后使用`run()`进行启动。同时Spider的其他组件（Downloader、Scheduler、Pipeline）都可以通过set方法来进行设置。

| 方法 | 说明 | 示例 |
|---|--|
| create(PageProcessor)| 创建Spider | Spider.create(new GithubRepoProcessor())|
|addUrl(String…) | 添加初始的URL |spider .addUrl("http://webmagic.io/docs/") |
|addRequest(Request...) | 添加初始的Request |spider .addUrl("http://webmagic.io/docs/") |
| thread(n)| 开启n个线程 | spider.thread(5)| 
|run()|启动，会阻塞当前线程执行| spider.run() |
|start()/runAsync()|异步启动，当前线程继续执行 | spider.start() |  
|stop()|停止爬虫 | spider.stop() |  
|test(String)|抓取一个页面进行测试 | spider .test("http://webmagic.io/docs/") |
| addPipeline(Pipeline) | 添加一个Pipeline，一个Spider可以有多个Pipeline | spider .addPipeline(new ConsolePipeline())|
| setScheduler(Scheduler) | 设置Scheduler，一个Spider只能有个一个Scheduler |  spider.setScheduler(new RedisScheduler()) |
| setDownloader(Downloader) | 设置Downloader，一个Spider只能有个一个Downloader |  spider .setDownloader(new SeleniumDownloader()) |
| get(String) | 同步调用，并直接取得结果 | ResultItems result = spider .get("http://webmagic.io/docs/")
| getAll(String…) | 同步调用，并直接取得一堆结果 | List&lt;ResultItems&gt; results = spider .getAll("http://webmagic.io/docs/", "http://webmagic.io/xxx")

#### 4.4.2 Site

对站点本身的一些配置信息，例如编码、HTTP头、超时时间、重试策略等、代理等，都可以通过设置`Site`对象来进行配置。

| 方法 | 说明 | 示例 |
|---|--|
|setCharset(String)|设置编码|site.setCharset("utf-8")|
| setUserAgent(String)| 设置UserAgent | site.setUserAgent("Spider") |
| setTimeOut(int)| 设置超时时间，单位是毫秒| site.setTimeOut(3000)|
| setRetryTimes(int)| 设置重试次数 | site.setRetryTimes(3) |
| setCycleRetryTimes(int)| 设置循环重试次数 | site.setCycleRetryTimes(3) |
|addCookie(String,String)| 添加一条cookie | site.addCookie("dotcomt_user","code4craft") |
|setDomain(String)| 设置域名，需设置域名后，addCookie才可生效 | site.setDomain("github.com")
|addHeader(String,String)| 添加一条addHeader | site.addHeader("Referer","https://github.com") |
|setHttpProxy(HttpHost) | 设置Http代理 | site.setHttpProxy(new HttpHost("127.0.0.1",8080)) |

其中循环重试cycleRetry是0.3.0版本加入的机制。

该机制会将下载失败的url重新放入队列尾部重试，直到达到重试次数，以保证不因为某些网络原因漏抓页面。