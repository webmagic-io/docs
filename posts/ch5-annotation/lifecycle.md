### 5.6 一个完整的流程

到之前为止，我们了解了URL和抽取相关API，一个爬虫已经基本编写完成了。

```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {

    @ExtractBy(value = "//h1[@class='entry-title public']/strong/a/text()", notNull = true)
    private String name;

    @ExtractByUrl("https://github\\.com/(\\w+)/.*")
    private String author;

    @ExtractBy("//div[@id='readme']/tidyText()")
    private String readme;
}
```
#### 5.6.1 爬虫的创建和启动

注解模式的入口是`OOSpider`，它继承了`Spider`类，提供了特殊的创建方法，其他的方法是类似的。创建一个注解模式的爬虫需要一个或者多个`Model`类，以及一个或者多个`PageModelPipeline`——定义处理结果的方式。

```java
public static OOSpider create(Site site, PageModelPipeline pageModelPipeline, Class... pageModels);
```

#### 5.6.2 PageModelPipeline

注解模式下，处理结果的类叫做`PageModelPipeline`，通过实现它，你可以自定义自己的结果处理方式。
```java
public interface PageModelPipeline<T> {

    public void process(T t, Task task);

}
```

PageModelPipeline与Model类是对应的，多个Model可以对应一个PageModelPipeline。除了创建时，你还可以通过

```java
public OOSpider addPageModel(PageModelPipeline pageModelPipeline, Class... pageModels)
```

方法，在添加一个Model的同时，可以添加一个PageModelPipeline。

#### 5.6.3 结语

好了，现在我们来完成这个例子：

```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {

    @ExtractBy(value = "//h1[@class='entry-title public']/strong/a/text()", notNull = true)
    private String name;

    @ExtractByUrl("https://github\\.com/(\\w+)/.*")
    private String author;

    @ExtractBy("//div[@id='readme']/tidyText()")
    private String readme;

    public static void main(String[] args) {
        OOSpider.create(Site.me().setSleepTime(1000)
                , new ConsolePageModelPipeline(), GithubRepo.class)
                .addUrl("https://github.com/code4craft").thread(5).run();
    }
}
```