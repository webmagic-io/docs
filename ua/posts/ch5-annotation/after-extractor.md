### 5.7 AfterExtractor

Іноді режим анотацій не може задовольнити всі потреби, можливо тоді, буде потрібно написати код, щоб зробити деякі речі, у цьому випадку ми повинні використовувати інтерфейс `AfterExtractor`.


```java
public interface AfterExtractor {

    public void afterProcess(Page page);
}
```

`afterProcess` в кінці метода екстракції, вже після ініціалізації та виклику полів, ви можете прописати деякий код зі своєю спеціальною логікою. По типу, що є у наступному прикладі [Постійне використння Jfinal ActiveRecord у пошукачі webmagic - blog](http://www.oschina.net/code/snippet_190591_23456):

```java
// TargetUrl mean only the following URL format will be extracted to generate the object model
/// TargetUrl означає - тільки наступного формату URL будуть використані для екстракції та запису у об'ектну модель
// Here is to do a little positive change, '' The default is no need to escape, and the '*' will be automatically replaced with '*', as described URL looked a little uncomfortable ...
/// Ось зроблена невелике позитивне зміна, ''- Значення за замовчуванням не потрібно збрасувати, і '*' буде автоматично замінений на '*', як описано в URL і виглядє трохи незручно ...
// Inherited jfinal the Model
/// Наслідується моделі jfinal 
// Implement AfterExtractor interfaces can perform other operations after filling properties
/// В реалізації інтерфейса AfterExtractor можуть виконуватися інші операції після заповнення властивостей
@TargetUrl("http://my.oschina.net/flashsword/blog/*")
public class OschinaBlog extends Model<OschinaBlog> implements AfterExtractor {

    // Will be automatically extracted with ExtractBy annotation fields and filling
    /// Буде автоматично екстрагувати з анотацією ExtractBy полів і заповнення
    // Default xpath grammar
    /// Синтаксис за замовчуванням Xpath
    @ExtractBy("//title")
    private String title;

    // Extract can be defined syntax Css, Regex, etc.
    /// Екстракт може бути визначений за синтаксисами CSS, Regexp і т.д.
    @ExtractBy(value = "div.BlogContent", type = ExtractBy.Type.Css)
    private String content;

    //Multi labeling drawing result can be a List
    ///Результат, що є множиною екстрактованих значень можуть бути збережені списком List
    @ExtractBy(value = "//div[@class='BlogTags']/a/text()", multi = true)
    private List<String> tags;

    @Override
    public void afterProcess(Page page) {
        //Jfinal property is actually a Map instead of the field, it does not matter, I want to go in filling
        /// Jfinal властивість фактично є мапою Map замість поля, та це не має значення, я хочу їх заповнити
        this.set("title", title);
        this.set("content", content);
        this.set("tags", StringUtils.join(tags, ","));
        //save		/// запис
        save();
    }

    public static void main(String[] args) {
        C3p0Plugin c3p0Plugin = new C3p0Plugin("jdbc:mysql://127.0.0.1/blog?characterEncoding=utf-8", "blog", "password");
        c3p0Plugin.start();
        ActiveRecordPlugin activeRecordPlugin = new ActiveRecordPlugin(c3p0Plugin);
        activeRecordPlugin.addMapping("blog", OschinaBlog.class);
        activeRecordPlugin.start();
        //Start webmagic		// Запуск Webmagic
        OOSpider.create(Site.me().addStartUrl("http://my.oschina.net/flashsword/blog/145796"), OschinaBlog.class).run();
    }
}
```

#### Висновок

Режим анотацій в даний час розглядається як кінець презентації WebMagic, модель анотацій фактично повністю заснована на `webmagic-core` у `PageProcessor` і інфопроводі `Pipeline` та реалізація розширення, хто зацікавлений - може повернутися та подивитися на код.

Частково це досягається, але це все ще більш складним, є проблема, якщо ви знайдете деякі деталі коду, прошу [відгук до мене](https://github.com/code4craft/webmagic/issues).
