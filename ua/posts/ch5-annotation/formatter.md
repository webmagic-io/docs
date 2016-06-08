### 5.5 Результати перетворення типу

Перетворення типу (механізм `Formatter`) є розширені функціональні можливості у WebMagic 0.3.2. Оскільки зміст завжди повертається у рядку String, але ми хочемо мати у іншому типі динних. Formatter може екстрактовані дані автоматично перетворити в кілька основних типів без необхідності вручну прописувати код для перетворення.

Наприклад:
```java
@ExtractBy("//ul[@class='pagehead-actions']/li[1]//a[@class='social-count js-social-count']/text()")
private int star;
```

#### 5.5.1 Підтримка автоматичної конвертації типів даних

Автоматична конвертація підтримує всі базові типів даних та їх типи класів-обгорток.

| Primitive | packing type |
| ------------ | ---------|
| int | Integer | 
| long | Long |
| double | Double |
| float | Float |
| short | Short |
| char | Character |
| byte | Byte |
| boolean | Boolean |

Крім того, він підтримує перетворення типу у `java.util.Date`. Проте, при перетворенні потрібно вказати формат дати. Формат відповідно до стандарту JDK визначені конкретними нормами, докладніше тут: [http://java.sun.com/docs/books/tutorial/i18n/format/simpleDateFormat.html](http://java.sun.com/docs/books/tutorial/i18n/format/simpleDateFormat.html)

```java
@Formatter("yyyy-MM-dd HH:mm")
@ExtractBy("//div[@class='BlogStat']/regex('\\d+-\\d+-\\d+\\s+\\d+:\\d+')")
private Date date;
```


#### 5.5.2 Явно зазначити конвертацію типів

При нормальних обставинах, Formatter будуть перетворені у відповідності з типом поля, але при особливих обставинах, нам потрібно буде зазначити вказати тип. Це інколи відбувається переважно в полі типу `list` - список.

```java
@Formatter(value = "",subClazz = Integer.class)
@ExtractBy(value = "//div[@class='id']/text()", multi = true)
private List<Integer> ids;
```

#### 5.5.3 Кастомний Formatter (TODO)

Насправді, на додаток до автоматичних перетворенням типу, Formatter також може робити деякі речі, щоб обробити результати. Наприклад, у нас є необхідний сценарій, результати повинні бути екстрактованими, в результаті екстракт подрібнюється на частини мозаїки, з якиїх складається необхідний рядок. Тут ми визначаємо шаблон формату рядку `StringTemplateFormatter`.

```java
public class StringTemplateFormatter implements ObjectFormatter<String> {

    private String template;

    @Override
    public String format(String raw) throws Exception {
        return String.format(template, raw);
    }

    @Override
    public Class<String> clazz() {
        return String.class;
    }

    @Override
    public void initParam(String[] extra) {
        template = extra[0];
    }
}
```

Ну, ми можемо, після екстракції зробити деякі прості операції!

```java
@Formatter(value = "author is %s",formatter = StringTemplateFormatter.class)
@ExtractByUrl("https://github\\.com/(\\w+)/.*")
private String author;
```

Ця фіча у версії 0.4.3 має баг BUG, але буде виправлено у 0.5.0
