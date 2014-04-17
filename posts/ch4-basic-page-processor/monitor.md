### 4.6 爬虫的监控

这是0.5.0新增的功能，目前仍在开发和测试中，欢迎提出意见。开发完成后，这一章会讲解如何对爬虫进行监控。

目前的计划是：提供JMX API，可以使用JConsole等工具连接，然后在外部提供一个Web项目，可以在Web页面上进行监控。欢迎去[github #issue98](https://github.com/code4craft/webmagic/issues/98)反馈意见。

#### 监控的启动方式

实例化一个`SpiderMonitor`即可。

```java
public static void main(String[] args) throws JMException,
        NullPointerException,
        IOException {
    Spider oschinaSpider = Spider.create(new OschinaBlogPageProcessor())
            .addUrl("http://my.oschina.net/flashsword/blog").thread(2);
    Spider githubSpider = Spider.create(new GithubRepoPageProcessor())
            .addUrl("https://github.com/code4craft");
    SpiderMonitor spiderMonitor = new SpiderMonitor();
    spiderMonitor.register(oschinaSpider, githubSpider);
    spiderMonitor.jmxStart();
}
```

#### 监控接口

这个监控接口会包含抓取的URL等信息。

```java
public interface SpiderStatusMBean {

    public String getName();

    public int getTotalPageCount();

    public int getLeftPageCount();

    public int getSuccessPageCount();

    public int getErrorPageCount();

    public List<String> getErrorPages();

    public void start();

    public void stop();

}
```

#### 监控界面

可以启动、终止一个爬虫，也可以查看状态。

![jconsole](http://static.oschina.net/uploads/space/2014/0417/074306_CHpA_190591.png)

#### 定制扩展

你可以通过继承`SpiderStatusMBean`来实现扩展，具体例子可以看这里：
[定制扩展demo](https://github.com/code4craft/webmagic/tree/master/webmagic-core/src/test/java/us/codecraft/webmagic/monitor)