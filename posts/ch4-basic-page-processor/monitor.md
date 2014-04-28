### 4.6 爬虫的监控

爬虫的监控是0.5.0新增的功能。利用这个功能，你可以查看爬虫的执行情况——已经下载了多少页面、还有多少页面、启动了多少线程等信息。该功能通过JMX实现，你可以使用Jconsole等JMX工具查看本地或者远程的爬虫信息。

如果你完全不会JMX也没关系，因为它的使用相对简单，本章会比较详细的讲解使用方法。如果要弄明白其中原理，你可能需要一些JMX的知识，推荐阅读：[JMX整理](http://my.oschina.net/xpbug/blog/221547)。我很多部分也对这篇文章进行了参考。

注意: 如果你自己定义了Scheduler，那么需要用这个类实现`MonitorableScheduler`接口，才能查看“LeftPageCount”和“TotalPageCount”这两条信息。

#### 4.6.1 为项目添加监控

添加监控非常简单，获取一个`SpiderMonitor`的单例`SpiderMonitor.instance()`，并将你想要监控的Spider注册进去即可。你可以注册多个Spider到`SpiderMonitor`中。

```java
public class MonitorExample {

    public static void main(String[] args) throws Exception {

        Spider oschinaSpider = Spider.create(new OschinaBlogPageProcessor())
                .addUrl("http://my.oschina.net/flashsword/blog");
        Spider githubSpider = Spider.create(new GithubRepoPageProcessor())
                .addUrl("https://github.com/code4craft");

        SpiderMonitor.instance().register(oschinaSpider);
        SpiderMonitor.instance().register(githubSpider);
        oschinaSpider.start();
        githubSpider.start();
    }
}
```

#### 4.6.2 查看监控信息

WebMagic的监控使用JMX提供控制，你可以使用任何支持JMX的客户端来进行连接。我们这里以JDK自带的JConsole为例。我们首先启动WebMagic的一个Spider，并添加监控代码。然后我们通过JConsole来进行查看。

我们按照4.6.1的例子启动程序，然后在命令行输入jconsole（windows下是在DOS下输入jconsole.exe）即可启动JConsole。

![jconsole](http://static.oschina.net/uploads/space/2014/0426/231513_lP2O_190591.png)

这里我们选择启动WebMagic的本地进程，连接后选择“MBean”，点开“WebMagic”，就能看到所有已经监控的Spider信息了！

这里我们也可以选择“操作”，在操作里可以选择启动-start()和终止爬虫-stop()，这会直接调用对应Spider的start()和stop()方法，来达到基本控制的目的。

![jconsole-show](http://static.oschina.net/uploads/space/2014/0426/231652_B3Mt_190591.png)

#### 4.6.3 扩展监控接口

除了已有的一些监控信息，如果你有更多的信息需要监控，也可以通过扩展的方式来解决。你可以通过继承`SpiderStatusMBean`来实现扩展，具体例子可以看这里：
[定制扩展demo](https://github.com/code4craft/webmagic/tree/master/webmagic-core/src/test/java/us/codecraft/webmagic/monitor)。