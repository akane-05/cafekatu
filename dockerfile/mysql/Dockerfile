FROM mysql:8.0

EXPOSE 3306

ENV MYSQL_DATABASE cafekatu_db

COPY my.cnf /etc/mysql/conf.d/my.cnf

#COPY db /docker-entrypoint-initdb.d

CMD ["mysqld"]