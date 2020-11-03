FROM ubuntu:20.04

USER root
RUN apt-get update \
    && apt-get install -y \
        wget \
    && wget https://packages.microsoft.com/config/ubuntu/20.04/packages-microsoft-prod.deb -O packages-microsoft-prod.deb \
    && dpkg -i packages-microsoft-prod.deb \
    && apt-get update \
    && apt-get install -y \
        libatomic1 \
        dotnet-sdk-3.1 \
        curl \
    && curl -sL https://deb.nodesource.com/setup_14.x -o nodesource_setup.sh \
    && bash nodesource_setup.sh \
    && apt install -y nodejs \
    && rm -rf /var/lib/apt/lists/ \
    && useradd -m altv


WORKDIR /home/altv/server
COPY . .

RUN chown altv:altv ./ -R \
    && chmod +x ./starter.sh ./altv-server

USER altv

CMD ["./starter.sh"]
