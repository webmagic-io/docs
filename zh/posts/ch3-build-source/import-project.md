### 3.2 导入项目

Intellij Idea默认自带Maven支持，import项目时选择Maven项目即可。

#### 3.2.1 使用m2e插件

使用Eclipse的用户，推荐安装m2e插件，安装地址：https://www.eclipse.org/m2e/download/[](https://www.eclipse.org/m2e/download/)

安装后，在File->Import中选择Maven->Existing Maven Projects即可导入项目。

![m2e-import](http://static.oschina.net/uploads/space/2014/0403/104427_eNuc_190591.png)

导入后看到项目选择界面，点击finish即可。

![m2e-import2](http://static.oschina.net/uploads/space/2014/0403/104735_6vwG_190591.png)

#### 3.2.2 使用Maven Eclipse插件

如果没有安装m2e插件，只要你安装了Maven，也是比较好办的。在项目根目录下使用命令：

	mvn eclipse:eclipse
	
生成maven项目结构的eclipse配置文件，然后在File->Import中选择General->Existing Projects into Workspace即可导入项目。

![eclipse-import-1](http://static.oschina.net/uploads/space/2014/0403/100025_DAcy_190591.png)

导入后看到项目选择界面，点击finish即可。

![eclipse-import-2](http://static.oschina.net/uploads/space/2014/0403/100227_73DJ_190591.png)
