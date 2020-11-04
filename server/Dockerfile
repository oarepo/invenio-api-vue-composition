FROM python:3-buster

RUN mkdir /app
WORKDIR /app

# neccessary files for instalation 
COPY pyproject.toml ./
COPY install.sh ./
COPY testinvenio ./testinvenio


RUN ./install.sh


# files for bootstrap & running
COPY bootstrap.sh ./
COPY run.sh ./
COPY server* ./
COPY docker-run.sh ./
COPY invenio.cfg ./.venv/var/instance/

RUN ls -la



ENTRYPOINT ./docker-run.sh

