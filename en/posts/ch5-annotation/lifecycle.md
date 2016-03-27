### 5.6 a complete process

Prior to the date, we know the URL and extract the relevant API, a crawler has been basically completed the preparation.

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
#### 5.6.1 crawler creation and start

Entrance annotation model is `OOSpider`, it inherits the` Spider` class that provides special creation method, other methods are similar. Create an annotation mode reptiles require one or more `Model` class, and one or more `PageModelPipeline`-- define the results manner.

```java
public static OOSpider create(Site site, PageModelPipeline pageModelPipeline, Class... pageModels);
```

#### 5.6.2 PageModelPipeline

Under annotation mode, the results of class called `PageModelPipeline`, by implementing it, you can customize your results approach.
```java
public interface PageModelPipeline<T> {

    public void process(T t, Task task);

}
```

PageModelPipeline with Model class is the corresponding, may correspond to a plurality of Model PageModelPipeline. Except when you create, you can also

```java
public OOSpider addPageModel(PageModelPipeline pageModelPipeline, Class... pageModels)
```

Method, add a Model at the same time, you can add a PageModelPipeline.

#### 5.6.3 Conclusion

Well, now we have to complete this example:

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
