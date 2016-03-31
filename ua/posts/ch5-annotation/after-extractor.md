### 5.7 AfterExtractor

Іноді режим анотацій не може задовольнити всі потреби, можливо нам буде потрібно написати код, щоб зробити деякі речі, на цей раз ми повинні використовувати інтерфейси `AfterExtractor`.

```java
public interface AfterExtractor {

    public void afterProcess(Page page);
}
```

`afterProcess` метод екстракції в самому кінці, після того, як ініціалізувалися поля називати, ви можете мати справу з . .. Як і в прикладі [

extraction method in the end, after the fields are initialized to be called, you can deal with some special logic. Like in the example [using Jfinal ActiveRecord persistence webmagic crawled blog](http://www.oschina.net/code/snippet_190591_23456):

```
// TargetUrl mean only the following URL format will be extracted to generate the object model
// Here is to do a little positive change, '' The default is no need to escape, and the '*' will be automatically replaced with '*', as described URL looked a little uncomfortable ...
// Inherited jfinal the Model
// Implement AfterExtractor interfaces can perform other operations after filling properties
@TargetUrl("http://my.oschina.net/flashsword/blog/*")
public class OschinaBlog extends Model<OschinaBlog> implements AfterExtractor {

    // Will be automatically extracted with ExtractBy annotation fields and filling
    // Default xpath grammar
    @ExtractBy("//title")
    private String title;

    //Extract can be defined syntax Css, Regex, etc.
    @ExtractBy(value = "div.BlogContent", type = ExtractBy.Type.Css)
    private String content;

    //Multi labeling drawing result can be a List
    @ExtractBy(value = "//div[@class='BlogTags']/a/text()", multi = true)
    private List<String> tags;

    @Override
    public void afterProcess(Page page) {
        //Jfinal property is actually a Map instead of the field, it does not matter, I want to go in filling
        this.set("title", title);
        this.set("content", content);
        this.set("tags", StringUtils.join(tags, ","));
        //save
        save();
    }

    public static void main(String[] args) {
        C3p0Plugin c3p0Plugin = new C3p0Plugin("jdbc:mysql://127.0.0.1/blog?characterEncoding=utf-8", "blog", "password");
        c3p0Plugin.start();
        ActiveRecordPlugin activeRecordPlugin = new ActiveRecordPlugin(c3p0Plugin);
        activeRecordPlugin.addMapping("blog", OschinaBlog.class);
        activeRecordPlugin.start();
        //Start webmagic
        OOSpider.create(Site.me().addStartUrl("http://my.oschina.net/flashsword/blog/145796"), OschinaBlog.class).run();
    }
}

#### Conclusion

Annotation mode is now regarded as the end of the presentation, in WebMagic, the annotation model is in fact based entirely on `webmagic-core` the `PageProcessor` and `Pipeline` extension implementation, interested friends can go to look at the code.

This is partly achieved but it is still more complex, there is a problem if you find some of the details of the code, welcomed [feedback to me](https://github.com/code4craft/webmagic/issues).
