### 5.5 Results of type conversion

Type Conversion ( `Formatter` mechanism) is WebMagic 0.3.2 increased functionality. Because the content is always drawn to String, and we want may be other types of content. Formatter can be drawn into the content is automatically converted into a number of basic types without having to manually use the code conversion.

E.g:

```java
@ExtractBy("//ul[@class='pagehead-actions']/li[1]//a[@class='social-count js-social-count']/text()")
private int star;
```

#### 5.5.1 supports automatic conversion type

Automatic conversion supports all basic types and packing type.

| Primitive | packing type |
| ------------ | ---------|
| int | Integer | 
| long | Long |
| double | Double |
| float | Float |
| short | Short |
| char | Character |
| byte | Byte |
| boolean | Boolean |

In addition, it supports `java.util.Date` type conversion. However, when you convert, you need to specify the Date format. Format according to standard JDK defined, specific norms can be seen here: [http://java.sun.com/docs/books/tutorial/i18n/format/simpleDateFormat.html](http://java.sun.com/docs/books/tutorial/i18n/format/simpleDateFormat.html)

```java
@Formatter("yyyy-MM-dd HH:mm")
@ExtractBy("//div[@class='BlogStat']/regex('\\d+-\\d+-\\d+\\s+\\d+:\\d+')")
private Date date;
```

#### 5.5.2 explicitly specify conversion types

Under normal circumstances, Formatter will be converted according to the field type, but under special circumstances, we will need to manually specify the type. This occurs mainly in the field type is `List` time.

```java
@Formatter(value = "",subClazz = Integer.class)
@ExtractBy(value = "//div[@class='id']/text()", multi = true)
private List<Integer> ids;
```

#### 5.5.3 Custom Formatter (TODO)

In fact, in addition to the automatic type conversion, Formatter also can do some things to process the results. For example, we have a demand scenario, the results need to be extracted as a result of part of the mosaic on the part of the string to use. Here, we define a `StringTemplateFormatter`.

```java
public class StringTemplateFormatter implements ObjectFormatter<String> {

    private String template;

    @Override
    public String format(String raw) throws Exception {
        return String.format(template, raw);
    }

    @Override
    public Class<String> clazz() {
        return String.class;
    }

    @Override
    public void initParam(String[] extra) {
        template = extra[0];
    }
}
```

Well, we can, after extraction, to do some of the simple operation!

```java
@Formatter(value = "author is %s",formatter = StringTemplateFormatter.class)
@ExtractByUrl("https://github\\.com/(\\w+)/.*")
private String author;
```

This feature in version 0.4.3 BUG, ​​and will be fixed in 0.5.0 are open.
