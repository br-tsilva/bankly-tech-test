# Bankly Technical Test

### Tecnologias presentes no projeto:

- TYPESCRIPT
- EXPRESS
- MySQL
- RabbitMQ
- DOCKER
- DOCKER-COMPOSE

#### Instalacao do projeto (Baseado na distro: Pop!\_OS/Debian Linux):

> [Node.JS v16.14+](https://nodejs.org/en/download/) Obrigatório (Recomendável usar com [NVM](https://github.com/nvm-sh/nvm))
> [Docker (v20.10.14 Recommended)](https://docs.docker.com/engine/install/) Obrigatório
> [Docker Compose (v1.29.2 Recommended)](https://docs.docker.com/compose/install/) Obrigatório

```sh
$ git clone git@github.com:BlackSnowden/bankly-tech-test.git
$ cd ./bankly-tech-test
$ cp ./.env.example ./.env && vi ./.env
$ sh ./start-containers.sh
```

> Não esqueca de configurar o arquivo `.env` antes de executar o comando `npm install`

#### Configurando `.env`

> Esta configuracão é obrigatória para a criacão de instâncias do `NodeJS`, `RabbitMQ` e `MySQL`.

```sh
$ vi ./.env
```

| Variável            | Descricão                                       | Exemplo                             |
| ------------------- | ----------------------------------------------- | ----------------------------------- |
| SERVER_PORT         | Porta em que o servidor irá escutar requisicões | 3000                                |
| BANKLY_SERVICE_HOST | Endereco do servico bankly                      | https://acessoaccount.herokuapp.com |
| DB_HOST             | Host do banco de dados                          | localhost                           |
| DB_PORT             | Porta do banco de dados                         | 3306                                |
| DB_NAME             | Nome do banco de dados                          | db-test                             |
| DB_USERNAME         | Usuário do banco de dados                       | user-mysql-test                     |
| DB_PASSWORD         | Senha do banco de dados                         | pass-pass-test                      |
| RABBITMQ_HOST       | Host do servico RabbitMQ                        | localhost                           |
| RABBITMQ_AMQP_PORT  | Porta do protocolo amqp do servico RabbitMQ     | 5672                                |
| RABBITMQ_HTTP_PORT  | Porta do protocolo http do servico RabbitMQ     | 15672                               |
| RABBITMQ_USERNAME   | Usuário do servico RabbitMQ                     | user-rabbit-test                    |
| RABBITMQ_PASSWORD   | Senha do servico RabbitMQ                       | pass-rabbit-test                    |

#### Endpoints

Os endpoints podem ser visualizados em `http://localhost/docs/`

## License

MIT
