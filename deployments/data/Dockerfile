FROM mysql:5.7

ENV MYSQL_ROOT_PASSWORD=rootroot

ADD leisure.sql /docker-entrypoint-initdb.d

HEALTHCHECK --interval=1m --timeout=10s \
	CMD mysqladmin -uroot -p${MYSQL_ROOT_PASSWORD} ping || exit 1

