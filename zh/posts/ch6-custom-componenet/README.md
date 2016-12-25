## 6. 组件的使用和定制

在第一章里，我们提到了WebMagic的组件。WebMagic的一大特色就是可以灵活的定制组件功能，实现你自己想要的功能。

在Spider类里，`PageProcessor`、`Downloader`、`Scheduler`和`Pipeline`四个组件都是Spider的字段。除了PageProcessor是在Spider创建的时候已经指定，`Downloader`、`Scheduler`和`Pipeline`都可以通过Spider的setter方法来进行配置和更改。

|方法|说明|示例
|-|-|
|setScheduler()|设置Scheduler|spipder.setScheduler(new FileCacheQueueScheduler("D:\\data\\webmagic"))|
|setDownloader()|设置Downloader|spipder.setDownloader(new SeleniumDownloader()))|
|addPipeline()|设置Pipeline，一个Spider可以有多个Pipeline|spipder.addPipeline(new FilePipeline())|

在这一章，我们会讲到如何定制这些组件，完成我们想要的功能。