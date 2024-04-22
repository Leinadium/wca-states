FROM mysql

ENV MYSQL_ROOT_PASSWORD=wca
ENV MYSQL_DATABASE=wca
ENV MYSQL_USER=wca
ENV MYSQL_PASSWORD=wca

ADD wca_dump.sql /docker-entrypoint-initdb.d/1.sql
ADD resultsbystate.sql /docker-entrypoint-initdb.d/2.sql

EXPOSE 3306

CMD ["--default-authentication-plugin=mysql_native_password"]