## 4.使用注解编写爬虫

WebMagic支持使用独有的注解风格编写一个爬虫。使用一个简单对象加上注解，可以用极少的代码量就完成一个爬虫的编写。

对于简单的爬虫，这样写既简单又容易理解，并且管理起来也很方便。这也是WebMagic的一大特色。

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

### 4.1 编写Model对象

### 4.2 使用注解进行抽取

### 4.3 链接匹配和发现

### 4.4 处理多个页面

### 4.5 代码上的扩展点