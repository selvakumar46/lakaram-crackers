@echo off
echo ========================================================
echo Starting SparkleFest Crackers Java Spring Boot Backend...
echo ========================================================
set JAVA_HOME=D:\AGENT\java-17-openjdk-17.0.6.0.10-1.win.x86_64
set PATH=%JAVA_HOME%\bin;D:\apache-maven-3.9.14\bin;%PATH%
cd backend
D:\apache-maven-3.9.14\bin\mvn.cmd spring-boot:run
pause
