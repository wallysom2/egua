export const EGUA_CONTEXT = `
LINGUAGEM ÉGUA - CONTEXTO PARA ANÁLISE DE CÓDIGO

[VISÃO GERAL]
O comando básico para exibir texto na linguagem Égua é \`escreva()\`. Ele é usado para imprimir mensagens no console, sendo essencial para interagir com o usuário.

[COMO FAZER UM OLÁ, MUNDO!]
1. **Usando o comando \`escreva()\`**
   - O comando \`escreva()\` é a função integrada na linguagem Égua para exibir mensagens.
   - **Exemplo:**
     \`\`\` 
     escreva("Olá, mundo!");
     \`\`\`
   - **Explicação:**
     - \`"Olá, mundo!"\`: A mensagem a ser exibida é um texto (string) delimitado por aspas duplas.
     - \`;\`: O ponto e vírgula no final é obrigatório para indicar o término do comando.
   - **Dica:** Sempre use aspas duplas ou simples para definir strings, mas mantenha consistência no estilo.

2. **Comando com Variáveis**
   - Você pode usar uma variável para armazenar o texto e exibi-lo com o comando \`escreva()\`.
   - **Exemplo:**
     \`\`\`
     var mensagem = "Olá, mundo!";
     escreva(mensagem);
     \`\`\`
   - **Explicação:**
     - \`var mensagem\`: Declara uma variável chamada \`mensagem\`.
     - \`"Olá, mundo!"\`: Atribui o texto à variável.
     - \`escreva(mensagem)\`: Exibe o valor armazenado em \`mensagem\`.
   - **Dica:** Escolha nomes descritivos para variáveis e evite abreviações.

[ERROS COMUNS AO FAZER UM OLÁ, MUNDO!]
1. **Esquecer aspas:**
   - ERRADO: \`escreva(Olá, mundo!);\`
   - CORRETO: \`escreva("Olá, mundo!");\`

2. **Esquecer o ponto e vírgula:**
   - ERRADO: \`escreva("Olá, mundo!")\`
   - CORRETO: \`escreva("Olá, mundo!");\`

3. **Usar palavras-chave de outras linguagens:**
   - ERRADO: \`print("Olá, mundo!");\`
   - CORRETO: \`escreva("Olá, mundo!");\`
`;


