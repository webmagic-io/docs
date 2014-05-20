### 6.2 Customized Scheduler
The scheduler is a components of the WebMagic which manage the url.In general, there are two effect of the scheduler:
1. manage the url which is wait to be crawl
2. filter out the repeat url

WebMagic have some common schedular. If you just want to run some simple sprider in your local, then you needn't to customize scheduler.But it is meaningful for you to know some of them.

|Class|Discreption|Remark|
| -------- | ------- | ------- |
|DuplicateRemovedScheduler|a abstract class,it provide some template method|extends it can achieve your own function
|QueueScheduler|use the memory queue to save the url| |
|PriorityScheduler|use the priority mamory queue to save the url|the use of memory is bigger than the QueueScheduler，but whne you set the request.priority.it is necessary to use the PriorityScheduler to take the priority effect |
|FileCacheQueueScheduler|use the file to save the url，when the program exit and start next time，it can crawl the url which have been saved in the file|it need to set the path of the file. It will create two files .urls.txt and .cursor.txt |
|RedisScheduler|use the redis to save the queue, it can crawl the internet in a distrubuted system|need to install redis and start it|

In the Version 0.5.1,i jave rebuild the scheduler.The duplicated remover have been extract to a independent interface:`DuplicateRemover`.Then you can set a different `DuplicateRemover` for one scheduler.There are two ways of remove the Duplicate.

|Class|Discreption|
| -------- | ------- |
|HashSetDuplicateRemover|use the hashset to remove,but it needs a lots of memory|
|BloomFilterDuplicateRemover|use the BloomFilter to remove, use a few of memory. But it may leave out a few url| |

All the default scheduler use the `HashSetDuplicateRemover` to remove(except the RedisScheduler).If you have a mount of url to do this, we recommend you to use the `BloomFilterDuplicateRemover` . For example:

```java
spider.setScheduler(new QueueScheduler()
.setDuplicateRemover(new BloomFilterDuplicateRemover(10000000)) //10000000 is the estimate value of urls
)
```


