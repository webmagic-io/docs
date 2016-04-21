### 4.3 Save the results

Well, crawlers written and now we may have a question: If I want to grab the results saved, how to do it? Components WebMagic to hold the result is called `Pipeline`. For example, we adopted "console output" it is through a built-in Pipeline completed, it is called `ConsolePipeline`. Well, I now want to save the results down by Json format, how to do it? I just need to be replaced to achieve Pipeline "JsonFilePipeline" on it.

```java
public static void main(String[] args) {
    Spider.create(new GithubRepoPageProcessor())
            // From "https://github.com/code4craft" began to grasp
            .addUrl("https://github.com/code4craft")
            .addPipeline(new JsonFilePipeline("D:\\webmagic\\"))
            // Open 5 threads of Crawl
            .thread(5)
            // Start Crawl
            .run();
}
```

Like this downloaded file will be saved in the disk D: directory webmagic.

By customizing Pipeline, we can achieve save the results to a file, a database and a series of functions. This will be introduced in Chapter 7, "to extract a result Handling".

Thus far, we have completed the basic preparation of a crawler, but also has a number of customization features.
