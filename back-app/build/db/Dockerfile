# FROM --platform=linux/amd64 library/mysql:8.0.25
FROM mysql:8.0

ENV MYSQL_DATABASE demo

COPY ./build/db/custom.cnf /etc/mysql/conf.d/

COPY ./build/db/sql /docker-entrypoint-initdb.d

# COPY sql/01_insert.sql /docker-entrypoint-initdb.d/01_insert.sql
# COPY sql/01_table.sql /docker-entrypoint-initdb.d/01_table.sql