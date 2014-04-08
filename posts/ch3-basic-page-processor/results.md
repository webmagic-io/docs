### 3.3 保存结果

好了，爬虫编写完成，现在我们可能还有一个问题：我如果想把抓取的结果保存下来，要怎么做呢？WebMagic用于保存结果的组件叫做`Pipeline`。例如我们通过“控制台输出结果”这件事也是通过一个内置的Pipeline完成的，它叫做`ConsolePipeline`。那么，我现在想要把结果用Json的格式保存下来，怎么做呢？我只需要将Pipeline的实现换成"JsonFilePipeline"就可以了。

```java
public static void main(String[] args) {
    Spider.create(new GithubRepoPageProcessor())
            //从"https://github.com/code4craft"开始抓
            .addUrl("https://github.com/code4craft")
            .addPipeline(new JsonFilePipeline("D:\\webmagic\\"))
            //开启5个线程抓取
            .thread(5)
            //启动爬虫
            .run();
}
```

这样子下载下来的文件就会保存在D盘的webmagic目录中了。

通过定制Pipeline，我们还可以实现保存结果到文件、数据库等一系列功能。这个会在第7章“抽取结果的处理”中介绍。

至此为止，我们已经完成了一个基本爬虫的编写，也具有了一些定制功能。