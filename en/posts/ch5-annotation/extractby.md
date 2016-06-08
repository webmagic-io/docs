### 5.3 `@ExtractBy`

`@ExtractBy` annotation is used to extract a element, which describes an extraction rule.

#### 5.3.1 Intro to @ExtractBy annotation

@ExtractBy Annotation major role in the field, it means "the use of the extraction rules, to save the extracted result into this field." E.g:

```java
@ExtractBy("//div[@id='readme']/text()")
private String readme;
```
Here "//div[@id='readme']/text()" is a representation of the XPath extraction rules, and to extract the results will be saved to the readme field.

#### 5.3.2 use other ways to extract

In addition to XPath, we can also use other ways to extract extraction, including CSS selectors, regular expressions and JsonPath, indicated in a annotation after the `type` can.

```java
@ExtractBy(value = "div.BlogContent", type = ExtractBy.Type.Css)
private String content;
```

#### 5.3.3 notNull

@ExtractBy Contains a `notNull` property, if familiar with mysql students must be able to understand what it means: This field does not allow empty. If empty, this extract to the result is discarded. For critical attributes (such as the title of the article, etc.) some of the pages, set `notnull` to `true`, you can effectively filter out unwanted pages.

`NotNull` default is `false`.

#### 5.3.4 multi (deprecated)

`Multi` is a boolean attribute that represents this extraction rule corresponding number of records or a single record. Corresponding to this field must be `java.util.List` type. After 0.4.3, when the field is a List type, this property will automatically true, no longer need to set up.

* 0.4.3 before

	```java
	@ExtractBy(value = "//div[@class='BlogTags']/a/text()", multi = true)
	private List<String> tags;
	```

* 0.4.3 and later

	```java
	@ExtractBy("//div[@class='BlogTags']/a/text()")
	private List<String> tags;
	```

#### 5.3.5 ComboExtract (deprecated)

`@ComboExtract` is a more complex notes, it can be a combination of a plurality of extraction rules, combinations including "AND/OR" in two ways.

Use the Xsoup 0.2.0 version WebMagic 0.4.3 version. In this version, XPath syntax supported greatly strengthened, not only supports the XPath and regular expressions used in combination, also supports the "|" ORed. Therefore author thinks, `ComboExtract` this complex combination, are no longer needed.

* XPath combination with regular expressions

    ```java
    @ExtractBy("//div[@class='BlogStat']/regex('\\d+-\\d+-\\d+\\s+\\d+:\\d+')")
    private Date date;
    ```

* XPath or take

    ```java
    @ExtractBy("//div[@id='title']/text() | //title/text()")
    private String title;
    ```

#### 5.3.6 ExtractByUrl

`@ExtractByUrl` is a separate annotation, it means "be extracted from the URL." It only supports regular expressions as extraction rules.
