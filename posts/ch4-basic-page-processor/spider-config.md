### 4.4 爬虫的配置、启动和终止

#### 4.4.1 Spider

`Spider`是爬虫启动的入口。在启动爬虫之前，我们需要使用一个`PageProcessor`创建一个Spider对象，然后使用`run()`进行启动。同时Spider的其他组件（Downloader、Scheduler、Pipeline）都可以通过set方法来进行设置。

| 方法 | 说明 | 示例 |
|---|--|
| create(PageProcessor)| 创建Spider | Spider.create(new GithubRepoProcessor())|
| thread(n)| 开启n个线程 | spider.thread(5)|
|run()|启动，会阻塞当前线程执行| spider.run() |
|start()/runAsync()|异步启动，当前线程继续执行 | spider.start() |  
|start()/runAsync()|异步启动，当前线程继续执行 | spider.start() |  

#### 4.4.2 Site

对站点本身的一些配置信息，例如编码、HTTP头、超时时间、重试策略等、代理等，都可以通过设置`Site`对象来进行配置。

| 方法 | 说明 | 示例 |
|---|--|
| setUserAgent| |