## 5. Using annotations written in crawler

WebMagic support the use of a unique style to write a comment reptile introduced webmagic-extension package to use this feature.

In annotation mode, using a simple object add comments, use minimal amount of code to complete the preparation of a crawler. For simple reptiles, write simple and easy to understand, and also very easy to manage. It is also a major feature of WebMagic, I called it `OEM` (Object/Extraction Mapping).

Annotation model development approach is this:

1. First you need to define the extracted data, and write a class.
2. On the class stated `@TargetUrl` annotation, define which URL to download and extraction.
3. Add the `@ExtractBy` annotation on the class of the field, this field uses the definition of what way decimated.
4. Define the result is stored.

Here we still examples github chapter IV, to write a similar function reptiles, to explain the use of annotations. Final preparation of good reptile is like this, is not it easier?

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
