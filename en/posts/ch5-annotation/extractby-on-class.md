### 5.4 Use in Class ExtractBy

In the previous annotation mode, we have a page corresponds to only one result. If a page has multiple extracted record it? For example, in "QQ food" list page [http://meishi.qq.com/beijing/c/all](http://meishi.qq.com/beijing/c/all), I want to extract all businesses Get names and information, how to do it?

Use `@ExtractBy` annotation on the class can solve this problem.

Using this annotation on the class meaning is very simple: use this result to extract a region, so that this region corresponds to a result.

```java
@ExtractBy(value = "//ul[@id=\"promos_list2\"]/li",multi = true)
public class QQMeishi {
	……
}
```

Correspondence, then use the `@ExtractBy` in this field in the class, then from this area rather than the entire page extraction. If this time still want to extract from the entire page, you can set the `source = RawHtml`.


```java
@TargetUrl("http://meishi.qq.com/beijing/c/all[\\-p2]*")
@ExtractBy(value = "//ul[@id=\"promos_list2\"]/li",multi = true)
public class QQMeishi {

    @ExtractBy("//div[@class=info]/a[@class=title]/h4/text()")
    private String shopName;

    @ExtractBy("//div[@class=info]/a[@class=title]/text()")
    private String promo;

    public static void main(String[] args) {
        OOSpider.create(Site.me(), new ConsolePageModelPipeline(), QQMeishi.class).addUrl("http://meishi.qq.com/beijing/c/all").thread(4).run();
    }

}
```
