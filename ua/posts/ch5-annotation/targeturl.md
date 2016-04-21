### 5.2 TargetUrl та HelpUrl

На другому етапі розглянемо як відкрити URL. Але на початку необхідно означити два поняття: `@TargetUrl` та `@HelpUrl`.

### 5.2.1 TargetUrl та HelpUrl

`HelpUrl/TargetUrl` crawl is a very effective development model, TargetUrl we eventually crawled URL, eventually want the data from here; and HelpUrl is to find the final URL, we need to access the page. Almost all vertical reptile needs, can be attributed to these two types of URL processing:

`HelpUrl/TargetUrl` є дуже ефективним для розробки моделлі краулера. TargetUrl вказує на URL з цільовими данними для кінцівої екстракції; HelpUrl - це проміжний, не фінальний URL, але завдяки якому шукаемо та надаємо доступ до кінцевих необхідних сторінок, що містять цільові данні для екстракції. Майже всю ієрархію, що потребна для роботи пошукача можно описати цими двома типами обробки URL:

* Для блогу - HelpUrl це перелік сторінок пейджинатора, TargetUrl сторінка безпосередньо статті чи запису.
* Для форуму - HelpUrl це перелік гілок та постів у них, TargetUrl сторінка безпосередньо посту.
* Для ecommerce сайтів интернет магазинів - HelpUrl це список категорій та пейджинатори, TargetUrl картка товару чи безпосередньо сторінка детального опису товару.

У цьому прикладі для TargetUrl - сторінка одного з проектів, що знайдений та входить до сторінки пошуку HelpUrl, що відображає посилання на всі проекти.

Враховуючи, що ми знаємо формат URL приведемо приклад:

```java
@TargetUrl("https://github.com/\\w+/\\w+")
@HelpUrl("https://github.com/\\w+")
public class GithubRepo {
	……
}
```

##### 5.2.2 Використання регулярних виразів у TargetUrl
Тут ми використовуємо регулярні вирази, щоб вказати область URL. Любий читач можливо знає, що у регулярних виразах не маскувати символ `.` - це неправильно? Й насправді, тут для зручності, WebMagic використовує власний формат регулярних виразів для URL-адрес, в основному двома відмінностями:

* Символи у URL-адреси зазвичай використовується за замовчуванням `.` - що рівнозначні замаскованій escape-послідовністі `\.`
* Позначка "\*" замінена просто зірочкою "*" та може бути використаний безпосередньо.

Наприклад `https://github.com/*` валідний регулярний вираз для усіх URL на `https://github.com/`.

У WebMagic сторінка, що отримана з URL `TargetUrl`, за умови, що вони відповідають формату TargetUrl, також буде завантажена. Отже, якщо ви не вкажете `HelpUrl`, а це також можливо - наприклад у якому-небудь посиланні "Next" на сторінці блогу, то в цьому випадку необхідно вказати `HelpUrl`. (TODO???)

##### 5.2.3 sourceRegion - область джерела

TargetUrl also supports the definition of `sourceRegion`, this parameter is an XPath expression that specifies the URL from where to get - not sourceRegion the URL will not be extracted.
TargetUrl також підтримує визначення області, що буде джерелом `sourceRegion`, цей параметр є вираженням XPath, яке вказує URL, звідки вийшло - усі інші URL-адреси не з sourceRegion не будуть витягуватися.
