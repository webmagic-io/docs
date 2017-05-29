### 2.1 使用Maven

WebMagic基于Maven进行构建，推荐使用Maven来安装WebMagic。在你自己的项目（已有项目或者新建一个）中添加以下坐标即可：

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-core</artifactId>
    <version>0.7.0</version>
</dependency>
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.7.0</version>
</dependency>
```

如果你对Maven使用还不熟悉，推荐看看@黄勇的博客：[《Maven 那点事儿》](http://my.oschina.net/huangyong/blog/194583)。

WebMagic使用slf4j-log4j12作为slf4j的实现.如果你自己定制了slf4j的实现，请在项目中去掉此依赖。

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.7.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
