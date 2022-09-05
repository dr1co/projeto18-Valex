# Projeto 18: Valex

#### Bem vindo ao projeto Valex, uma API dedicada para gerenciamento de cartões de benefícios, incluindo transações e recargas, bem como criação e ativação de novos cartões e bloqueio e desbloqueio de cartões já cadastrados.

---
## Por onde começar?

O projeto possui dois roteadores: um para cartões e outro para transações. Como não há a implementação de um sistema de cadastro de novos usuários, pode ser usado o **Sr. Teste** no lugar, um usuário teste presente no dump do projeto (valex.sql) que possui as seguintes informações:

```json
{
    employeeId: 3,
    fullName: "Teste",
    cards: [
        {
            id: 2,
            securityCode: 683,
            isBlocked: true,
            type: "groceries"
        },
        {
            id: 3,
            securityCode: 320,
            isBlocked: false,
            type: "restaurant"
        }
    ]
}
```
Para a apiKey de uma empresa, pode-se utilizar a seguinte abaixo: 
```json
{
    apiKey: "zadKLNx.DzvOVjQH01TumGl2urPjPQSxUbf67vs0"
}
```

## Índice:
- ### Rotas: cartões ( /cards )
    - POST - criação de um novo cartão;
    - PUT: ./activate/:id - ativação de cartão;
    - PUT: ./block/:id - bloqueio de cartão;
    - PUT: ./unblock/:id - desbloqueio de cartão;
- ### Rotas: transações ( /transactions )
    - GET ./:id - visualização de transações e saldo;
    - POST ./recharge/:id - recarga de cartão;
    - POST ./payment/:id - pagamento usando um cartão;

### Rotas: cartões ( /cards ):
- POST:

    Essa rota consiste na criação de um cartão. Para ela funcionar corretamente, é necessário o uso de uma apiKey pelo header _X-API-KEY_ e do corpo no formato:
```json
{
    "employeeId": number,
    "type": string
}
```
    Regras:
        1: Tipos válidos: 'groceries', 'restaurant', 'transport', 'education', 'health'.
        2: apiKey deve pertencer a uma empresa válida, no caso, somente a fornecida acima irá funcionar.
        3: Além de o empregado ser alguém cadastrado, um mesmo empregado não pode ter dois cartões ou mais de mesmo tipo.
        4: Retorno esperado: um novo cartão com data de validade para daqui 5 anos: "Card created successfully. Your security code is:" _CVC aqui_
- PUT - ./activate/:id:

    Essa rota consiste na ativação de um cartão. Para ela funcionar corretamente, é necessário passar o id do cartão via parâmetros de rota e um corpo no seguinte formato:
```json
{
    "securityCode": string de 3 dígitos com apenas números,
    "password": string de 4 dígitos com apenas números
}
```
```json
Regras:
    1: O cartão deve corresponder a um cadastrado no banco de dados e este não pode estar expirado.
    2: A senha é criada neste momento com o valor fornecido, portanto lembre-se dela para efetuar possíveis compras e bloqueio de cartão.
    3: o código de segurança deve corresponder ao recebido.
    4: se já foi cadastrado uma senha no cartão, isso implica que ele está ativo, portanto não é possível ativá-lo novamente. 
    5: Retorno esperado: 202
```
- PUT - ./block/:id:

    Essa rota consiste no bloqueio de um cartão. Para ela funcionar corretamente, basta passar o id do cartão via parâmetros de rota e um corpo no seguinte formato:
```json
{
    "password": string de 4 dígitos com apenas números
}
```
```json
Regras:
    1: O cartão deve corresponder a um cadastrado no banco de dados e este não pode estar expirado.
    2: Somente cartões ainda desbloqueados podem ser bloqueados.
    3: Retorno esperado: 200
```
- PUT - ./unblock/:id:

    Essa rota consiste no desbloqueio de um cartão. Para ela funcionar corretamente, basta passar o id do cartão via parâmetros de rota e um corpo no seguinte formato:
```json
{
    "password": string de 4 dígitos com apenas números
}
```
```json
Regras:
    1: O cartão deve corresponder a um cadastrado no banco de dados e este não pode estar expirado.
    2: Somente cartões ainda bloqueados podem ser desbloqueados.
    3: Retorno esperado: 200
```
### Rotas transações ( /transactions ):
- GET ./:id:

    Essa rota consiste em catalogar as transações de um cartão. Para ela funcionar corretamente, basta apenas passar o id do cartão via parâmetros de rota.
```json  
Regras:
    1: O cartão deve corresponder a um cadastrado no banco de dados.
    2: Retorno esperado: 200 com as seguintes informações:
{
  "balance": number,
  "transactions": [
		{ "id": number, "cardId": number, "businessId": number, "businessName": string, "timestamp": string, "amount": number }, ...
	]
  "recharges": [
		{ "id": number, "cardId": number, "timestamp": string, "amount": number }, ...
	]
}
```
- POST ./recharge/:id

    Essa rota consiste em realizar uma recarga. Para ela funcionar corretamente, é necessário passar o id do cartão via parâmetros de rota e um corpo no seguinte formato:
```json
{
    "amount": number maior que zero
}
```
```json
Regras:
    1: O cartão deve corresponder a um cadastrado no banco de dados e este não pode estar expirado, ou bloqueado ou não ativado.
    2: Retorno esperado: 200 exibindo o seu novo saldo
- POST ./payment/:id

    Essa rota consiste em realizar um pagamento. Ela é um pouco mais extensa que a rota anterior, pois para funcionar corretamente é necessário um objeto com mais informações, como sugere o formato:
```json
{
    "amount": number maior que zero,
    "businessId": number,
    "password": string de 4 dígitos com apenas números
}
```
```json
Regras:
    1: O cartão deve corresponder a um cadastrado no banco de dados e este não pode estar expirado, ou bloqueado ou não ativado.
    2: O saldo deve ser o suficiente para cobrir a compra passada pelo _amount_.
    3: A senha deve ser passada correspondendo à senha cadastrada no cartão.
    4: O cartão pode ser usado apenas em estabelecimentos cadastrados e que correspondam ao tipo de seu cartão. (Ex: não pode usar um cartão do tipo 'restaurant' para pagar as suas compras do mercado)
    5: Retorno esperado: 200 exibindo o seu novo saldo
```