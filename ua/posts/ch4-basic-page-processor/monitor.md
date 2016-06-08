### 4.6 Монітор з `JMX`

Монітор шукача нова функція починаючи з версії 0.5.0. За допомогою цієї функції ви можете перевірити запущених пошукових роботів - скільки сторінок було завантажено, яка кількість сторінок, скільки запущених потоків thread і іншу інформацію. Побачити функціональність імплементованої `JMX`(Java Management Extensions ), ви можете використовувати інструмент `JConsole` чи т.п. `JMX` працює, як з локальною так і віддаленої інформацією про пошукач.

Якщо ви раніше не користувалися `JMX`, то це не має значення, оскільки його використання є відносно простим, про це докладніше пояснюється в цій главі. Якщо ви хочете дізнатися про принцип, чи отримати ще більше інформації про `JMX` рекомендуємо прочитати: [JMX (en)](https://www.wikiwand.com/en/Java_Management_Extensions) чи [JMX (chinese)](http://my.oschina.net/xpbug/blog/221547). У цій частині наведено багато інформації з посилання на джерело.

Примітка: Якщо ви визначаєте планувальник `Scheduler`, вам потрібно імплементувати інтерфейс `MonitorableScheduler`, та перегляньте ці два метода `LeftPageCount` та `TotalPageCount`.

#### 4.6.1 Додати у проект моніторинг

Додати моніторинг дуже просто - отримати синглетон `SpiderMonitor.instance()` від `SpiderMonitor`, якщо ви бажаете моніторити `Spider`, потрібно ще його зареєструвати. Також Ви можете зареєструвати декілька пошукових сканерів `Spider` для моніторингу у `SpiderMonitor`.

```java
public class MonitorExample {

    public static void main(String[] args) throws Exception {

        Spider oschinaSpider = Spider.create(new OschinaBlogPageProcessor())
                .addUrl("http://my.oschina.net/flashsword/blog");
        Spider githubSpider = Spider.create(new GithubRepoPageProcessor())
                .addUrl("https://github.com/code4craft");

        SpiderMonitor.instance().register(oschinaSpider);
        SpiderMonitor.instance().register(githubSpider);
        oschinaSpider.start();
        githubSpider.start();
    }
}
```

#### 4.6.2 Знайомство інформаційним моніторингом

Моніторинг WebMagic проходить за допомогою `JMX provides control` (забезпечує управління), ви можете використовувати будь-який клієнт JMX-enabled, що підтримує підключення. Будемо використовувати `JDK` для наведеного прикладу `JConsole`. Спочатку стартуємо `Spider` WebMagic і додати код монітора. Потім переходимо в `JConsole`, щоб переглянути його.

Запускаємо програму відповідно до прикладу 4.6.1, а потім введіть команду `JConsole` (під Windows, у вікні терміналу в DOS (інтерфейс командного рядка (CLI)) вводиться  `jconsole.exe`), щоб запустити `JConsole`.

![Jconsole](http://webmagic.qiniudn.com/oscimages/231513_lP2O_190591.png)

У відкритому вікні обираємо - стартувати локальний процес WebMagic, вибрати `MBean`. Після підключення відкривається "WebMagic" де побачимо всю інформацію, що доступна для моніторингу пошукача `Spider`!

Звідси можна керувати “дією” пошукових сканерів - для запуску `-start()`, а для зупинки `-stop()`.

![Jconsole-шоу](http://webmagic.qiniudn.com/oscimages/231652_B3Mt_190591.png)

#### 4.6.3 Розширений інтерфейс моніторингу

На додаток до існуючих опцій інформаційного моніторингу, при потребі отримувати більше інформації, що необхідно контролювати, є рішення - це розширення. Ви можете успадковувати `SpiderStatusMXBean` щоби задіяти розширення, конкретні приклади можна побачити тут:
[Кастомне розширення - demo](https://github.com/code4craft/webmagic/tree/master/webmagic-extension/src/test/java/us/codecraft/webmagic/monitor).
