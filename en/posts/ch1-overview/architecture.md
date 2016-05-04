### 1.2 overall architecture

WebMagic structured into `Downloader`, `PageProcessor`, `Scheduler`, ` Pipeline` four components by Spider will organize them with each other. This component corresponds to the four crawler lifecycle download, processing, management, and persistence capabilities. WebMagic design reference Scapy, but the implementation of some of the more Java.

The Spider will be several components to organize themselves so that they can interact with each other, the process of implementation can be considered Spider is a large container, it is also the core WebMagic logic.

WebMagic overall architecture is as follows:

![image](http://code4craft.github.io/images/posts/webmagic.png)

The four components 
### 1.2.1 WebMagic

#### 1.Downloader

Downloader responsible for downloading from the Internet page, for subsequent processing. WebMagic default of [Apache HttpClient](http://hc.apache.org/index.html) as a download tool.

#### 2.PageProcessor

PageProcessor responsible for parsing the page, extract useful information, as well as the discovery of new links. WebMagic use [Jsoup](http://jsoup.org/) as HTML parsing tools, based on its development of an analytical tool XPath [Xsoup](https://github.com/code4craft/xsoup).

In these four components, `PageProcessor` not the same for each page of each site, the user is required to customize parts.

#### 3.Scheduler

URL Scheduler manages to be crawled, as well as some heavy to work. WebMagic provided by default JDK memory queue management URL, and set to go with the weight. Redis also supports the use of distributed management.

Unless the project has distributed some special needs, you do not need to customize their own Scheduler.

#### 4.Pipeline

Processing Pipeline responsible for taking the results, including calculations, persisted to files, databases and so on. WebMagic provided by default "to the console" and "Save to File" two results treatment program.

`Pipeline` defines the way results are saved, if you want to save to the specified database, you need to write the corresponding Pipeline. For a class generally only needs to write a `Pipeline`.

### 1.2.2 for data transfer objects

#### 1. Request

`Request` is a URL address layer package, a Request corresponding to a URL address.

It is the carrier PageProcessor interact with Downloader, Downloader is the only way to PageProcessor control.

In addition to the URL itself, it contains a Key-Value Structure field `extra`. You can save some extra special attributes, and then read in other places to perform different functions. For example, some additional information on one page and so on.

#### 2. Page

`Page` representatives from Downloader to download a page - may be HTML, it may be the content of JSON, or other text formats.

Page WebMagic extraction process is the core of the object, which provides methods for extraction, save the results and so on. In the case of the fourth chapter, we will detail its use.

#### 3. ReusltItems

`ReusltItems` equivalent to a Map, which holds the result PageProcessor processing for use Pipeline. Map and its API is very similar, it is worth noting that it has a field `skip`, if set to true, the Pipeline should not be processed.

### 1.2.3 Control crawler running engine --Spider

Spider is the core WebMagic internal processes. A property Downloader, PageProcessor, Scheduler, Pipeline is the Spider, these properties can be freely set by setting this property can perform different functions. Spider WebMagic also operate the entrance, which encapsulates the creation of crawlers, start, stop, multi-threading capabilities. Here is a set of each component, and set an example of multi-threading and startup. See detailed Spider setting Chapter 4 - [crawler configuration, start and stop](../ch4-basic-page-processor/spider-config.html).

```java
public static void main(String[] args) {
    Spider.create(new GithubRepoPageProcessor())
            // From https://github.com/code4craft began to grasp    
            .addUrl("https://github.com/code4craft")
            // Set the Scheduler, use Redis to manage URL queue
            .setScheduler(new RedisScheduler("localhost"))
            // Set Pipeline, will result in json way to save a file
            .addPipeline(new JsonFilePipeline("D:\\data\\webmagic"))
            //Open 5 simultaneous execution threads
            .thread(5)
            //Start crawler
            .run();
}
```

### 1.2.4 Quick Start

A lot of the components described above, but in fact the user need to be concerned not so much, because most of the module WebMagic already provides a default implementation.

In general, for the preparation of a crawler, `PageProcessor` is part of the need to write, and `Spider` is created and controlled entrance crawlers. In the fourth chapter, we will explain how to write a crawler customized PageProcessr, and by Spider to start.
