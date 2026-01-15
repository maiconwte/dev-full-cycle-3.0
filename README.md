# dev-full-cycle-3.0

My "dev-full-cycle-3.0" journey

## Table of Content

## Desafio Use Cases para Product

Da mesma forma que fizemos a criação dos use cases realizando as operações: "create", "find", "list", "update" para "Customer", faça:

Crie as operações mencionadas acima para nossa entidade: "Product".
Implemente os testes de unidade e integração nos quatro use cases.

* A linguagem de programação para este desafio é TypeScript

![product-usecases.](./challenges/3.clean-architecture/files/product-usecases.png)

run
```
 cd challenges/3.clean-architecture/ && npm i && npm run test
```

## Notification Pattern em Products

Aprendemos que o notification pattern nos auxilia como um container acumulador de erros para que possamos de uma forma mais simples retornarmos nossos erros todos de uma vez evitando assim a geração excessiva de exceções.

Nesse desafio você deverá utilizar o padrão notification em nossa entidade Products. Não deixe de realizar os testes automatizados.

Adicione um teste que acumule dois erros ao mesmo tempo.

* A linguagem de programação para este desafio é TypeScript

![product-usecases.](./challenges/3.clean-architecture/files/notification-patterns.png)

run
```
cd challenges/3.clean-architecture/ && npm i && npm run test
```

## 4.FC-MONOLITO

![product-usecases.](./challenges/4.fc-monolito/files/4.fc-monolito.jpeg)

run
```
cd challenges/4.fc-monolito/ && npm i && npm run test
```

## 5. MICROSERVICES & EDA (Event-Driven Architecture)

run
```
cd challenges/5.event-driven-architecture/ && docker compose up -d
```

## 6 Codeflix - Repositório e validação da entidade Categoria

Clone o repositório com o código desenvolvido

```
git clone https://github.com/maiconwte/dev-full-cycle-3.0.git
```

Abra o projeto via terminal/editor, instale as dependências e execute os testes

```
cd dev-full-cycle-3.0/codeflix/FC3-admin-catalogo-de-videos-typescript && npm i && npm run test
```

## 7 Codeflix - Cobertura de testes Typescript e Casos de uso de categoria

Clone o repositório com o código desenvolvido

```
git clone https://github.com/maiconwte/dev-full-cycle-3.0.git
```

Abra o projeto via terminal/editor, instale as dependências e execute os testes

```
cd dev-full-cycle-3.0/codeflix/FC3-admin-catalogo-de-videos-typescript && npm i && npm run test && npm run tsc:check
```