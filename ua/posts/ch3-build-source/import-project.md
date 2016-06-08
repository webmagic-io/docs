### 3.2 Імпорт проекту

`IntelliJ IDEA` за замовчуванням поставляється з підтримкою `Maven`, вибрати елементи, які ви можете імпортувати у Maven проекти.

#### 3.2.1 m2e плагін
Користувачам Eclipse рекомендується встановити `m2e plug-in` плагін за адресою установки: [https://www.eclipse.org/m2e/download/](https://www.eclipse.org/m2e/download/)

Після установки, виберіть `File-> Import ...` і виберіть Існуючі проекти Maven `Maven->Existing Maven Projects` і натисніть кнопку Далі `Next`, можна папку для імпорту в проект.

![M2e-import](http://webmagic.qiniudn.com/oscimages/104427_eNuc_190591.png)

Після імпорту проекту, щоб побачити екран вибору, ви можете натиснути кнопку Готово finish.

![M2e-import2](http://webmagic.qiniudn.com/oscimages/104735_6vwG_190591.png)

#### 3.2.2 Використання Maven плагін для Eclipse

Якщо m2e плагін `m2e plug-in` не встановлено, але ви можете встановити Maven, він відносно простий у використанні. Команда в кореневій директорії проекту:

```bash
mvn eclipse:eclipse
```

Сгенерóється файл конфігурації структури Maven для проекту Eclipse, а потім виберіть `File->Import and open General->Existing Projects into Workspace` для імпорту підготовленого проекту.

![Eclipse, імпорт-1](http://webmagic.qiniudn.com/oscimages/100025_DAcy_190591.png)

Після імпорту проекту, побачете екран вибору, та можете натиснути кнопку Готово finish.

![Eclipse, імпорт-2](http://webmagic.qiniudn.com/oscimages/100227_73DJ_190591.png)