### 5.3 使用ExtractBy进行抽取

`@ExtractBy`是一个用于抽取元素的注解，它描述了一种抽取规则。

#### 5.3.1 初识ExtractBy注解

@ExtractBy注解主要作用于字段，它表示“使用这个抽取规则，将抽取到的结果保存到这个字段中”。例如：

```java
@ExtractBy("//div[@id='readme']/text()")
private String readme;
```
这里"//div[@id='readme']/text()"是一个XPath表示的抽取规则，而抽取到的结果则会保存到readme字段中。

#### 5.3.2 使用其他抽取方式

除了XPath，我们还可以使用其他抽取方式来进行抽取，包括CSS选择器、正则表达式和JsonPath，在注解中指明`type`之后即可。

```java
@ExtractBy(value = "div.BlogContent", type = ExtractBy.Type.Css)
private String content;
```

#### 5.3.3 notnull

@ExtractBy包含一个`notNull`属性，如果熟悉mysql的同学一定能明白它的意思：此字段不允许为空。如果为空，这条抽取到的结果会被丢弃。对于一些页面的关键性属性（例如文章的标题等），设置`notnull`为`true`，可以有效的过滤掉无用的页面。

`notNull`默认为`false`。