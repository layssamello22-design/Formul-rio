/* ==========================================================================
   AGUARDAR CARREGAMENTO DA DOM E CAPTURAR ELEMENTOS
   ========================================================================== */

// Garantimos que o código só rode após a estrutura do HTML estar pronta
document.addEventListener("DOMContentLoaded", () => {
    
    // Selecionamos os inputs do formulário utilizando seus IDs únicos
    const inputCpf = document.getElementById("cpf");
    const inputTelefone = document.getElementById("telefone");

    /* ==========================================================================
       LÓGICA DA MÁSCARA DE CPF (Formato: 000.000.000-00)
       ========================================================================== */
    if (inputCpf) {
        inputCpf.addEventListener("input", (e) => {
            // 1. Captura o valor atual digitado pelo usuário
            let valor = e.target.value;

            // 2. Remove TUDO o que não for número (substitui qualquer caractere não-numérico por vazio)
            // O padrão \D significa "tudo que é diferente de dígito"
            valor = valor.replace(/\D/g, "");

            // 3. Garante o limite máximo de 11 dígitos para o CPF
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            // 4. Aplica a formatação em etapas baseado na quantidade de números digitados
            // Ex: 123456 -> 123.456
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            
            // Ex: 123.456789 -> 123.456.789
            valor = valor.replace(/(\d{3})(\d)/, "$1.$2");
            
            // Ex: 123.456.78901 -> 123.456.789-01
            valor = valor.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

            // 5. Devolve o valor formatado de volta para a tela do usuário
            e.target.value = valor;
        });
    }

    /* ==========================================================================
       LÓGICA DA MÁSCARA DE TELEFONE (Formato Dinâmico: (XX) XXXXX-XXXX ou (XX) XXXX-XXXX)
       ========================================================================== */
    if (inputTelefone) {
        inputTelefone.addEventListener("input", (e) => {
            let valor = e.target.value;

            // Remove qualquer caractere que não seja número
            valor = valor.replace(/\D/g, "");

            // Limita a digitação ao máximo de 11 números (DDD + 9 dígitos)
            if (valor.length > 11) {
                valor = valor.slice(0, 11);
            }

            // Formatação do DDD: adiciona os parênteses ao redor dos 2 primeiros dígitos
            valor = valor.replace(/^(\d{2})(\d)/g, "($1) $2");

            // Formatação do corpo do número:
            // Caso 1: Se tiver 11 dígitos, é celular (Formato: (XX) XXXXX-XXXX)
            if (valor.replace(/\D/g, "").length === 11) {
                valor = valor.replace(/(\s\d{5})(\d)/, "$1-$2");
            } 
            // Caso 2: Se tiver até 10 dígitos, trata como fixo (Formato: (XX) XXXX-XXXX)
            else {
                valor = valor.replace(/(\s\d{4})(\d)/, "$1-$2");
            }

            // Atualiza o input com a máscara em tempo real
            e.target.value = valor;
        });
    }
});

/* ==========================================================================
   FUNÇÃO MATEMÁTICA PARA VALIDAÇÃO DE CPF
   ========================================================================== */
function validarCPF(cpfLimpo) {
    // 1. Elimina CPFs com dígitos todos iguais conhecidamente inválidos (ex: 11111111111)
    if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;

    // 2. Validação do Primeiro Dígito Verificador
    let soma = 0;
    let resto;

    // Multiplica os 9 primeiros dígitos por pesos decrescentes de 10 a 2
    for (let i = 1; i <= 9; i++) {
        soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (11 - i);
    }
    
    // O resto da divisão por 11 determina o dígito correto
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(9, 10))) return false;

    // 3. Validação do Segundo Dígito Verificador
    soma = 0;
    // Multiplica os 10 primeiros dígitos por pesos decrescentes de 11 a 2
    for (let i = 1; i <= 10; i++) {
        soma = soma + parseInt(cpfLimpo.substring(i - 1, i)) * (12 - i);
    }
    
    resto = (soma * 10) % 11;
    if ((resto === 10) || (resto === 11)) resto = 0;
    if (resto !== parseInt(cpfLimpo.substring(10, 11))) return false;

    return true; // Se passou por todas as etapas, o CPF é matematicamente válido!
}

/* ==========================================================================
   INTERCEPTANDO O ENVIO DO FORMULÁRIO (INTEGRAÇÃO)
   ========================================================================== */
const formulario = document.querySelector("form");
const inputCpf = document.getElementById("cpf");

formulario.addEventListener("submit", (e) => {
    // Remove os pontos e hifens da máscara visual para extrair apenas os números
    const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

    // Executa a função de validação matemática
    if (!validarCPF(cpfApenasNumeros)) {
        // Alerta o usuário e cancela o envio dos dados para o servidor backend
        alert("❌ Erro: O número de CPF digitado é inválido. Por favor, verifique.");
        inputCpf.focus();
        e.preventDefault(); // Bloqueia a submissão do formulário
    }
});


/* ==========================================================================
   VALIDAÇÃO VISUAL EM TEMPO REAL (EVENTO BLUR)
   ========================================================================== */

// O evento "blur" acontece quando o campo perde o foco (o usuário clica fora dele)
inputCpf.addEventListener("blur", () => {
    const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

    // Se o campo estiver vazio, não aplica erro ainda (deixa para o atributo 'required')
    if (cpfApenasNumeros.length === 0) {
        inputCpf.classList.remove("input-error");
        return;
    }

    // Executa a função matemática de validação
    if (!validarCPF(cpfApenasNumeros)) {
        // Se for inválido, adiciona a classe CSS de erro
        inputCpf.classList.add("input-error");
    } else {
        // Se for válido, remove a classe (a borda volta ao azul/cinza padrão)
        inputCpf.classList.remove("input-error");
    }
});

/* ==========================================================================
   BLOQUEIO DO ENVIO DO FORMULÁRIO CASO PERSISTA O ERRO
   ========================================================================== */
formulario.addEventListener("submit", (e) => {
    const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

    if (!validarCPF(cpfApenasNumeros)) {
        // Adiciona o erro visual caso o usuário tente enviar sem clicar fora antes
        inputCpf.classList.add("input-error");
        inputCpf.focus();
        
        // Cancela o envio dos dados
        e.preventDefault();
    }
});

/* ==========================================================================
   FUNÇÕES AUXILIARES DE GERENCIAMENTO DE ERRO
   ========================================================================== */

// Função que injeta a classe de erro e cria a mensagem de texto
function mostrarErroCpf(input, mensagem) {
    // Adiciona a borda vermelha
    input.classList.add("input-error");

    // Seleciona a div pai (o container do input) para sabermos onde inserir o texto
    const containerPai = input.parentElement;

    // Verifica se já existe uma mensagem de erro na tela para evitar duplicidade
    let mensagemExistente = containerPai.querySelector(".error-message");

    if (!mensagemExistente) {
        // Cria um elemento <span> do zero na memória do navegador
        const spanErro = document.createElement("span");
        spanErro.classList.add("error-message"); // Aplica o estilo CSS criado
        spanErro.innerText = mensagem;           // Define o texto do aviso
        
        // Injeta o novo <span> dentro da div pai, posicionando-o logo após o input
        containerPai.appendChild(spanErro);
    }
}

// Função que remove a borda vermelha e apaga a mensagem de texto da tela
function removerErroCpf(input) {
    // Remove a borda vermelha
    input.classList.remove("input-error");

    const containerPai = input.parentElement;
    // Procura o elemento de erro dentro desta div pai específica
    const mensagemExistente = containerPai.querySelector(".error-message");

    // Se a mensagem for encontrada, remove ela da árvore do HTML (DOM)
    if (mensagemExistente) {
        mensagemExistente.remove();
    }
}

/* ==========================================================================
   INTERCEPTANDO EVENTOS COM ATUALIZAÇÃO DINÂMICA
   ========================================================================== */

// Validação em tempo real quando o usuário clica fora do campo (blur)
inputCpf.addEventListener("blur", () => {
    const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

    // Se estiver vazio, limpa qualquer erro anterior e deixa a validação para o 'required'
    if (cpfApenasNumeros.length === 0) {
        removerErroCpf(inputCpf);
        return;
    }

    // Executa o teste matemático do algoritmo
    if (!validarCPF(cpfApenasNumeros)) {
        mostrarErroCpf(inputCpf, "⚠️ CPF inválido. Tente novamente.");
    } else {
        removerErroCpf(inputCpf);
    }
});

// Validação de segurança ao tentar enviar o formulário (submit)
formulario.addEventListener("submit", (e) => {
    const cpfApenasNumeros = inputCpf.value.replace(/\D/g, "");

    if (!validarCPF(cpfApenasNumeros)) {
        // Exibe o erro e cancela o envio
        mostrarErroCpf(inputCpf, "⚠️ CPF inválido. Verifique o número antes de concluir.");
        inputCpf.focus();
        e.preventDefault();
    }
});


