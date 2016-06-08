## 6. Налаштування компонентів
У першому розділі ми посилаємося на компоненти WebMagic. У WebMagic великою перевагою є те, що ви можете налаштувати гнучкі функції компонентів для досягнення мети під свої потреби.

У класі Павука Spider є поля - `PageProcessor`,` Downloader`, `Scheduler` і` Pipeline`. Обовʼязковий `PageProcessor` повинен бути призначеним при створені  павука, інші три компонента можуть бути змінені за допомогою метода сетер setter.

|Метод|Опис|Приклад|
|-----|------|------|
|setScheduler()|Зміна Scheduler|spipder.setScheduler(new FileCacheQueueScheduler("D:\\data\\webmagic"))|
|setDownloader()|ЗмінаDownloader|spipder.setDownloader(new SeleniumDownloader()))|
|addDownloader()|Зміна Pipeline，один Spider може мати кілька pipeline|spipder.addPipeline(new FilePipeline())|
