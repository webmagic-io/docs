### 4.4 Конфігурація пошукача, запуск і зупинка

#### 4.4.1 Пошукач Spider

`Spider` початковий вхід пошукача. Перед початком скануванням пошукачем, нам потрібно використовуючи `PageProcessor` створити об'єкт павука Spider, а тоді запустити його за допомогою `run()`. У той час як інші компоненти веб-павука Spider (завантажувач Downloader, планувальник Scheduler, конвейер Pipeline) може бути встановлений опционально.

| метод | опис | приклади |
| -------- | ------- | ------- |
| create(PageProcessor)| створити Spider | іpider.create(new GithubRepoProcessor())|
|addUrl(String…) | додати URL ініціалізації |spider.addUrl("http://webmagic.io/docs/") |
|addRequest(Request...) | додати Request ініціалізації |spider .addRequest("http://webmagic.io/docs/") |
| thread(n)| к-ть потоків n threads | spider.thread(5)| 
|run()|запуск, розблокування поточного потоку thread його визовом| spider.run() |
|start()/runAsync()|асинхнонний старт, продовження з поточного потоку thread | spider.start() |  
|stop()|стоп пошукача | spider.stop() |  
|test(String)| тестова сторінка для пошукача | spider.test("http://webmagic.io/docs/") |
| addPipeline(Pipeline) | додати конвейер Pipeline, Spider може бути чисельним Pipeline | spider.addPipeline(new ConsolePipeline())|
| setScheduler(Scheduler) | установки Планувальника Scheduler, Spider повинен мати Scheduler |  spider.setScheduler(new RedisScheduler()) |
| setDownloader(Downloader) | установки Завантажувача Downloader, Spider повинен бути при Downloader |  spider.setDownloader(new SeleniumDownloader()) |
| get(String) | синхронні визови та прямий доступ до результатів | ResultItems result = spider.get("http://webmagic.io/docs/")
| getAll(String…) | синхронні визови та прямий доступ до купи результатів | List&lt;ResultItems&gt; results = spider.getAll("http://webmagic.io/docs/", "http://webmagic.io/xxx")

#### 4.4.2 Site

Сам сайт, деяка інформація про конфігурацію, така як кодування, HTTP заголовок, тайм-аут, стратегія повторних спроб, агентів і т.д., можуть бути налаштовані шляхом установок set об'єкта `Site`.


| метод | опис | приклади |
| -------- | ------- | ------- |
|setCharset(String)|установка кодування encoding|site.setCharset("utf-8")|
| setUserAgent(String)| установка UserAgent | site.setUserAgent("Spider") |
| setTimeOut(int)| установка тайм-аут в мілісекундах | site.setTimeOut(3000)|
| setRetryTimes(int)| установка к-ті повторних спроб | site.setRetryTimes(3) |
| setCycleRetryTimes(int)| установка циклу повторних спроб | site.setCycleRetryTimes(3) |
|addCookie(String,String)| додати cookie | site.addCookie("dotcomt_user","code4craft") |
|setDomain(String)| установити доменне ім'я, можливо встановити пізніше, вступають в силу тільки only addCookie | site.setDomain("github.com")
|addHeader(String,String)| додати addHeader | site.addHeader("Referer","https://github.com") |
|setHttpProxy(HttpHost) | налаштування Http proxy | site.setHttpProxy(new HttpHost("127.0.0.1",8080)) |

Цикл повторних спроб - механізм CycleRetryTimes додано починаючи з версії 0.3.0

Цей механізм не буде повертати назад в кінець черги (повторних спроб) URL-и, що не зміг завантажити, вкотре пройшовши цикл setCycleRetryTimes разів. Має сенс для сторінок в мережі, що можуть бути тимчасово чи взагалі недоступні.
