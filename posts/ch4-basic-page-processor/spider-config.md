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
| setUserAgent| |