###  Основні комбінації сторінки та список деталей

Почнемо з простого прикладу. Наприклад у нас є список сторінок. Вони вміщують лінки, що мають різні формати. Яким чином ми можемо відібрати з них посилання, щоб знайти всі цільові сторінки?

#### 1 Початокові лінки прикладу

Ось, наприклад, блог автора Сіна [http://blog.sina.com.cn/flashsword20](http://blog.sina.com.cn/flashsword20). У ньому ми хочемо, щоб останню сторінку статті блога, екстрактувати назву блогу title, контент, дату і іншу інформацію. Але ще сканувати посилання блогу та іншу інформацію зі списком сторінок, щоб отримати всі останні статті цього блогу.

* Сторінка Page

	Формат сторінки "http://blog.sina.com.cn/s/articlelist_1487828712_0_1.html", де у "0_1" - це номеру сторінки "1".

	![Page](http://webmagic.qiniudn.com/oscimages/193620_Hr9E_190591.png)

* Стаття сторінки Article Page

	Формат статті сторінки "http://blog.sina.com.cn/s/blog_58ae76e80100g8au.html", де "58ae76e80100g8au" змінна характеристика.

	![Article Page](http://webmagic.qiniudn.com/oscimages/193102_ZleC_190591.png)

#### 2 Пошук URL-ів на статті

По вимозі пошукача URL статті є нашою кінцевою метою, так як знайти всі статті в цьому блозі адреса є першим кроком сканерів.

Ми можемо використовувати регулярні вирази `http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html` як фільтр грубої очистки для URL-ів. Більш складним є те, що цей URL є занадто широким і може повзти до іншої інформації в блозі, тому ми повинні вказати область на сторінці зі списком URL, які необхідно отримати.
￼
Тут ми використовуємо `XPath` `//div[@class=\\"articleList\\"]` для вибірки усіх областей. Потім використаємо `links()` або `XPath` `//a/@href` щоб отримати всі посилання. І, нарешті, застосовуємо регулярні вирази `http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html`, щоб відфільтрувати URL та видалити деякі зайві категорії посиланнь "edit" (редагувати) або "more" (докладніще). Таким чином, ми можемо написати:

```java
page.addTargetRequests(page.getHtml().xpath("//div[@class=\"articleList\"]").links().regex("http://blog\\.sina\\.com\\.cn/s/blog_\\w+\\.html").all());
```
У той же час, нам потрібно знайти список всіх сторінок, щоб додати їх URL до списку черги завантажень:

```java
page.addTargetRequests(page.getHtml().links().regex("http://blog\\.sina\\.com\\.cn/s/articlelist_1487828712_0_\\d+\\.html").all());
```

#### 3 Екстракція контенту

Витяг інформації зі сторінки статті досить простий, застосовуємо `XPath` вираз відповідний до цього.

```java
page.putField("title", page.getHtml().xpath("//div[@class='articalTitle']/h2"));
page.putField("content", page.getHtml().xpath("//div[@id='articlebody']//div[@class='articalContent']"));
page.putField("date",
        page.getHtml().xpath("//div[@id='articlebody']//span[@class='time SG_txtc']").regex("\\((.*)\\)"));
```

#### 4 Розрізнити лінки на списки та цільові сторінки

Ми визначили список URL цільових сторінок і шляхи їх обробки.
Тепер маємо справу їх розрізнити.
У цьому випадку відрізнити дуже просто - формат списку URL на інші сторінки та формат URL сторінки призначення відрізняється. Тому зробимо це!

```java
// List
if (page.getUrl().regex(URL_LIST).match()) {
    page.addTargetRequests(page.getHtml().xpath("//div[@class=\"articleList\"]").links().regex(URL_POST).all());
    page.addTargetRequests(page.getHtml().links().regex(URL_LIST).all());
    // Article Page
} else {
    page.putField("title", page.getHtml().xpath("//div[@class='articalTitle']/h2"));
    page.putField("content", page.getHtml().xpath("//div[@id='articlebody']//div[@class='articalContent']"));
    page.putField("date",
            page.getHtml().xpath("//div[@id='articlebody']//span[@class='time SG_txtc']").regex("\\((.*)\\)"));
}
```

Переглянути повний код наведеного прикладу [SinaBlogProcessor.java](https://github.com/code4craft/webmagic/blob/master/webmagic-samples/src/main/java/us/codecraft/webmagic/samples/SinaBlogProcessor.java).

#### 5 Підсумки

У цьому прикладі використали декілька головних метода:

* Пошук посиланнь зі сторінки за допомогою регулярних виразів та їх фільтрація по області розташування.
* `PageProcessor` з двома типами налаштувань сторінки, в залежності від його URL, для відокремлення цілей між ними.

Друзі, що мали з деякі незручності та відмінності залишили [#issue83](https://github.com/code4craft/webmagic/issues/83). Є плани з версії 0.5.0 додати до фіч у WebMagic  [`SubPageProcessor`](https://github.com/code4craft/webmagic/blob/master/webmagic-extension/src/main/java/us/codecraft/webmagic/handler/SubPageProcessor.java) для вирішення цих проблем.
