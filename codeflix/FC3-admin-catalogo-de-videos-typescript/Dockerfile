FROM node:20.19-slim

RUN npm install -g @nestjs/cli@10.1.17

WORKDIR /home/node/app

# Manter como root para poder corrigir permissões do volume nomeado
# O script start.sh vai mudar para node depois de instalar

CMD ["tail", "-f", "/dev/null"]
