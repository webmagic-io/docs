---
title: 6.2 Customized Scheduler
layout: post
author: asshyrin
source-id: 1J_cDTx-uXTR2EkM79l1CnkKXb_hCMgy0j-YgheYQTzc
published: true
---
### **6.2 Customized Scheduler**

The scheduler is a components of the WebMagic which manage the url.Inurl. In general, there are two effect of the scheduler: 1. manage the url which is wait to be crawl 2. filter out the repeat url

WebMagic have some common schedular. If you just want to run some simple sprider in your local, then you needn't to customize scheduler.But it is meaningful for you to know some of them.

<table>
  <tr>
    <td>Class</td>
    <td>Discreption</td>
    <td>Remark</td>
  </tr>
  <tr>
    <td>DuplicateRemovedScheduler</td>
    <td>a abstract class,it provide some template method</td>
    <td>extends it can achieve your own function</td>
  </tr>
  <tr>
    <td>QueueScheduler</td>
    <td>use the memory queue to save the url</td>
    <td></td>
  </tr>
  <tr>
    <td>PriorityScheduler</td>
    <td>use the priority mamory queue to save the url</td>
    <td>the use of memory is bigger than the QueueScheduler，but whne you set the request.priority.it is necessary to use the PriorityScheduler to take the priority effect</td>
  </tr>
  <tr>
    <td>FileCacheQueueScheduler</td>
    <td>use the file to save the url，when the program exit and start next time，it can crawl the url which have been saved in the file</td>
    <td>it need to set the path of the file. It will create two files .urls.txt and .cursor.txt</td>
  </tr>
  <tr>
    <td>RedisScheduler</td>
    <td>use the redis to save the queue, it can crawl the internet in a distrubuted system</td>
    <td>need to install redis and start it</td>
  </tr>
</table>


In the Version 0.5.1,i jave rebuild the scheduler.The duplicated remover have been extract to a independent interface:DuplicateRemover.Then you can set a different DuplicateRemover for one scheduler.There are two ways of remove the Duplicate.

<table>
  <tr>
    <td>Class</td>
    <td>Discreption</td>
  </tr>
  <tr>
    <td>HashSetDuplicateRemover</td>
    <td>use the hashset to remove,but it needs a lots of memory</td>
  </tr>
  <tr>
    <td>BloomFilterDuplicateRemover</td>
    <td>use the BloomFilter to remove, use a few of memory. But it may leave out a few url</td>
  </tr>
</table>


All the default scheduler use the HashSetDuplicateRemover to remove(except the RedisScheduler).If you have a mount of url to do this, we recommend you to use the BloomFilterDuplicateRemover . For example:

spider.setScheduler(new QueueScheduler().setDuplicateRemover(new BloomFilterDuplicateRemover(10000000)) //10000000 is the estimate value of urls)

