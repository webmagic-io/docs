### 2.1 Використання Maven для управління залежністями

WebMagic побудована на Maven, тому настійно рекомендовано використання Maven для управління проектом. Ви можете додати WebMagic шляхом додавання наступних рядків у вашому файлі `pom.xml`:

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-core</artifactId>
    <version>0.7.1</version>
</dependency>
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.7.1</version>
</dependency>
```

Якщо ви не знайомі з Maven, Ось введення: [Що таке Maven?](http://maven.apache.org/what-is-maven.html)

WebMagic використовує `SLF4J-log4j12` як реалізація SLF4J. Якщо у вас є свій власний вибір SLF4J РЕАЛІЗАЦІЇ,
виключити форсу у ваші залежності.

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.7.1</version>
    <exclusions>
        <exclusion>
            <groupId>org.slf4j</groupId>
            <artifactId>slf4j-log4j12</artifactId>
        </exclusion>
    </exclusions>
</dependency>
```
