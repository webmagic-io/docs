### 6.1 Налаштування інфопроводу Pipeline
Коли екстракцію закінчено, ми задіємо `Pipeline` щоб зберігти результат екстракції. Також можна налаштувати трубоінфопровід, щоб зробити деякі загальні функції. У цьому розділі ми представимо `Pipeline`, і використаємо два приклади для пояснення, як налаштувати інфопровід pipeline.
#### 6.1.1 Введення трубопроводу
Інтерфейс `Pipeline` описується так:

```java
public interface Pipeline {

    // ResultItems persiste the result of extract，it is a structure of map
    // The data in the page.putField(key,value) can use the ResultItems.get(key) to get
    /// РезультуючіЕлементи ResultItems сберігають результат екстракції, ця структура map
    /// Дані в page.outField(key,value) (ключ, значення) можна отримати використавши ResultItems.get(key)
    public void process(ResultItems resultItems, Task task);
}
```

Видно, що `Pipeline` зберігає дані, які були екстрактовані за допомогою `PageProcessor`. Це робота, яку можна зробити в `PageProcessor`. Але чому ми використовуємо `Pipeline`? Існує кілька причин для цього:
1. Для того, щоб відокремити модулі. Екстрактція сторінки і процес зберігання даних - етапи роботи павука. З одного боку, окремі модулі можуть зробити структуру коду більш ясним. З іншого боку, ми можемо відокремити процеси, пустити процес в іншому потоці або навіть на іншому сервері.
2. Функція `Pipeline` стабільніша, її дуже легко зробити в якості загального компонента. Існує велика різниця між процесами на різних сторінках. Але зберігаються дані майже також, наприклад, зберегати в файл або зберігати в базу даних. Це дуже узагальнено для майже більшості сторінок. Існує багато спільного `Pipeline` в WebMagic, такі як записи в консолі, зберегти в файлі, зберегти в файлі у форматі JSON.

У WebMagic `Spider` може мати кілька `Pipeline`, досить виконати метод `Spider.addPipeline()`, щоб додати `Pipeline`. Ці всі `Pipeline` будуть як процес. Наприклад, ви можете використовувати:

```java
spider.addPipeline(new ConsolePipeline()).addPipeline(new FilePipeline())
```
Ви можете записати дані на консолі і зберегти у файлі.

#### 6.1.2 Виведення результат в консоль

Щоб ознайомитися з `PageProcessor`, ми використовуємо [GithubRepoPageProcessor](https://github.com/code4craft/webmagic/blob/master/webmagic-core/src/main/java/us/codecraft/webmagic/processor/example/GithubRepoPageProcessor.java) як приклад. Маємо частина коду:

```java
public void process(Page page) {
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+)").all());
    //save the author, the data will be save in ResultItems finally
    page.putField("author", page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
    page.putField("name", page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
    if (page.getResultItems().get("name")==null){
        //when we set the skip,this page will not be processed by the`Pipeline`
        page.setSkip(true);
    }
    page.putField("readme", page.getHtml().xpath("//div[@id='readme']/tidyText()"));
}
```
Тепер ми хочемо записати результат в консолі. [ConsolePipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-core/src/main/java/us/codecraft/webmagic/pipeline/ConsolePipeline.java) може це зробити.

```java
public class ConsolePipeline implements Pipeline {

    @Override
    public void process(ResultItems resultItems, Task task) {
        System.out.println("get page: " + resultItems.getRequest().getUrl());
        //Iterator all the result,and put it on the console,the "author","name","readme"are all the key,the result is value
        for (Map.Entry<String, Object> entry : resultItems.getAll().entrySet()) {
            System.out.println(entry.getKey() + ":\t" + entry.getValue());
        }
    }
}
```

Основуючись на цей приклад, ви можете налаштувати свій власний `Pipeline`. Отримати дані з `ResultItems` і процес, як ваш власний метод.


#### 6.1.3 Зберігаємо результат в MySQL
По-перше, ми вводимо приклад [jobhunter](https://github.com/webmagic-io/jobhunter). Це WebMagic інтегрує Spring Framework  в роботу пошукача інформацію про завдання. У цьому прикладі також показано, як використовувати Mybatis для збереження даних в базі даних MySQL.

У Java, у нас є багато методів, щоб зберегти дані в базі даних, таких як JDBC, dbutils, spring-JDBC, MyBatis. Ці інструменти можуть робити те ж саме, але їх складність не однакова. Якщо ми використовуємо JBDC, ми повинні отримати дані в ResulrItem та зберегти їх.

Якщо ми використовуємо framework структуру ORM для збереження даних, ми зіткнемося з великою проблемою. Це framework основа всього потрібно чітко визначену модель, але не ключ-значення формату ResultItem. Ми використовуємо Mybatis як приклад для визначення DAO [MyBatis-Spring](http://mybatis.github.io/spring/zh/).

```java
public interface JobInfoDAO {

    @Insert("insert into JobInfo (`title`,`salary`,`company`,`description`,`requirement`,`source`,`url`,`urlMd5`) values (#{title},#{salary},#{company},#{description},#{requirement},#{source},#{url},#{urlMd5})")
    public int add(LieTouJobInfo jobInfo);
}
```
Все, що нам потрібно зробити, це імплементувати Pipeline, щоб об'єднати`ResultItem` та `LieTouJobInfo`.

#### Режим анотацій

У режимі анотацій, існує [PageModelPipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/pipeline/PageModelPipeline.java) в WebMagic:

```java
public interface PageModelPipeline<T> {

    //give the well processed object
    public void process(T t, Task task);

}
```

В цей час, ми можемо визначити [JobInfoDaoPipeline](https://github.com/webmagic-io/jobhunter/blob/master/src/main/java/us/codecraft/jobhunter/pipeline/JobInfoDaoPipeline.java) щоб досягти функції:

```java
@Component("JobInfoDaoPipeline")
public class JobInfoDaoPipeline implements PageModelPipeline<LieTouJobInfo> {

    @Resource
    private JobInfoDAO jobInfoDAO;

    @Override
    public void process(LieTouJobInfo lieTouJobInfo, Task task) {
        //call the MyBatis DAO to save the result
        jobInfoDAO.add(lieTouJobInfo);
    }
}
```

#### Основний режим інфопроводу Pipeline

Ми закінчили роботу збереження даних! Але як використовувати оригінальний інтерфейс `Pipeline`? Це дуже легко! Якщо ви хочете зберегти об'єкт, то ви повинні зберегти дані в якості об'єкта при екстракції його з сторінки.

```java
public void process(Page page) {
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+/\\w+)").all());
    page.addTargetRequests(page.getHtml().links().regex("(https://github\\.com/\\w+)").all());
    GithubRepo githubRepo = new GithubRepo();
    githubRepo.setAuthor(page.getUrl().regex("https://github\\.com/(\\w+)/.*").toString());
    githubRepo.setName(page.getHtml().xpath("//h1[@class='entry-title public']/strong/a/text()").toString());
    githubRepo.setReadme(page.getHtml().xpath("//div[@id='readme']/tidyText()").toString());
    if (githubRepo.getName() == null) {
        //skip this page
        page.setSkip(true);
    } else {
        page.putField("repo", githubRepo);
    }
}
```

В `Pipeline` будемо використовувати

```java
GithubRepo githubRepo = (GithubRepo)resultItems.get("repo");
```

тоді отримаємо цей об'єкт

> PageModelPipeline is also implements from the original `Pipeline` interface. It combine the `PageProcessor`. it use the class name as the key and the value is the object.In detail: [ModelPipeline](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/model/ModelPipeline.java).

#### 6.1.4 WebMagic зоготовки для Pipeline

WebMagic може записати результат на консоль, зберегти дані в файл або зберегти у форматі JSON.

| Class | Опис | Remark |
| -------- | ------- | ------- |
|ConsolePipeline|write to the console|the result must implements the toString() method
|FilePipeline|save the result in the file|the result must implements the toString() method
|JsonFilePipeline|save the data in the file as JSON format||
|ConsolePageModelPipeline|(Annotation mode)write to the console||
|FilePageModelPipeline|(Annotation mode)save the result in the file||
|JsonFilePageModelPipeline|(Annotation mode)save the data in the file as JSON format|the field which want to be saved must have the getter method
