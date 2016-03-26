### 4.6 Monitor with JMX

Crawlers monitor is new features 0.5.0. Using this feature, you can check the implementation of the crawlers - how many pages have been downloaded, how many pages, how many starts the thread and other information. The functionality through JMX implementations, you can use the tool to see Jconsole etc. JMX local or remote crawler information.

If you will not JMX does not matter, because its use is relatively simple, this chapter will use more detailed explanation. If you want to find out where the principle, you may need some knowledge of JMX is recommended reading: [JMX Finishing] (http://my.oschina.net/xpbug/blog/221547). I have a lot of part of the article was a reference.

Note: If you define a Scheduler, you need to use this class implements `MonitorableScheduler` interface to view "LeftPageCount" and "TotalPageCount" These two messages.

#### 4.6.1 Add monitoring project

Add monitoring is very simple, get a `SpiderMonitor` singleton `SpiderMonitor.instance()`, and you want to monitor Spider registration go to. You can register multiple Spider in to `SpiderMonitor`.

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

#### 4.6.2 View monitoring information

WebMagic monitoring using JMX provides control, you can use any JMX-enabled client to connect. We are here to JDK comes JConsole example. We first start a WebMagic - Spider and add code of monitor. Then we to view it in JConsole.

We start the program in accordance with the example 4.6.1, and then enter the command jconsole (under Windows terminal - command line interface (CLI) is entered in the DOS jconsole.exe) to start JConsole.

! [Jconsole] (http://webmagic.qiniudn.com/oscimages/231513_lP2O_190591.png)

Here we have chosen to start a local process WebMagic,  After connecting choose "MBean", opening the "WebMagic", will be able to see all the information has been monitoring the Spider!

Here we can also choose "action" in the operation where you can choose to start -start() and termination crawlers -stop(), which will directly call the corresponding Spider's start() and stop() method to achieve the purpose of basic control.

! [Jconsole-show] (http://webmagic.qiniudn.com/oscimages/231652_B3Mt_190591.png)

#### 4.6.3 Extended Monitoring Interface

In addition to some of the existing monitoring information, if you have more information needs to be monitored, can also be extended to solve. You can inherit `SpiderStatusMXBean` to achieve the expansion, specific examples can be seen here:
[Custom extensions demo] (https://github.com/code4craft/webmagic/tree/master/webmagic-extension/src/test/java/us/codecraft/webmagic/monitor).
