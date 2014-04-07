## 2.下载和编译源码

WebMagic是一个纯Java项目，如果你熟悉Maven，那么下载并编译源码是非常简单的。如果不熟悉Maven也没关系，这部分会介绍如何在Eclipse里导入这个项目。

### 2.1 下载源码

WebMagic目前有两个仓库：

* [https://github.com/code4craft/webmagic](https://github.com/code4craft/webmagic)

github上的仓库保存最新版本，所有issue、pull request都在这里。大家觉得项目不错的话别忘了去给个star哦！

* [http://git.oschina.net/flashsword20/webmagic](http://git.oschina.net/flashsword20/webmagic)

此仓库包含所有编译好的依赖包，只保存项目的稳定版本，最新版本仍在github上更新。oschina在国内比较稳定，主要作为镜像。

无论在哪个仓库，使用

	git clone https://github.com/code4craft/webmagic.git
	
或者

	git clone http://git.oschina.net/flashsword20/webmagic.git
	
即可下载最新代码。

如果你对git本身使用也不熟悉，建议看看@黄勇的 [从 Git OSC 下载 Smart 源码](http://my.oschina.net/huangyong/blog/200075)

### 2.2 导入项目

Intellij Idea默认自带Maven支持，import项目时选择Maven项目即可。

#### 2.2.1 使用m2e插件

使用Eclipse的用户，推荐安装m2e插件，安装地址：https://www.eclipse.org/m2e/download/[](https://www.eclipse.org/m2e/download/)

安装后，在File->Import中选择Maven->Existing Maven Projects即可导入项目。

![m2e-import](http://static.oschina.net/uploads/space/2014/0403/104427_eNuc_190591.png)

导入后看到项目选择界面，点击finish即可。

![m2e-import2](http://static.oschina.net/uploads/space/2014/0403/104735_6vwG_190591.png)

#### 2.2.2 使用Maven Eclipse插件

如果没有安装m2e插件，只要你安装了Maven，也是比较好办的。在项目根目录下使用命令：

	mvn eclipse:eclipse
	
生成maven项目结构的eclipse配置文件，然后在File->Import中选择General->Existing Projects into Workspace即可导入项目。

![eclipse-import-1](http://static.oschina.net/uploads/space/2014/0403/100025_DAcy_190591.png)

导入后看到项目选择界面，点击finish即可。

![eclipse-import-2](http://static.oschina.net/uploads/space/2014/0403/100227_73DJ_190591.png)

### 2.3 编译和执行源码

导入成功之后，应该就没有编译错误了！此时你可以运行一下webmagic-core项目中自带的exmaple:"us.codecraft.webmagic.processor.example.GithubRepoPageProcessor"。

同样，看到控制台输出如下，则表示源码编译和执行成功了！

![runlog](http://static.oschina.net/uploads/space/2014/0403/103741_3Gf5_190591.png)
