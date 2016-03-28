### 4.5 інструменти вилучення Введення

WebMagic вилучення Основне застосування [Jsoup](http://jsoup.org/) і мої власні кошти розробки [Xsoup](https://github.com/code4craft/xsoup).

#### 4.5.1 Jsoup

Jsoup є простою HTML-парсер, і він підтримує використання CSS селекторів спосіб знайти елементи. Для розробки WebMagic, джерело I Jsoup проведено детальний аналіз конкретних статей см [Jsoup дослідженні відзначається](https://github.com/code4craft/jsoup-learning).

#### 4.5.2 Xsoup

[Xsoup](https://github.com/code4craft/xsoup) заснований Jsoup я розробив XPath аналізатор.

Перед використанням синтаксичного аналізатора WebMagic [HtmlCleaner](http://htmlcleaner.sourceforge.net/), є деякі проблеми під час використання. Основна проблема полягає в XPath позиція помилка не є точним, і це не розумно структура коду, складно налаштувати. Я, нарешті, зрозумів Xsoup, що робить необхідним розробити більш відповідно до сканерів. Приємно, тестування, продуктивність Xsoup ніж HtmlCleaner швидше, ніж в два рази.

Розвиток Xsoup досі, була підтримана гусеничний загальний синтаксис, такі деякі з них підтримують синтаксис таблиці:

<table>
    <tr>
        <td>Name</td>
        <td>Expression</td>
        <td>Support</td>
    </tr>
    <tr>
        <td>nodename</td>
        <td>nodename</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>immediate parent</td>
        <td>/</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>parent</td>
        <td>//</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>attribute</td>
        <td>[@key=value]</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>nth child</td>
        <td>tag[n]</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>attribute</td>
        <td>/@key</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>wildcard in tagname</td>
        <td>/*</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>wildcard in attribute</td>
        <td>/[@*]</td>
        <td>yes</td>
    </tr>
    <tr>
        <td>function</td>
        <td>function()</td>
        <td>part</td>
    </tr>
    <tr>
        <td>or</td>
        <td>a | b</td>
        <td>yes since 0.2.0</td>
    </tr>
    <tr>
        <td>parent in path</td>
        <td>. or ..</td>
        <td>no</td>
    </tr>
    <tr>
        <td>predicates</td>
        <td>price>35</td>
        <td>no</td>
    </tr>
    <tr>
        <td>predicates logic</td>
        <td>@class=a or @class=b</td>
        <td>yes since 0.2.0</td>
    </tr>
</table>

Крім того, моє власне визначення для декількох пошукових роботів, дуже зручні функції XPath. Зверніть увагу, проте, ці функції не є стандартами XPath.

| вираз | опис | XPath1.0 |
| -------- | ------- | ------- |
| Текст (п) | п-го тексту дочірній вузол безпосередньо і 0 для всіх | текст () тільки |
| AllText () | всі прямі і непрямі текст дитини | не підтримує |
| TidyText () | всі прямі і непрямі дочірніх вузлів тексту, а також замінити деякі з цих наклейок загорнути, тому звичайний текстовий дисплей очищувач | не підтримує |
| HTML () | внутрішній HTML, HTML теги не включає в себе | не підтримує |
| outerHtml () | внутрішній HTML, в тому числі тегів HTML себе | непідтримка
| Регулярний вираз (@ атр, висловлю, група) | @attr тут і може бути вибраний з групи, за замовчуванням group0 | непідтримка

#### 4.5.3 Saxon

Saxon є потужним аналізатор XPath підтримки XPath 2.0 синтаксис. `Webmagic-saxon` інтеграція Saxon є попередніми, але тепер, схоже, передові граматики XPath 2.0, це здається, що користувачі не розвиток багатьох сканерів.
