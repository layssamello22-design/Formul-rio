const obj1={
    "nome": "Computador",
    "price": 50.9,
    "due-date": "2026-09-23"
}

const obj2={
    nome: "Computador",
    "price": "50.9",
    "due-date": "2026-09-23"
}

const obj3={
    id: 53,
    date: "2026-10-20",
    item: [
        {
            description:"Celular",
            price: 1499.99,
            quantity: 1

        },
        {
            description: "Mouse",
            price: 100.0,
            quantity: 2
        }
    ],
    client:{
        nome: "Maria Red",
        email: "maria@gmail.com",
        active: true
    }
};

const txt = `{"nome": "Computador", "price": 50.9, "due-date: "2026-09-23"}`;

const obj4 = JSON.parse(txt);

const txt2 = JSON.stringify(obj3);

    /*
    JSON.parse() -> converte uma string JSON em um objeto JavaScript
    JSON.stringify() -> converte um objeto JavaScript em uma string JSON
    */


    /*Funções*/

function soma1(a , b){
    return a+ b;
};

const soma2 = function(a, b){
    return a + b;
}; 

const soma3 = (a , b) => {
    return a + b;
};

const soma4 = (a, b) => a + b;
//função que não tem retorno

function mostrarPreco(preco) {
    console.log(`O preço R$ é ${preco.toFixed(2)}`);
};

function areaCirculo(raio){
    const pi = 3.14;
    return pi * raio * raio;

};

// Function hoisting: declaracoes de funcoes sao "movidas" para cima pelo motor do JavaScript, permitindo que sejam chamadas antes de serem definidas no código.

teste(5);

function teste(x){
    console.log("Teste" + x);
}

//Funcoes podem ser passadas como argumento
function tripolo(num){
    return num * 3;
}
function aplicarFuncao(num, funcao) {
    const result = funcao(num);
    console.log(`Resultado: ${result}`);
    
}

aplicarFuncao(5, tripolo);

