### 5.1 编写Model类

同第四章的例子一样，我们这里抽取一个github项目的名称、作者和简介三个信息，所以我们定义了一个Model类。

```java
public class GithubRepo {

    private String name;

    private String author;

    private String readme;

}
```

这里省略了getter和setter方法。

在抽取最后，我们会得到这个类的一个或者多个实例，这就是爬虫的结果。