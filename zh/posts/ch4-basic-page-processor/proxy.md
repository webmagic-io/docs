## 4.7 配置代理(beta)

从0.4.0版本开始，WebMagic开始支持Http代理，并且在0.5.2版本由网友[@yxssfxwzy](https://github.com/yxssfxwzy)提交了一个可自动切换的代理池。

因为场景的多样性，代理这部分API一直处于不稳定状态，但是因为需求确实存在，所以WebMagic会继续支持代理部分的完善。目前发布的API只是beta版，后续API可能会有更改。代理相关的设置都在Site类中。


| API	| 说明 |
| -------- | ------- | 
| Site.setHttpProxy(HttpHost httpProxy)| 设置单一的普通HTTP代理|
|Site.setUsernamePasswordCredentials(UsernamePasswordCredentials usernamePasswordCredentials)	| 为HttpProxy设置账号密码| 
|Site.setHttpProxyPool(List\<String[]> httpProxyList, boolean isUseLastProxy)	| 设置代理池 | 

代理示例：

1. 设置单一的普通HTTP代理为101.101.101.101的8888端口，并设置密码为"username","password"

```java
	site.setHttpProxy(new HttpHost("101.101.101.101",8888))
	.setUsernamePasswordCredentials(new UsernamePasswordCredentials("username","password"))
```

2. 设置代理池，其中包括101.101.101.101和102.102.102.102两个IP

```java
	List<String[]> poolHosts = new ArrayList<String[]>();
	poolHosts.add(new String[]{"101.101.101.101","8888"});
	poolHosts.add(new String[]{"102.102.102.102","8888"});
	//httpProxyList输入是IP+PORT, isUseLastProxy是指重启时是否使用上一次的代理配置
	site.setHttpProxyPool(poolHosts,false);
```

0.6.0版本后，允许实现自己的代理池，通过扩展接口`ProxyPool`来实现。目前WebMagic的代理池逻辑是：轮流使用代理池中的IP，如果某个IP失败超过20次则增加2小时的重用时间，具体实现可以参考`SimpleProxyPool`。

如果对于代理部分有建议的，欢迎参与讨论[#432 代理API和需求征集](https://github.com/code4craft/webmagic/issues/432)