### 5.4 Використання ExtractBy над класом

У попередньому режимі анотацій над полем, маэмо сторінку, що відповідає тільки одному результату. А якщо сторінка має кілька екстракцій, як їх записати? Наприклад, в "QQ food" список сторінок [http://meishi.qq.com/beijing/c/all](http://meishi.qq.com/beijing/c/all), я хочу, щоб витягти всі підприємства й отримати їх імена та інформацію, тоді як це зробити?

Використовуючи анотацію `@ExtractBy` над класом ви може вирішити цю проблему.

Пояснення в цьому разі для анотацію на класі має дуже простий сенс: результат екстракції використовувати повторно для вилучення, так що ця область відповідає результату.

```java
@ExtractBy(value = "//ul[@id=\"promos_list2\"]/li",multi = true)
public class QQMeishi {
	……
}
```
Коли використовуєте `@ExtractBy` на полі в класі, тоді із цих областей екстарактуються сторінки. Якщо в даний момент потрібно витягнути лише внутрощі (сирцевий код) сторінки без її екстракції, то можна встановити `source = RawHtml`.

```java
@TargetUrl("http://meishi.qq.com/beijing/c/all[\\-p2]*")
@ExtractBy(value = "//ul[@id=\"promos_list2\"]/li",multi = true)
public class QQMeishi {

    @ExtractBy("//div[@class=info]/a[@class=title]/h4/text()")
    private String shopName;

    @ExtractBy("//div[@class=info]/a[@class=title]/text()")
    private String promo;

    public static void main(String[] args) {
        OOSpider.create(Site.me(), new ConsolePageModelPipeline(), QQMeishi.class).addUrl("http://meishi.qq.com/beijing/c/all").thread(4).run();
    }

}
```
