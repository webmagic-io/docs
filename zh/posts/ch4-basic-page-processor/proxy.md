## 4.7 配置代理

从0.7.0版本开始，WebMagic开始使用了新的代理API`ProxyProvider`。因为相对于Site的“配置”，ProxyProvider定位更多是一个“组件”，所以代理不再从Site设置，而是由`HttpClientDownloader`设置。


| API	| 说明 |
| -------- | ------- | 
| HttpClientDownloader.setProxyProvider(ProxyProvider proxyProvider)| 设置代理|

`ProxyProvider`有一个默认实现：`SimpleProxyProvider`。它是一个基于简单Round-Robin的、没有失败检查的ProxyProvider。可以配置任意个候选代理，每次会按顺序挑选一个代理使用。它适合用在自己搭建的比较稳定的代理的场景。

代理示例：

1. 设置单一的普通HTTP代理为101.101.101.101的8888端口，并设置密码为"username","password"

```java
	HttpClientDownloader httpClientDownloader = new HttpClientDownloader();
	httpClientDownloader.setProxyProvider(SimpleProxyProvider.from(new Proxy("101.101.101.101",8888,"username","password")));
	spider.setDownloader(httpClientDownloader);
```

2. 设置代理池，其中包括101.101.101.101和102.102.102.102两个IP，没有密码

```java
	HttpClientDownloader httpClientDownloader = new HttpClientDownloader();
	httpClientDownloader.setProxyProvider(SimpleProxyProvider.from(
	new Proxy("101.101.101.101",8888)
	,new Proxy("102.102.102.102",8888)));
```

如果对于代理部分有建议的，欢迎参与讨论[#579 更多的代理ProxyProvider实现](https://github.com/code4craft/webmagic/issues/579)