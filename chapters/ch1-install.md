## 1. 使用WebMagic

WebMagic主要包含两个jar包：`webmagic-core-{version}.jar`和`webmagic-extension-{version}.jar`。在项目中添加这两个包的依赖，即可使用WebMagic。

### 1.1 使用Maven

WebMagic基于Maven进行构建，推荐使用Maven来安装WebMagic。在项目中添加以下坐标即可：

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.4.3</version>
</dependency>
```

WebMagic使用slf4j-log4j12作为slf4j的实现.如果你自己定制了slf4j的实现，请在项目中去掉此依赖。

```xml
<dependency>
    <groupId>us.codecraft</groupId>
    <artifactId>webmagic-extension</artifactId>
    <version>0.4.3</version>
    <exclusions>
    <exclusion>
        <groupId>org.slf4j</groupId>
        <artifactId>slf4j-log4j12</artifactId>
    </exclusion>
</exclusions>
</dependency>
```

### 1.2 不使用Maven

不使用maven的用户，可以下载附带二进制jar包的版本(感谢[oschina](http://www.oschina.net/))：

	git clone http://git.oschina.net/flashsword20/webmagic.git

在**lib**目录下，有项目依赖的所有jar包，直接在IDE里，将这些jar添加到Libraries即可。

![import jars](http://static.oschina.net/uploads/space/2014/0403/102848_ETcU_190591.png)

### 1.3 第一个项目

在你的项目中添加了WebMagic的依赖之后，即可开始第一个爬虫的开发了！我们这里拿一个抓取Github信息的例子：

```java
import us.codecraft.webmagic.Page;
import us.codecraft.webmagic.Site;
import us.codecraft.webmagic.Spider;
import us.codecraft.webmagic.processor.PageProcessor;

public class GithubRepoPageProcessor implements PageProcessor {

    private Site site = Site.me().setRetryTimes(3).setSleepTime(100);

    @Override
    public void process(Page page) {
        page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
        page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
        page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
        if (page.getResultItems().get("name")==null){
            //skip this page
            page.setSkip(true);
        }
        page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));
    }

    @Override
    public Site getSite() {
        return site;
    }

    public static void main(String[] args) {
        Spider.create(new GithubRepoPageProcessor()).addUrl("https://github.com/code4craft").thread(5).run();
    }
}
```

点击main方法，选择“运行”，你会发现爬虫已经可以正常工作了！

![runlog](http://static.oschina.net/uploads/space/2014/0403/103741_3Gf5_190591.png)