### 1.1 WebMagic design ideas

![logo](https://raw.github.com/code4craft/webmagic/master/assets/logo.jpg)

#### 1. A framework, a field

A good framework inevitable combination of domain knowledge. WebMagic design reference to the industry's best crawler Scrapy, realized the application of HttpClient, Jsoup the world's most mature and other Java tools, the goal is to do a Java implementation language textbook Web crawler.

If you are a veteran crawler develop, then WebMagic will be very easy to use, it is almost use Java native development mode, but provides some constraints modular, encapsulated some of the cumbersome operation, and provides some convenient features.

If you are a novice crawler to develop, use and understand WebMagic let you know crawler develop common mode, tool chain, as well as handling a number of issues. Familiar with Thereafter, believe in yourself from scratch to develop a crawler is nothing difficult.

Because of this goal, the core WebMagic very simple - here, the functional simplicity is to give concessions.

#### 2. microkernel and high scalability

WebMagic consists of four components (Downloader, PageProcessor, Scheduler, Pipeline) constitute the core of the code is very simple, is to combine these components and complete multi-threaded tasks. This means that in WebMagic, you can basically do any customization features crawlers.

Core WebMagic in webmagic-core package, other packages that you can be understood as an extension of WebMagic - this and as a user-written extensions are no different.

#### 3. focus on practicality

Although the core needs to be simple enough, but WebMagic also expanded, enabling a lot of convenient features to help developers. For example crawler-based annotation mode of development, and expansion of the XPath syntax Xsoup like. These functions WebMagic is optional, their development goal is to let users develop crawlers as simple as possible, easy to maintain as much as possible.
