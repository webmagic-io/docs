### 6.3 使用Downloader

WebMagic的默认Downloader基于HttpClient。一般来说，你无须自己实现Downloader，不过HttpClientDownloader也预留了几个扩展点，以满足不同场景的需求。

另外，你可能希望通过其他方式来实现页面下载，例如使用`SeleniumDownloader`来渲染动态页面。