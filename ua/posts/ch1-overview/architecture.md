### 1.2 Загальна архітектура

Чотири компонента пошукача WebMagic структуровані в `Downloader`,` PageProcessor`, `Scheduler`,` Pipeline` контактують поміж собою. Ці компоненти відповідають чотирьом здатність життєвого циклу пошукача: завантаження, обробки, управління і здатність зберігання. Архітектура WebMagic подібна до `Scapy`, але реалізована на `Java`.

Пошукач має кілька компонентів, але організованих таким чином, щоб вони могли взаємодіяти один з одним, процес реалізації можна розглядатити пошукач, як великий контейнер з логіка у ядрі ​​WebMagic.

Загальна архітектура WebMagic виглядає наступним чином:

![image](http://code4craft.github.io/images/posts/webmagic.png)

### 1.2.1 чотири компонента WebMagic

#### 1.Downloader завантажувач

Downloader відповідає за завантаження з Інтернет-сторінки, для подальшої обробки. У WebMagic за замовчуванням інструмент завантаження - [Apache HttpClient](http://hc.apache.org/index.html).

#### 2.PageProcessor аналіз сторінки

PageProcessor відповідає за аналіз сторінки, витягувати корисну інформацію, а також відкриття нових посилань. WebMagic використовувати [Jsoup](http://jsoup.org/) в якості синтаксичного аналізу інструментів HTML, на основі його розробки аналітичного інструменту XPath [Xsoup](https://github.com/code4craft/xsoup).

З цих чотирьох компонентів, тільки `PageProcessor` не той самий для кожної сторінки для кожного сайту, цю частину користувач повинен налаштувати.

#### 3.Scheduler планувальник

Менеджер планувальника Scheduler буде давати завдання сканувати URL по черзі. WebMagic за замовчуванням від JDK використовує менеджер черги URL-ів у пам'яті `memory queue management`, та може встановлювати пріоритети. Також підтримує використання розподіленого управління через Redis.

Якщо проект має деякі особливі потреби, що не бóли реалізовіні, тоді зможете налаштувати свій власний планувальник Scheduler.

#### 4.Pipeline конвеєрне збереження даних

Конвеєрна обробка даних Pipeline відповідає за прийняття результатів, включаючи перерахунки, зберігання в файли, у бази даних і так далі. WebMagic надається за замовчуванням "на консоль" і другий спосіб у програмі "Зберегти в файл" результат.

`Pipeline` визначає спосіб збереження результатів, якщо ви хочете зберегти у визначеній базі даних, тоді потрібно написати відповідну обробку даних. Як правило потрібно тільки написати `Pipeline`.

### 1.2.2 для об'єктів передачі даних

#### 1. Запит `Request`

`Request` - це пакетний рівень з URL-адресою, `Request` запит відповідний до URL-адреси.

Він є носієм для взаэмодії `PageProcessor` та `Downloader`. Для `Downloader` це єдиний спосіб впливати на `PageProcessor`.

На додаток до самого URL, він містить поля зі структурою ключ-значення `extra`. Ви можете зберегти деякі додаткові спеціальні `extra` атрибути, а потім прочитати в інших місцях для виконання різних функцій. Наприклад, деяка додаткова інформація на одній сторінці, що використана при роботі в іншій, і так далі.

#### 2. Сторінка Page

`Page` представленя сторінки `Downloader` для її завантаження - зміст може бути HTML, чи він може бути JSON або в інших текстових форматах.

Процес екстракції сторінки `Page` прописаний у ядрі WebMagic, який забезпечує способи видобутку та зберегання результатів, і так далі. Наразі у [розділі 4](../../posts/ch4-basic-page-processor/selectable.md) ми будемо детально її використовувати.

#### 3. Результуюча одиниця ResultItems

`ResultItems` еквівалентно до колекції - мапи `Map` у `Java`, яка проводить обробку результатів `PageProcessor` для подальшого використання у конвеерному збереженню результатів `Pipeline`.  API у нього та у мапи `Map` дуже схожі, окрім поля `skip` яке при встановлені `true` означає, що не повинен бути оброблений `Pipeline` конвеєром збереження результатів.

### 1.2.3 Керування запуском движка пошукача --Spider
Spider is the core WebMagic internal processes. A property Downloader, PageProcessor, Scheduler, Pipeline is the Spider, these properties can be freely set by setting this property can perform different functions. Spider WebMagic also operate the entrance, which encapsulates the creation of crawlers, start, stop, multi-threading capabilities. Here is a set of each component, and set an example of multi-threading and startup. See detailed Spider setting Chapter 4 - [crawler configuration, start and stop](../ch4-basic-page-processor/spider-config.html).

Павук Spider є внутрішнім процесом ядра WebMagic. Павук `Spider` має властивісті `Downloader`, `PageProcessor`, `Pipeline`, що можуть бути встановлені setter -ами у різні функції. Павук `Spider` WebMagic - це товка вхіду, яка інкапсулює створення пошукових роботів, запуск, зупинку, можливості роботи у багатопоточному режимы. Ось набір кожного компонента, і наведений приклад запуску у багатопоточності. Детальніше про налаштування павука у частині 4 - [Конфігурація пошукача, запуск і зупинка](../ch4-basic-page-processor/spider-config.html).

```java
public static void main(String[] args) {
    Spider.create(new GithubRepoPageProcessor())
            // From https://github.com/code4craft began to grasp    
            .addUrl("https://github.com/code4craft")
            // Set the Scheduler, use Redis to manage URL queue
            .setScheduler(new RedisScheduler("localhost"))
            // Set Pipeline, will result in json way to save a file
            .addPipeline(new JsonFilePipeline("D:\\data\\webmagic"))
            //Open 5 simultaneous execution threads
            .thread(5)
            //Start crawler
            .run();
}
```

### 1.2.4 Швидкий старт

Склалося враження, що приведена велика кількість компонентів, але насправді не турбуйтесь - бо старту їх потрібно не так багато конфігурувати, тому що велика частина модулів WebMagic вже забезпечує реалізацію за замовчуванням.

Загалом, для отримання пошукача необхідності написати класс з імплементацію `PageProcessor`, де `create`-том створюється `Spider` із початковими даними для сканеру. У розділі 4 ми розповімо як писати налаштовання шукача `PageProcessor` і `Spider` щоб розпочати - [Імплементація `PageProcessor` -а](../ch4-basic-page-processor/pageprocessor.md).