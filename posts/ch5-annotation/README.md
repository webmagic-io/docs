## 5.使用注解编写爬虫

WebMagic支持使用独有的注解风格编写一个爬虫，引入webmagic-extension包即可使用此功能。

在注解模式下，使用一个简单对象加上注解，可以用极少的代码量就完成一个爬虫的编写。对于简单的爬虫，这样写既简单又容易理解，并且管理起来也很方便。这也是WebMagic的一大特色，我戏称它为`OEM`(Object/Extraction Mapping)。

注解模式的开发方式是这样的：

1. 首先定义你需要抽取的数据，并编写类。
2. 在类上写明`@TargetUrl`注解，定义对哪些URL进行下载和抽取。
3. 在类的字段上加上`@ExtractBy`注解，定义这个字段使用什么方式进行抽取。
4. 定义结果的存储方式。

下面我们仍然以第四章中github的例子，来编写一个同样功能的爬虫，来讲解注解功能的使用。最终编写好的爬虫是这样子的，是不是更加简单？

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