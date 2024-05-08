FROM mysql

# ADD wca_dump.sql /docker-entrypoint-initdb.d/1.sql
# ADD resultsbystate.sql /docker-entrypoint-initdb.d/2.sql
ADD schema.sql /docker-entrypoint-initdb.d/1.sql

EXPOSE ${MYSQL_PORT}
