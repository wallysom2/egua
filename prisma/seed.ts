import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar dados existentes
    await prisma.userProgress.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.lesson.deleteMany();

    // Lição 1: 👋 Hello World em Égua
    await prisma.lesson.create({
      data: {
        title: "👋 Hello World em Égua",
        description: "Dê seus primeiros passos na programação com a linguagem Égua!",
        content: `

Que tal começar com o famoso "Hello World"? É uma tradição que todo programador começa assim!

## O que vamos aprender? 📚

Em Égua, usamos o comando \`escreva()\` para mostrar mensagens na tela. É como se estivéssemos conversando com o computador!

### Veja como é simples:

\`\`\`egua
escreva("Olá, Mundo!");
\`\`\`


### Por que isso é importante?

Mostrar mensagens na tela é uma habilidade fundamental na programação. É como se você estivesse ensinando o computador a se comunicar com as pessoas!`,
        order: 1,
        exercises: {
          create: {
            title: "Seu primeiro programa",
            description: "Chegou sua vez! Escreva um programa que mostre a mensagem 'Olá, Mundo!' na tela.",
            expectedOutput: "Olá, Mundo!",
            expectedCode: `escreva("Olá, Mundo!");`
          }
        }
      }
    });

    // Lição 2: Comentários no Código
    await prisma.lesson.create({
      data: {
        title: "✏️ Comentários no Código",
        description: "Aprenda a documentar seu código de forma clara e organizada",
        content: `

Os comentários são como **notas explicativas** que deixamos no nosso código. Eles são super importantes para:
 ✍️ Explicar o que cada parte do código faz
 🤝 Ajudar outros programadores a entenderem seu código
 📌 Fazer anotações para você mesmo no futuro

## Como fazer comentários em Égua?

Em Égua, usamos o símbolo \`#\` para criar comentários. Tudo que vem depois deste símbolo é ignorado pelo computador!

### Exemplos práticos:

\`\`\`egua
# Este é um comentário simples
escreva("Olá!") # Aqui vamos mostrar uma saudação
\`\`\`
`
,

        order: 2,
        exercises: {
          create: {
            title: "📝 Praticando Comentários",
            description: "Crie um programa que mostre 'Bom dia!' e adicione comentários explicando cada parte do seu código.",
            expectedOutput: "Bom dia!",
            expectedCode: `# Este programa mostra uma mensagem de bom dia
escreva("Bom dia!") # Exibe a saudação na tela`
          }
        }
      }
    });

    // Lição 3:Usando Variáveis
    await prisma.lesson.create({
      data: {
        title: "📦 Usando Variáveis",
        description: "Aprenda a guardar e manipular informações no seu programa",
        content: `

Imagine que variáveis são como **caixinhas mágicas** onde podemos guardar informações para usar depois!

## Como criar uma variável? 🛠️

Em Égua, usamos a palavra \`var\` para criar nossas caixinhas mágicas:

\`\`\`egua
var nome = "Maria"
escreva(nome)  # Mostra: Maria
\`\`\`

A mágica acontece: podemos mudar o valor quando quisermos!
\`\`\`egua
nome = "João"
escreva(nome)  # Agora mostra: João
\`\`\`

Variáveis também guardam números

\`\`\`egua
var idade = 25
escreva(idade)  # Mostra: 25
\`\`\`


### 💡 Dicas importantes:

1. Escolha nomes que façam sentido para suas variáveis
2. Você pode mudar o valor de uma variável quantas vezes quiser
3. Cada variável é única, como uma caixinha com seu próprio nome
`,

        order: 3,
        exercises: {
          create: {
            title: "Criando sua primeira variável",
            description: "Crie uma variável com seu nome e use o comando escreva para mostrá-lo na tela.",
            expectedOutput: "Maria",
            expectedCode: `var nome = "Maria"
escreva(nome);`
          }
        }
      }
    });

    console.log("✅ Dados inseridos com sucesso!");
  } catch (error) {
    console.error("❌ Erro ao inserir dados:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main(); 