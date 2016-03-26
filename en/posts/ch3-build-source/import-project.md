### 3.2 Import Project

Intellij Idea default comes with Maven support, select items when you can import Maven projects.

#### 3.2.1 m2e plug-in

Eclipse user, it is recommended to install m2e plug-in installation address: https: //www.eclipse.org/m2e/download/[](https://www.eclipse.org/m2e/download/)

After installation, select  File->Import... and select Maven-> Existing Maven Projects and click Next, can be imported folder into the project.

! [M2e-import] (http://webmagic.qiniudn.com/oscimages/104427_eNuc_190591.png)

After importing the project to see the selection screen, you can click finish.

! [M2e-import2] (http://webmagic.qiniudn.com/oscimages/104735_6vwG_190591.png)

#### 3.2.2 Using Maven Eclipse plugin

If m2e plug is not installed, but you have install Maven, it is relatively easy to handle. Command in the root directory of the project:

mvn eclipse:eclipse

Generate Eclipse Maven project structure configuration file, then select File->Import and open General->Existing Projects into Workspace for import project.

! [Eclipse-import-1] (http://webmagic.qiniudn.com/oscimages/100025_DAcy_190591.png)

After importing the project to see the selection screen, you can click finish.

! [Eclipse-import-2] (http://webmagic.qiniudn.com/oscimages/100227_73DJ_190591.png)
