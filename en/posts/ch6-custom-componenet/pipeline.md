### 6.1 Customize Pipeline
When the extract finished, we use `Pipeline` to persist the result of extract.We can also customize the pipeline to do some common function. In this chapter we will introduce the `Pipeline`, and use two examples to explane how to customize the pipeline.
#### 6.1.1 Introduction of Pipeline
The interface of`Pipeline`define is here:
```java
public interface Pipeline {

    // ResultItems persist the result of extract，it is a structure of map
    // The data in the page.putField(key,value) can use the ResultItems.get(key) to get
    public void process(ResultItems resultItems, Task task);
}
```
We can see, `Pipeline` persist the data which was extracted by the`PageProcessor`. This work we can also do in the `PageProcessor`. But why we use the `Pipeline`? There is some reason for this:
1. To separate the modules. The extract of page and persist the data are the to stages of a spider. On one hand, separate the modules can make the structure of the code more clear. On the other hand, we can separate the process, process in another thread or even in another server.
2. The function of `Pipeline` is more stable, it is very easy to make it as a common component. There is a big difference between process of different pages. But the persist of data is almost the same,such as save in a file or persist in the database. It is very commons for almost of the pages. There is lots of common `Pipeline` in the WebMagic, such as write to the console, save in a file, save in a file as a JSON format.

In the WebMagic, a `Spider` can have a lot of `Pipeline`, to use the `Spider.addPipeline()` can add a `Pipeline`. These `Pipeline` can all be process. For example, you can use:

```java
spider.addPipeline(new ConsolePipeline()).addPipeline(new FilePipeline())
```

You can write the data on the console and save in the file.

#### 6.1.2 Put the result on the console
When we introduce the `PageProcessor`, we use the [GithubRepoPageProcessor](https://github.com/code4craft/webmagic/blob/master/webmagic-core/src/main/java/us/codecraft/webmagic/processor/example/GithubRepoPageProcessor.java)as a example. There is a chip of the code:

```java
public void process(Page page) {
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+)").all());
    //save the author, the data will be save in ResultItems finally
    page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
    page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
    if (page.getResultItems().get("name")==null){
        //when we set the skip,this page will not be processed by the`Pipeline`
        page.setSkip(true);
    }
    page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));
}
```

Now we want to write the result in the console. [ConsolePipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-core/src/main/java/us/codecraft/webmagic/pipeline/ConsolePipeline.java) can do this.

```java
public class ConsolePipeline implements Pipeline {

    @Override
    public void process(ResultItems resultItems, Task task) {
        System.out.println("get page: " + resultItems.getRequest().getUrl());
        //Iterator all the result,and put it on the console,the "author","name","readme"are all the key,the result is value
        for (Map.Entry<String, Object> entry : resultItems.getAll().entrySet()) {
            System.out.println(entry.getKey() + ":\t" + entry.getValue());
        }
    }
}
```
To Reference this example, you can customize your own `Pipeline`. Get the data from the `ResultItems` and process as your own method.

#### 6.1.3 persist the result in the MySQL
First, we introduce a example[jobhunter](https://github.com/webmagic-io/jobhunter). It's a WebMagic which integrate a spring framework to crawl the job information. This example also show how to use Mybatis to persist the data in the MySQL database.

In Java, we have many methods to save the data in database, such as jdbc、dbutils、spring-jdbc、MyBatis. These tools can do the same things, but their complexity is not the same. If we use JBDC, we should get the data in the ResulrItem and save it.

If we use the ORM framework to persist the data, we will face a big problem. That is the framework all need a well defined model, but not a Key-Value format ResultItem. We use the Mybatis as a example to define a DAO [MyBatis-Spring](http://mybatis.github.io/spring/zh/).

```java
public interface JobInfoDAO {

    @Insert("insert into JobInfo (`title`,`salary`,`company`,`description`,`requirement`,`source`,`url`,`urlMd5`) values (#{title},#{salary},#{company},#{description},#{requirement},#{source},#{url},#{urlMd5})")
    public int add(LieTouJobInfo jobInfo);
}
```

All we need to do is to implements a Pipeline,to combine the `ResultItem`and`LieTouJobInfo`.

#### Annotation mode

Under the annotation mode, there is a [PageModelPipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/pipeline/PageModelPipeline.java) in the WebMagic：

```java
public interface PageModelPipeline<T> {

    //give the well processed object
    public void process(T t, Task task);

}
```

At this time,we can define a [JobInfoDaoPipeline](https://github.com/webmagic-io/jobhunter/blob/master/src/main/java/us/codecraft/jobhunter/pipeline/JobInfoDaoPipeline.java) to achieve the function:

```java
@Component("JobInfoDaoPipeline")
public class JobInfoDaoPipeline implements PageModelPipeline<LieTouJobInfo> {

    @Resource
    private JobInfoDAO jobInfoDAO;

    @Override
    public void process(LieTouJobInfo lieTouJobInfo, Task task) {
        //call the MyBatis DAO to save the result
        jobInfoDAO.add(lieTouJobInfo);
    }
}
```

#### Basic Pipeline mode

We have finished the work of save the data! But how to use a original `Pipeline` interface? It's very easy! If you want to save a object, then you should save the data as a object when you extract it from a page.

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

In the `Pipeline`, you should use

```java
GithubRepo githubRepo = (GithubRepo)resultItems.get("repo");
```

then you can get this object

> PageModelPipeline is also implements from the original `Pipeline` interface. It combine the `PageProcessor`. it use the class name as the key and the value is the object.In detail: [ModelPipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/model/ModelPipeline.java).

#### 6.1.4 The WebMagic has already define some Pipeline

WebMagic can write the result to the comsole,save the data in a file or save as a JSON format.

| Class | Description | Remark |
| -------- | ------- | ------- |
|ConsolePipeline|write to the console|the result must implements the toString() method
|FilePipeline|save the result in the file|the result must implements the toString() method
|JsonFilePipeline|save the data in the file as JSON format||
|ConsolePageModelPipeline|(Annotation mode)write to the console||
|FilePageModelPipeline|(Annotation mode)save the result in the file||
|JsonFilePageModelPipeline|(Annotation mode)save the data in the file as JSON format|the field which want to be saved must have the getter method
