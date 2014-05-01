### 6.1 定制Pipeline

Pileline是抽取结束后，进行处理的部分，它主要用于抽取结果的保存，也可以定制Pileline可以实现一些通用的功能。在这一节中，我们会用两个例子来讲解如何定制Pipeline。

```java
public interface Pipeline {

    public void process(ResultItems resultItems, Task task);
}
```

#### 6.1.1 将结果保存到文件

使用Pipeline

#### 6.1.2 将结果保存到MySql

#### 6.1.3 对结果做全文替换

#### 6.1.4 WebMagic已经提供的几个Pipeline


