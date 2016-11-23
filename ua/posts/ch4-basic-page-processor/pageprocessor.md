### 4.1 Імплементація PageProcessor

У наведеному прикладі - клас `GithubRepoPageProcessor`, імплементує `PageProcessor`.
 Будемо настроювати PageProcessor за допомогою PageProcessoration, що ділиться на три частини: конфігурація пошукача, екстракція елементів сторінки і виявлення посилань (лінків).

```java
public class GithubRepoPageProcessor implements PageProcessor {

    // Part I: crawl the site configuration, including coding, crawler space, retries, etc.
    /// Частина 1: пошукачу вказують сайт, включаючи кодування, простір для пошуку, повторні спроби і т.д.
    private Site site = Site.me().setRetryTimes(3).setSleepTime(1000);

    @Override
    // Process custom crawler logic core interfaces, where the preparation of extraction logic
    /// Процес призначення пошукачу логіки основних інтерфейсів, де визначаються правила екстракції даних
    public void process(Page page) {
        // Part II: the definition of how to extract information about the page, and preserved
        /// Частина 2: визначення правил екстракції інформацію зі сторінки і в якому полі классу зберігається
        page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
        page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
        if (page.getResultItems().get("name") == null) {
            //skip this page
            /// пропустити цю сторінку
            page.setSkip(true);
        }
        page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));

        // Part III: From the subsequent discovery page url address to crawler
        /// Частина 3: Із результатів попередніх обробок вишукуемо URL адреси інших сторінок для передачи пошукачеві на обробку
        page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/[\w\-]+/[\w\-]+)").all());
    }

    @Override
    public Site getSite() {
        return site;
    }

    public static void main(String[] args) {

        Spider.create(new GithubRepoPageProcessor())
                //From "https://github.com/code4craft" began to grasp
                /// URL адреса "https://github.com/code4craft" з якої починається пошук
                .addUrl("https://github.com/code4craft")
                //Open 5 threads of Crawler
                /// Відкрвати 5 паралельних потоків пошукача
                .thread(5)
                //Start Crawler
                /// Запуск в роботу пошукача
                .run();
    }
}
```

#### 4.1.1 Конфігурація пошукача

Перша частина конфігурації сканеру пошукача, включають в себе: кодування, інтервал сканування, час очікування, число повторних спроб, а також включає в себе деякі параметри браузера: User Agent, cookie і налаштування проксі-сервера. Докладніше у [4.5  Знайомство з інструментами вилучення - екстракцією: Jsoup та Xsoup](../../posts/ch4-basic-page-processor/xsoup.md). Якщо коротенько, то тут у прикладі встановлено: число повторних спроб - до 3 разів, та сканувати з інтервалом в 1 секунду.

#### 4.1.2 Екстракція елементів сторінок

Друга частина - ядро пошукового сканеру: витягти інформацію (екстракція) з HTML-сторінки, що щойно завантажена. WebMagic використовує в основному три технології екстракції: XPath, регулярні вирази (regular expressions) і CSS селектори. Окрім того, для резурсів де інформація у форматі JSON, ви можете використовувати JsonPath.

1. XPath

  Започатковано [XPath](https://uk.wikipedia.org/wiki/XPath), як мова запитів XML елементів, але згодом також поширився та став зручним і для HTML, наприклад:

	```java
	page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()")
	```

  Цей код використовує XPath, та означає: "знайти всі атрибута класу @class 'entry-title public' для тегів (елемент) `<h1>`  і знайти дочірній тег-вузол (ноду node) `<strong>`, у якого наявний тег `<a>` та з нього витягнути текстову інформацію." Відповідний до нього HTML-код наприклад наступний:
  
  ![Xpath-html](http://webmagic.qiniudn.com/oscimages/104607_Aqq8_190591.png)

2. CSS селектор

  [CSS](https://uk.wikipedia.org/wiki/CSS#.D0.A1.D0.B5.D0.BB.D0.B5.D0.BA.D1.82.D0.BE.D1.80.D0.B8_.D1.82.D0.B0_.D0.9F.D1.81.D0.B5.D0.B2.D0.B4.D0.BE-.D0.BA.D0.BB.D0.B0.D1.81.D0.B8) і XPath селектори схожі за синтаксисом мови. Для front-end розробки знайоме формулювання $('h1.entry-title'), що відповідне до попереднього прикладу. Об'єктивно кажучи, його простіше писати, ніж XPath, але якщо ви пишете більш складні правила екстракції, то це відносно невеликі проблеми.

3. Регулярні вирази regular Expressions

  Регулярні вирази [(див. wikipedia)](https://uk.wikipedia.org/wiki/%D0%A0%D0%B5%D0%B3%D1%83%D0%BB%D1%8F%D1%80%D0%BD%D0%B8%D0%B9_%D0%B2%D0%B8%D1%80%D0%B0%D0%B7) є універсальною мовою для екстракції тексту.

	```java
	page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
	```

  Цей код використовує регулярний вираз для екстракції усіх лінків з "https://github.com/code4craft/webmagic".

4. JsonPath

  JsonPath це мова дуже схожа у використанні на XPath, але для швидкого пошуку у JSON контенті. Докладніше про використаний у WebMagic формат JsonPath можна знайти тут: [https://code.google.com/p/json-path/](https://code.google.com/p/json-path/)

#### 4.1.3 Пошук лінків

Після обробки сторінки нашим сканером по всім виразам з логікою, краулер закриється!

Але тепер виникає проблема: сторінок сайту багато, і з самого початку ми можемо не знати та перерахувати всі.
 Але в отсканованих сторінках можна пошукати ще і додаткові линки. Таким чином можна додати їх до списку черги линків для сканування. Цей фунціонал такод є невід'ємною частиною пошукача.

```java
page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
```

Цей код складається з двох частин:
    * регулярний вираз посиланнь на сайт `page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all()` - тобто отримати всі лінки з "(https://github\\.com/\\w+/\\w+)"  - це  за шаблоном https://github.com/ОднаЧиБільшеБукв/ОднаЧиБільшеБукв,
    * `page.addTargetRequests()` - визов метода - усі ці знайдені за шаблоном посилання будуть додані в чергу для подальшого пошукового сканування.
