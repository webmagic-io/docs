### 6.2 定制Scheduler

Scheduler是WebMagic中进行URL管理的组件，它进行URL的去重，并保存待抓取的URL。WebMagic内置了几个常用的Scheduler。如果你只是在本地执行规模比较小的爬虫，那么基本无需定制Scheduler。而定制Scheduler，则可以满足一些分布式的、大规模的爬虫，或者一些定制爬虫的需要。

> 0.5.0的RedisScheduler存在BUG，[issue #117](https://github.com/code4craft/webmagic/issues/117)

#### 6.2.1 WebMagic内置的几个Scheduler

我们先从WebMagic内置的几个Scheduler来说明一下它的作用。

|类|说明|备注|
|--|----|
|DuplicatedRemoveScheduler|抽象基类，提供一些模板方法|
|LocalDuplicatedRemoveScheduler|基类，使用内存Set进行去重|当URL量比较大的时候，建议使用BloomFilter等技术进行去重|
|QueueScheduler|使用内存队列保存待抓取URL|