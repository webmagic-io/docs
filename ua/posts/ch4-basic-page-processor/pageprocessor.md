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
    /// Процес призначення пошукачу логіки основних інтерфейсів, де підготавлюється логіки екстракції даних 
    public void process(Page page) {
        // Part II: the definition of how to extract information about the page, and preserved
        /// Частина 2: визначення яким чином проводити екстракцію інформацію зі сторінки і як зберігається
        page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
        page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
        if (page.getResultItems().get("name") == null) {
            //skip this page
            /// пропустити цю сторінку
            page.setSkip(true);
        }
        page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));

        // Part III: From the subsequent discovery page url address to crawler
        /// Частина 3: Із результатів попередніх обробок вишукуемо URL адреси сторінок для передачи пошукачеві на обробку
        page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
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

Перша частина конфігурації сканеру пошукача, включають в себе: кодування, інтервал сканування, час очікування, число повторних спроб, а також включає в себе деякі параметри браузера: User Agent, cookie і налаштування проксі-сервера. Докладніше у (Глава 5 - Введеня до іструментарію екстракції). Якщо коротенько, то тут у прикладі встановлено: число повторних спроб -  до 3 разів, сканувати з інтервалом в 1 секунду.

#### 4.1.2 Екстракція елементів сторінок

Друга частина - ядро пошукового сканеру: витягти інформацію (екстракція) з HTML-сторінки, що щойно завантажена. WebMagic використовує в основному три технології екстракції: XPath, регулярні вирази (regular expressions) і CSS селектори. Крім того, для інформації у форматі JSON, ви можете використовувати JsonPath.

1. XPath

  Започатковано XPath, як мова запитів XML елементів, але згодом також поширився та став зручним і для HTML, наприклад:

	```java
	page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()")
	```

  Цей код використовує XPath, та означає: "знайти всі атрибута класу @class 'entry-title public' для тегів (елемент) `<h1>`  і знайти дочірній тег-вузол (ноду node) `<strong>`, у якого наявний тег `<a>` та з нього витягнути текстову інформацію." Відповідний до нього HTML-код наприклад наступний:
  
  ![Xpath-html](http://webmagic.qiniudn.com/oscimages/104607_Aqq8_190591.png)

2. CSS селектор

  CSS і XPath селектори схожі за синтаксисом мови. Для front-end розробки знайоме формулювання $('h1.entry-title'), що відповідне до попереднього прикладу. Об'єктивно кажучи, його простіше писати, ніж XPath, але якщо ви пишете більш складні правила екстракції, то це відносно невеликі проблеми.

3. Регулярні вирази regular Expressions

  Регулярні вирази є універсальною мовою для екстракції тексту.

	```java
	page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
	```

  Цей код використовує регулярний вираз для екстракції усіх лінків з "https://github.com/code4craft/webmagic".

4. JsonPath

  JsonPath це мова дуже схожа у використанні на XPath, але для швидкого пошуку у JSON контенті. Докладніше про  використаний у WebMagic формат JsonPath можна знайти тут: [https://code.google.com/p/json-path/](https://code.google.com/p/json-path/)

#### 4.1.3 Пошук лінків

Після обробки сторінки нашим сканером по всім виразам з логікою, краулер закриється!

Але тепер виникає проблема: сторінок сайту багато, і з самого початку ми не можемо знати і перерахувати всі.Але згодом пройтися по линками із отсканованих сторінок щоб додати їх до списку линків для сканування, цей фунціонал є невід'ємною частиною пошукача.

```java
page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
```

Цей код складається з двох частин, `page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all()` отримати всі лінки з "(https://github\\.com/\\w+/\\w+)"  - це регулярний вираз посилання, `page.addTargetRequests()` - ці посилання будуть додані в чергу для пошукового сканування.
