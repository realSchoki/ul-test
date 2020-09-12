FROM ubuntu:latest

RUN useradd -m altv

USER altv
WORKDIR ~/server

COPY . .

CMD ["start.sh"]