## 6.Customize Components
In the chapter One, we reference the components of WebMagic. WebMagic the biggest advantage is that you can customize the function of components flexible to achieve the function you want to have.

In the Spider class, `PageProcessor`、`Downloader`、`Scheduler` and `Pipeline` are the fields of Spider class. Beside the `PageProcessor` have been assigned when the Spider create, the other three components can be changed by the setter function.

|Function|Description|Example|
|-----|------|------|
|setScheduler()|Change the Scheduler|spipder.setScheduler(new FileCacheQueueScheduler("D:\\data\\webmagic"))|
|setDownloader()|Change theDownloader|spipder.setDownloader(new SeleniumDownloader()))|
|addDownloader()|Change the Pipeline，one Spider can have a few of pipeline|spipder.addPipeline(new FilePipeline())|
