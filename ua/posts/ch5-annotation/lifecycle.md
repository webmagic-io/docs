### 5.6 Повний процес

На теперішній час ми знаємо URL і відповідний API для екстракції, і основна підготовка пошукача була завершена.

```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {

    @ExtractBy(value = "//h1[@class='entry-title public']/strong/a/text()", notNull = true)
    private String name;

    @ExtractByUrl("https://github\\.com/(\\w+)/.*")
    private String author;

    @ExtractBy("//div[@id='readme']/tidyText()")
    private String readme;
}
```

#### 5.6.1 Створення і запуск пошукача

Вхідна анотацій модель `OOSpider`, він успадковує клас `Spider`, який впроваджує спеціальний метод створення, та інші схожі методи. Створення анотацію режиму краулер вимагає один або більше класів  `Model`, і один чи декілька `PageModelPipeline` для визначення спосіб результати.

```java
public static OOSpider create(Site site, PageModelPipeline pageModelPipeline, Class... pageModels);
```

#### 5.6.2 `PageModelPipeline`
У режимі анотацій, результати класу під назвою `PageModelPipeline`, шляхом реалізації його, ви можете налаштувати результуючий вихід.

```java
public interface PageModelPipeline<T> {

    public void process(T t, Task task);

}
```

PageModelPipeline відповідна з класом `Model`, та може відповідати безлічі моделі PageModelPipeline. За винятком випадків, коли ви створюєте також

```java
public OOSpider addPageModel(PageModelPipeline pageModelPipeline, Class... pageModels)
```

Метод що додає Model до PageModelPipeline.

#### 5.6.3 Висновок
Що ж, тепер ми маємо завершити цей приклад:


```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {

    @ExtractBy(value = "//h1[@class='entry-title public']/strong/a/text()", notNull = true)
    private String name;

    @ExtractByUrl("https://github\\.com/(\\w+)/.*")
    private String author;

    @ExtractBy("//div[@id='readme']/tidyText()")
    private String readme;

    public static void main(String[] args) {
        OOSpider.create(Site.me().setSleepTime(1000)
                , new ConsolePageModelPipeline(), GithubRepo.class)
                .addUrl("https://github.com/code4craft").thread(5).run();
    }
}
```
