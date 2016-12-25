### 4.8 处理非HTTP GET请求(beta)

一般来说，爬虫只会抓取信息展示类的页面，所以基本只会处理HTTP GET方法的数据。但是对于某些场景，模拟POST等方法也是需要的。

```java
	Request request = new Request("http://example.com/item");
	request.setMethod(HttpConstant.Method.POST);
	NameValuePair[] nameValuePair = new NameValuePair[](){
	new BasicNameValuePair("id","100"),new BasicNameValuePair("tag","2")};
	request.setMethod(HttpConstant.Method.POST);
	spider.addRequest(request);
```

POST方式还有一些Bug，例如[#385 中文乱码](https://github.com/code4craft/webmagic/issues/385)、强制去重等，会在0.6.1版本中陆续修复。