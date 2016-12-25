### 6.2 使用和定制Scheduler

Scheduler是WebMagic中进行URL管理的组件。一般来说，Scheduler包括两个作用：

1. 对待抓取的URL队列进行管理。
2. 对已抓取的URL进行去重。

WebMagic内置了几个常用的Scheduler。如果你只是在本地执行规模比较小的爬虫，那么基本无需定制Scheduler，但是了解一下已经提供的几个Scheduler还是有意义的。

|类|说明|备注|
| -------- | ------- | ------- |
|DuplicateRemovedScheduler|抽象基类，提供一些模板方法|继承它可以实现自己的功能
|QueueScheduler|使用内存队列保存待抓取URL| |
|PriorityScheduler|使用带有优先级的内存队列保存待抓取URL|耗费内存较QueueScheduler更大，但是当设置了request.priority之后，只能使用PriorityScheduler才可使优先级生效 |
|FileCacheQueueScheduler|使用文件保存抓取URL，可以在关闭程序并下次启动时，从之前抓取到的URL继续抓取|需指定路径，会建立.urls.txt和.cursor.txt两个文件 |
|RedisScheduler|使用Redis保存抓取队列，可进行多台机器同时合作抓取|需要安装并启动redis|

在0.5.1版本里，我对Scheduler的内部实现进行了重构，去重部分被单独抽象成了一个接口：`DuplicateRemover`，从而可以为同一个Scheduler选择不同的去重方式，以适应不同的需要，目前提供了两种去重方式。

|类|说明|
| -------- | ------- |
|HashSetDuplicateRemover|使用HashSet来进行去重，占用内存较大|
|BloomFilterDuplicateRemover|使用BloomFilter来进行去重，占用内存较小，但是可能漏抓页面| |

所有默认的Scheduler都使用HashSetDuplicateRemover来进行去重，（除开RedisScheduler是使用Redis的set进行去重）。如果你的URL较多，使用HashSetDuplicateRemover会比较占用内存，所以也可以尝试以下BloomFilterDuplicateRemover[^1]，使用方式：

```java
spider.setScheduler(new QueueScheduler()
.setDuplicateRemover(new BloomFilterDuplicateRemover(10000000)) //10000000是估计的页面数量
)
```
[^1]: 0.6.0版本后，如果使用BloomFilterDuplicateRemover，需要单独引入Guava依赖包。