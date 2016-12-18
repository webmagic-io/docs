### 2.1 Use Maven to manage your dependency

WebMagic is built on Maven, so it is highly recommanded to use Maven to manage your project. You can add WebMagic
by appending following lines to your `pom.xml`:

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-core</artifactId>
    <version>0.6.0</version>
</dependency>
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.6.0</version>
</dependency>
```

If you are not familiar with Maven, Here is an introduction: [What is Maven?](http://maven.apache.org/what-is-maven.html)

WebMagic uses `slf4j-log4j12` as the implemetation of slf4j. If you have your own choice of slf4j implemetation,
exclude the former from your dependency.

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.6.0</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
