### 6.1 定制Pipeline

Pileline是抽取结束后，进行处理的部分，它主要用于抽取结果的保存，也可以定制Pileline可以实现一些通用的功能。在这一节中，我们会对Pipeline进行介绍，并用两个例子来讲解如何定制Pipeline。

#### 6.1.1 Pipeline介绍

Pipeline的接口定义如下：

```java
public interface Pipeline {

    // ResultItems保存了抽取结果，它是一个Map结构，
    // 在page.putField(key,value)中保存的数据，可以通过ResultItems.get(key)获取
    public void process(ResultItems resultItems, Task task);

}
```

可以看到，`Pipeline`其实就是将`PageProcessor`抽取的结果，继续进行了处理的，其实在Pipeline中完成的功能，你基本上也可以直接在PageProcessor实现，那么为什么会有Pipeline？有几个原因：

1. 为了模块分离。“页面抽取”和“后处理、持久化”是爬虫的两个阶段，将其分离开来，一个是代码结构比较清晰，另一个是以后也可能将其处理过程分开，分开在独立的线程以至于不同的机器执行。
2. Pipeline的功能比较固定，更容易做成通用组件。每个页面的抽取方式千变万化，但是后续处理方式则比较固定，例如保存到文件、保存到数据库这种操作，这些对所有页面都是通用的。WebMagic中就已经提供了控制台输出、保存到文件、保存为JSON格式的文件几种通用的Pipeline。

在WebMagic里，一个`Spider`可以有多个Pipeline，使用`Spider.addPipeline()`即可增加一个Pipeline。这些Pipeline都会得到处理，例如你可以使用

```java
spider.addPipeline(new ConsolePipeline()).addPipeline(new FilePipeline())
```

实现输出结果到控制台，并且保存到文件的目标。

#### 6.1.2 将结果输出到控制台

在介绍PageProcessor时，我们使用了[GithubRepoPageProcessor](https://github.com/code4craft/webmagic/blob/master/webmagic-core/src/main/java/us/codecraft/webmagic/processor/example/GithubRepoPageProcessor.java)作为例子，其中某一段代码中，我们将结果进行了保存：

```java
public void process(Page page) {
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+)").all());
    //保存结果author，这个结果会最终保存到ResultItems中
    page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
    page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
    if (page.getResultItems().get("name")==null){
        //设置skip之后，这个页面的结果不会被Pipeline处理
        page.setSkip(true);
    }
    page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));
}
```

现在我们想将结果保存到控制台，要怎么做呢？[ConsolePipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-core/src/main/java/us/codecraft/webmagic/pipeline/ConsolePipeline.java)可以完成这个工作：

```java
public class ConsolePipeline implements Pipeline {

    @Override
    public void process(ResultItems resultItems, Task task) {
        System.out.println("get page: " + resultItems.getRequest().getUrl());
        //遍历所有结果，输出到控制台，上面例子中的"author"、"name"、"readme"都是一个key，其结果则是对应的value
        for (Map.Entry<String, Object> entry : resultItems.getAll().entrySet()) {
            System.out.println(entry.getKey() + ":\t" + entry.getValue());
        }
    }
}
```

参考这个例子，你就可以定制自己的Pipeline了——从`ResultItems`中取出数据，再按照你希望的方式处理即可。

#### 6.1.3 将结果保存到MySql

这里先介绍一个demo项目：[jobhunter](https://github.com/webmagic-io/jobhunter)。它是一个集成了Spring，使用WebMagic抓取招聘信息，并且使用Mybatis持久化到Mysql的例子。我们会用这个项目来介绍如果持久化到Mysql。

一般来说，在Java里，我们会使用ORM框架来完成持久化到MySql的工作。这些框架一般都要求保存的内容是一个定义好结构的对象，而不是一个key-value形式的ResultItems。以MyBatis为例，我们使用[MyBatis-Spring](http://mybatis.github.io/spring/zh/)可以定义这样一个DAO：

```java
public interface JobInfoDAO {

    @Insert("insert into JobInfo (`title`,`salary`,`company`,`description`,`requirement`,`source`,`url`,`urlMd5`) values (#{title},#{salary},#{company},#{description},#{requirement},#{source},#{url},#{urlMd5})")
    public int add(LieTouJobInfo jobInfo);
}
```

我们要做的，就是实现一个Pipeline，将ResultItems和`LieTouJobInfo`对象结合起来。

#### 注解模式

注解模式下，WebMagic内置了一个[PageModelPipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/pipeline/PageModelPipeline.java)：

```java
public interface PageModelPipeline<T> {

    //这里传入的是处理好的对象
    public void process(T t, Task task);

}
```

这时，我们可以很优雅的定义一个[JobInfoDaoPipeline](https://github.com/webmagic-io/jobhunter/blob/master/src/main/java/us/codecraft/jobhunter/pipeline/JobInfoDaoPipeline.java)，来实现这个功能：

```java
@Component("JobInfoDaoPipeline")
public class JobInfoDaoPipeline implements PageModelPipeline<LieTouJobInfo> {

    @Resource
    private JobInfoDAO jobInfoDAO;

    @Override
    public void process(LieTouJobInfo lieTouJobInfo, Task task) {
        //调用MyBatis DAO保存结果
        jobInfoDAO.add(lieTouJobInfo);
    }
}
```

#### 基本Pipeline模式

至此，结果保存就已经完成了！那么如果我们使用原始的Pipeline接口，要怎么完成呢？其实答案也很简单，如果你要保存一个对象，那么就需要在抽取的时候，将它保存为一个对象：

```java
public void process(Page page) {
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+)").all());
    GithubRepo githubRepo = new GithubRepo();
    githubRepo.setAuthor(page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
    githubRepo.setName(page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
    githubRepo.setReadme(page.getHtml().xpath("//div[@id='readme']/tidyText()").toString());
    if (githubRepo.getName() == null) {
        //skip this page
        page.setSkip(true);
    } else {
        page.putField("repo", githubRepo);
    }
}
```

在Pipeline中，只要使用

```java
GithubRepo githubRepo = (GithubRepo)resultItems.get("repo");
```
就可以获取这个对象了。

> PageModelPipeline实际上也是通过原始的Pipeline来实现的，它将与PageProcessor进行了整合，在保存时，使用类名作为key，而对象则是value，具体实现见：[ModelPipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/model/ModelPipeline.java)。

#### 6.1.4 WebMagic已经提供的几个Pipeline

