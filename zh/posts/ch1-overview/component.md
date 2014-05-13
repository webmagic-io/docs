### 1.3 项目组成

WebMagic项目代码包括几个部分，在根目录下以不同目录名分开。它们都是独立的Maven项目。
	
### 1.3.1 主要部分

WebMagic主要包括两个包，这两个包经过广泛实用，已经比较成熟：

####  webmagic-core
	
`webmagic-core`是WebMagic核心部分，只包含爬虫基本模块和基本抽取器。WebMagic-core的目标是成为网页爬虫的一个教科书般的实现。
	
####  webmagic-extension
	
`webmagic-extension`是WebMagic的主要扩展模块，提供一些更方便的编写爬虫的工具。包括注解格式定义爬虫、JSON、分布式等支持。

### 1.3.2 外围功能

除此之外，WebMagic项目里还有几个包，这些都是一些实验性的功能，目的只是提供一些与外围工具整合的样例。因为精力有限，这些包没有经过广泛的使用和测试，推荐使用方式是自行下载源码，遇到问题后再修改。

####  webmagic-samples

这里是作者早期编写的一些爬虫的例子。因为时间有限，这些例子有些使用的仍然是老版本的API，也可能有一些因为目标页面的结构变化不再可用了。最新的、精选过的例子，请看webmaigc-core的`us.codecraft.webmagic.processor.example`包和webmaigc-core的`us.codecraft.webmagic.example`包。

####  webmagic-scripts

WebMagic对于爬虫规则脚本化的一些尝试，目标是让开发者脱离Java语言，来进行简单、快速的开发。同时强调脚本的共享。

目前项目因为感兴趣的用户不多，处于搁置状态，对脚本化感兴趣的可以看这里：[webmagic-scripts简单文档](https://github.com/code4craft/webmagic/tree/master/webmagic-scripts)

####  webmagic-selenium

WebmMgic与Selenium结合的模块。Selenium是一个模拟浏览器进行页面渲染的工具，WebMagic依赖Selenium进行动态页面的抓取。

####  webmagic-saxon

WebMagic与Saxon结合的模块。Saxon是一个XPath、XSLT的解析工具，webmagic依赖Saxon来进行XPath2.0语法解析支持。

### 1.3.3 webmagic-avalon

`webmagic-avalon`是一个特殊的项目，它想基于WebMagic实现一个产品化的工具，涵盖爬虫的创建、爬虫的管理等后台工具。[Avalon](http://zh.wikipedia.org/wiki/%E9%98%BF%E7%93%A6%E9%9A%86)是亚瑟王传说中的“理想之岛”，`webmagic-avalon`的目标是提供一个通用的爬虫产品，达到这个目标绝非易事，所以取名也有一点“理想”的意味，但是作者一直在朝这个目标努力。

对这个项目感兴趣的可以看这里[WebMagic-Avalon项目计划](https://github.com/code4craft/webmagic/issues/43)。