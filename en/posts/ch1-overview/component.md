### 1.3 Project Components

WebMagic project code consists of several parts, in the root directory to a different directory name separately. They are independent of the Maven project.

### 1.3.1 The main part

WebMagic includes two packages, both packages through extensive practical, more mature:

#### Webmagic-core

`Webmagic-core` is WebMagic core part, only contains the basic modules and basic crawler extractor. WebMagic-core goal is to become a textbook pages crawler-like implementation.

#### Webmagic-extension

`Webmagic-extension` is WebMagic major expansion module that provides some of the more convenient tool written in crawlers. Including annotation format definition crawlers, JSON, distributed and other support.

### 1.3.2 Peripheral functions 

In addition, WebMagic projects in several packages, these are some experimental features, and the purpose is to provide some tools to integrate peripheral sample. Because of the limited energy, these packages have not been widely used and tested, recommended way is to download the source code, then modify encounter problems.

#### Webmagic-samples

Here are some examples of crawlers author written earlier. Because of the limited time, some of these examples use is still the old version of the API, but also because there may be some changes in the structure of the target page is no longer available. To date, been featured examples, see the `us.codecraft.webmagic.processor.example` webmagic-core package and the `webmaigc-core package of us.codecraft.webmagic.example`.

#### Webmagic-scripts

WebMagic for crawlers rule scripted some attempts, the goal is to allow developers from the Java language, for simple, rapid development. While emphasizing the shared script.

Currently the project because the user is not much interested in, on hold, you can look for scripted interest here: [webmagic-scripts simple document] (https://github.com/code4craft/webmagic/tree/master/webmagic- scripts)

#### Webmagic-selenium

WebMagic and Selenium combined modules. Selenium is an analog browser page rendering tools, WebMagic rely Selenium crawl dynamic pages.

#### Webmagic-saxon

WebMagic and Saxon binding module. Saxon is a XPath, XSLT analytical tools, webmagic rely Saxon to XPath2.0 parsing support.

### 1.3.3 webmagic-avalon

`Webmagic-avalon` is a special project, it wants to achieve a product based on WebMagic of tools that covers the creation of crawlers, crawlers and other backend management tools. [Avalon] (http://zh.wikipedia.org/wiki/%E9%98%BF%E7%93%A6%E9%9A%86) Arthurian legend is the "ideal island", `webmagic-avalon `the goal is to provide a common crawler products achieve this goal is not easy, so the name is also a little" ideal "means, but the author has been striving towards this goal.

You can look interested in this project here [WebMagic-Avalon project] (https://github.com/code4craft/webmagic/issues/43).
