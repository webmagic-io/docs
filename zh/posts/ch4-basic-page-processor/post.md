### 4.8 处理非HTTP GET请求

一般来说，爬虫只会抓取信息展示类的页面，所以基本只会处理HTTP GET方法的数据。但是对于某些场景，模拟POST等方法也是需要的。

0.7.0版本之后，废弃了老的nameValuePair的写法，采用在Request对象上添加Method和`requestBody`来实现。

```java
Request request = new Request("http://xxx/path");
request.setMethod(HttpConstant.Method.POST);
request.setRequestBody(HttpRequestBody.json("{'id':1}","utf-8"));
```

HttpRequestBody内置了几种初始化方式，支持最常见的表单提交、json提交等方式。

| API	| 说明 |
| -------- | ------- | 
| HttpRequestBody.form(Map\<String,Object> params, String encoding)| 使用表单提交的方式|
| HttpRequestBody.json(String json, String encoding)| 使用JSON的方式，json是序列化后的结果|
| HttpRequestBody.xml(String xml, String encoding)| 设置xml的方式，xml是序列化后的结果|
| HttpRequestBody.custom(byte[] body, String contentType, String encoding)| 设置自定义的requestBody |

#### POST的去重：

从0.7.0版本开始，POST默认不会去重，详情见：[Issue 484](https://github.com/code4craft/webmagic/issues/484)。如果想要去重可以自己继承`DuplicateRemovedScheduler`，重写`push`方法。
