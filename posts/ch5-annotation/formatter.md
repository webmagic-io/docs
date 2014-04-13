### 5.5 结果的类型转换

类型转换（`Formatter`机制）是WebMagic 0.3.2增加的功能。因为抽取到的内容总是String，而我们想要的内容则可能是其他类型。Formatter可以将抽取到的内容，自动转换成一些基本类型，而无需手动使用代码进行转换。

例如：

```java
@ExtractBy("//ul[@class='pagehead-actions']/li[1]//a[@class='social-count js-social-count']/text()")
private int star;
```

#### 5.5.1 自动转换支持的类型

自动转换支持所有基本类型和装箱类型。

| 基本类型 | 装箱类型 |
| ------------ | ---------|
| int | Integer | 
| long | Long |
| double | Double |
| float | Float |
| short | Short |
| char | Character |
| byte | Byte |
| boolean | Boolean |

另外，还支持`java.util.Date`类型的转换。但是在转换时，需要指定Date的格式。格式按照JDK的标准来定义，具体规范可以看这里：[http://java.sun.com/docs/books/tutorial/i18n/format/simpleDateFormat.html](http://java.sun.com/docs/books/tutorial/i18n/format/simpleDateFormat.html)

```java
@Formatter("yyyy-MM-dd HH:mm")
@ExtractBy("//div[@class='BlogStat']/regex('\\d+-\\d+-\\d+\\s+\\d+:\\d+')")
private Date date;
```

#### 5.5.2 显式指定转换类型

一般情况下，Formatter会根据字段类型进行转换，但是特殊情况下，我们会需要手动指定类型。这主要发生在字段是`List`类型的时候。

```java
@Formatter(value = "",subClazz = Integer.class)
@ExtractBy(value = "//div[@class='id']/text()", multi = true)
private List<Integer> ids;
```

#### 5.5.3 自定义Formatter（TODO）

实际上，除了自动类型转换之外，Formatter还可以做一些结果的后处理的事情。例如，我们有一种需求场景，需要将抽取的结果作为结果的一部分，拼接上一部分字符串来使用。在这里，我们定义了一个`StringTemplateFormatter`。

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

那么，我们就能在抽取之后，做一些简单的操作了！

```java
@Formatter(value = "author is %s",formatter = StringTemplateFormatter.class)
@ExtractByUrl("https://github\\.com/(\\w+)/.*")
private String author;
```

此功能在0.4.3版本有BUG，将会在0.5.0中修复并开放。