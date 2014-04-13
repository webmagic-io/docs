### webmagic结合log4j

> 此文由[@简单](https://github.com/cnjavaer)编写。

因为webmagic的日志较多，这篇文章讲解如何扩展log4j，实现：

1. log日志保存到文件
2. 日志按天保存到文件 
3. 只保留最近7天的日志文件.

特别提示,webmaigc中使用的是 log4j.xml,如果您使用log4j.properties配置文件是没有任何效果的,需要使用log4j.xml,程序会自动覆盖掉.


log4j.xml配置文件内容如下.

```xml
    <?xml version="1.0" encoding="UTF-8"?>
	 <!DOCTYPE log4j:configuration SYSTEM "log4j.dtd">
	 <log4j:configuration xmlns:log4j="http://jakarta.apache.org/log4j/">

	<!-- 输出到控制台 -->
 	<appender name="console" class="org.apache.log4j.ConsoleAppender">
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%d{yy-MM-dd HH:mm:ss,SSS} %-5p %c(%F:%L) ## %m%n" />
        </layout>
    </appender>
    
    <!-- 输出到文件,并每天产生一个文件 -->
	<!--
        com.candou.log4j.CustomLogAppender为log4j自定义工具类.
		原始的为org.apache.log4j.ConsoleFile
	-->
    <appender name="file" class="com.candou.log4j.CustomLogAppender">
    	<param name = "File" value="日志文件的保存地址/文件名称.log"/>
		<!--日期的格式-->
        <param name="DatePattern" value="'.'yyyy-MM-dd'.log'" />
        <layout class="org.apache.log4j.PatternLayout">
            <param name="ConversionPattern" value="%d{yy-MM-dd HH:mm:ss,SSS} %-5p %c(%F:%L) ## %m%n" />
        </layout>
    </appender>
	
    <logger name="org.apache" additivity="false">
		<!--info为log日志的级别-->
        <level value="info" />
        <appender-ref ref="file" />
        <appender-ref ref="console" />
    </logger>

    <root>
        <level value="info" />
        <appender-ref ref="file" />
        <appender-ref ref="console" />
    </root>

	</log4j:configuration>
```

CustomLogAppender这个类里扩展了一些功能,代码如下

```java
    package com.candou.log4j;

	import java.io.File;
	import java.io.IOException;
	import java.text.SimpleDateFormat;
	import java.util.ArrayList;
	import java.util.Calendar;
	import java.util.Date;
	import java.util.List;
	import org.apache.log4j.FileAppender;
	import org.apache.log4j.Layout;
	import org.apache.log4j.helpers.LogLog;
	import org.apache.log4j.spi.LoggingEvent;

	/**
	 * Log4j自定义工具类
	 * 扩展的一个按天滚动的appender类, 暂时不支持datePattern设置, 但是可以配置maxBackupIndex.
	 * 
	 * @author LiuAifeng
	 * 
	 */
	public class CustomLogAppender extends FileAppender {

		/** 不允许改写的datepattern */
		private static final String datePattern = "'.'yyyy-MM-dd";
		/** 最多文件增长个数 */
		private int maxBackupIndex = 7;
		/** 文件名+上次最后更新时间 */
		private String scheduledFilename;
	
		/**
		 * The next time we estimate a rollover should occur.
		 */
		private long nextCheck = System.currentTimeMillis() - 1;
	
		Date now = new Date();
		SimpleDateFormat sdf;
	
		/**
		 * The default constructor does nothing.
		 */
		public CustomLogAppender() {
		}
	
		/**
		 * 改造过的构造器
		 */
		public CustomLogAppender(Layout layout, String filename, int maxBackupIndex) throws IOException {
			super(layout, filename, true);
			this.maxBackupIndex = maxBackupIndex;
			activateOptions();
		}
	
		/** * 初始化本Appender对象的时候调用一次 */
		@Override
	    public void activateOptions() {
	        super.activateOptions();
	        if (fileName != null) {
	            // perf.log now.setTime(System.currentTimeMillis());
	            sdf = new SimpleDateFormat(datePattern);
	            File file = new File(fileName);
	            // 获取最后更新时间拼成的文件名
	            scheduledFilename = fileName + sdf.format(new Date(file.lastModified()));
	        } else {
	            LogLog.error("File is not set for appender [" + name + "].");
	        } if (maxBackupIndex <= 0) {
	            LogLog.error("maxBackupIndex reset to default value[2],orignal value is:" + maxBackupIndex);
	            maxBackupIndex = 2;
	        }
	    }
	
		/**
		 * 滚动文件的函数:<br>
		 * 1. 对文件名带的时间戳进行比较, 确定是否更新<br>
		 * 2. if需要更新, 当前文件rename到文件名+日期, 重新开始写文件<br>
		 * 3. 针对配置的maxBackupIndex,删除过期的文件
		 */
		void rollOver() throws IOException {
			String datedFilename = fileName + sdf.format(now);
			// 如果上次写的日期跟当前日期相同，不需要换文件
			if (scheduledFilename.equals(datedFilename)) {
				return;
			}
			// close current file, and rename it to datedFilename
			this.closeFile();
			File target = new File(scheduledFilename);
			if (target.exists()) {
				try {
					target.delete();
				} catch (SecurityException e) {
					e.printStackTrace();
				}
			}
	
			File file = new File(fileName);
			boolean result = file.renameTo(target);
			if (result) {
				LogLog.debug(fileName + " -> " + scheduledFilename);
			} else {
				LogLog.error("Failed to rename [" + fileName + "] to [" + scheduledFilename + "].");
			}
	
			// 删除过期文件
			if (maxBackupIndex > 0) {
				File folder = new File(file.getParent());
				List<String> maxBackupIndexDates = getMaxBackupIndexDates();
				for (File ff : folder.listFiles()) {
					// 遍历目录，将日期不在备份范围内的日志删掉
					if (ff.getName().startsWith(file.getName()) && !ff.getName().equals(file.getName())) {
						// 获取文件名带的日期时间戳
						String markedDate = ff.getName().substring(file.getName().length());
						if (!maxBackupIndexDates.contains(markedDate)) {
							result = ff.delete();
						}
						if (result) {
							LogLog.debug(ff.getName() + " -> deleted ");
						} else {
							LogLog.error("Failed to deleted old DayRollingFileAppender file :" + ff.getName());
						}
					}
				}
			}
	
			try {
				// This will also close the file. This is OK since multiple
				// close operations are safe.
				this.setFile(fileName, false, this.bufferedIO, this.bufferSize);
			} catch (IOException e) {
				errorHandler.error("setFile(" + fileName + ", false) call failed.");
			}
	
			scheduledFilename = datedFilename;
			// 更新最后更新日期戳
		}

		/**
		 * Actual writing occurs here. 这个方法是写操作真正的执行过程.
		 */
		@Override
		protected void subAppend(LoggingEvent event) {
	
			long n = System.currentTimeMillis();
			if (n >= nextCheck) {
	
				// 在每次写操作前判断一下是否需要滚动文件
				now.setTime(n);
				nextCheck = getNextDayCheckPoint(now);
				try {
					rollOver();
				} catch (IOException ioe) {
					LogLog.error("rollOver() failed.", ioe);
				}
			}
			super.subAppend(event);
		}

		/**
		 * 获取下一天的时间变更点
		 * 
		 * @param now
		 * @return
		 */
		long getNextDayCheckPoint(Date now) {
	
			Calendar calendar = Calendar.getInstance();
			calendar.setTime(now);
			calendar.set(Calendar.HOUR_OF_DAY, 0);
			calendar.set(Calendar.MINUTE, 0);
			calendar.set(Calendar.SECOND, 0);
			calendar.set(Calendar.MILLISECOND, 0);// 注意MILLISECOND,毫秒也要置0.。。否则错了也找不出来的
													// calendar.add(Calendar.DATE,
													// 1);
			return calendar.getTimeInMillis();
		}

		/**
	     * 根据maxBackupIndex配置的备份文件个数，获取要保留log文件的日期范围集合
	     * @return list<'fileName+yyyy-MM-dd'>
	     */
		List<String> getMaxBackupIndexDates() {
	
			List<String> result = new ArrayList<String>();
			if (maxBackupIndex > 0) {
				for (int i = 1; i <= maxBackupIndex; i++) {
					Calendar calendar = Calendar.getInstance();
					calendar.setTime(now);
					calendar.set(Calendar.HOUR_OF_DAY, 0);
					calendar.set(Calendar.MINUTE, 0);
					calendar.set(Calendar.SECOND, 0);
					calendar.set(Calendar.MILLISECOND, 0);
	
					// 注意MILLISECOND,毫秒也要置0...否则错了也找不出来的
					calendar.add(Calendar.DATE, -i);
					result.add(sdf.format(calendar.getTime()));
				}
			}
	
			return result;
		}

		public int getMaxBackupIndex() {
			return maxBackupIndex;
		}
	
		public void setMaxBackupIndex(int maxBackupIndex) {
			this.maxBackupIndex = maxBackupIndex;
		}
	
		public String getDatePattern() {
			return datePattern;
		}

	}
```

 在一个类里使用log也是非常简单的.
 `private Logger log = Logger.getLogger(getClass());`
 您可以使用log.info(msg);  log.error(msg);  log.log(msg); log.bug(msg);
 等方法,来记录不同级别的日志信息.


