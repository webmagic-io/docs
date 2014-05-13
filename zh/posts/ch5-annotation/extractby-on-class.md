### 5.4 在类上使用ExtractBy

在之前的注解模式中，我们一个页面只对应一条结果。如果一个页面有多个抽取的记录呢？例如在“QQ美食”的列表页面[http://meishi.qq.com/beijing/c/all](http://meishi.qq.com/beijing/c/all)，我想要抽取所有商户名和优惠信息，该怎么办呢？

在类上使用`@ExtractBy`注解可以解决这个问题。

在类上使用这个注解的意思很简单：使用这个结果抽取一个区域，让这块区域对应一个结果。

```java
@ExtractBy(value = "//ul[@id=\"promos_list2\"]/li",multi = true)
public class QQMeishi {
	……
}
```

对应的，在这个类中的字段上再使用`@ExtractBy`的话，则是从这个区域而不是整个页面进行抽取。如果这个时候仍想要从整个页面抽取，则可以设置`source = RawHtml`。

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