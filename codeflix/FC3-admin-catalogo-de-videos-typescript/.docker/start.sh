#!/bin/bash

# Instalar dependências como root se necessário (volume nomeado pode ter permissões incorretas)
# Depois mudar o dono para node:node
if [ ! -w "node_modules" ] || [ ! -d "node_modules" ] || [ -z "$(ls -A node_modules 2>/dev/null)" ]; then
  echo "Instalando dependências como root devido a problemas de permissão do volume..."
  su root -c "cd /home/node/app && npm install"
  su root -c "chown -R node:node /home/node/app/node_modules"
else
  echo "Instalando dependências como usuário node..."
  npm install
fi

tail -f /dev/null
