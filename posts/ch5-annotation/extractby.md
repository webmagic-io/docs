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

#### 5.3.4 multi（已废弃）

`multi`是一个boolean属性，它表示这条抽取规则是对应多条记录还是单条记录。对应的，这个字段必须为`java.util.List`类型。在0.4.3之后，当字段为List类型时，这个属性会自动为true，无须再设置。

* 0.4.3以前

	```java
	@ExtractBy(value = "//div[@class='BlogTags']/a/text()", multi = true)
	private List<String> tags;
	```
	
* 0.4.3及以后

	```java
	@ExtractBy("//div[@class='BlogTags']/a/text()")
	private List<String> tags;
	```
	
#### 5.3.5 ComboExtract（已废弃）

`@ComboExtract`是一个比较复杂的注解，它可以将多个抽取规则进行组合，组合方式包括"AND/OR"两种方式。

在WebMagic 0.4.3版本中使用了Xsoup 0.2.0版本。在这个版本，XPath支持的语法大大加强了，不但支持XPath和正则表达式组合使用，还支持“|”进行或运算。所以作者认为，`ComboExtract`这种复杂的组合方式，已经不再需要了。

* XPath与正则表达式组合

    ```java
    @ExtractBy("//div[@class='BlogStat']/regex('\\d+-\\d+-\\d+\\s+\\d+:\\d+')")
    private Date date;
    ```

* XPath的取或

    ```java
    @ExtractBy("//div[@id='title']/text() | //title/text()")
    private String title;
    ```