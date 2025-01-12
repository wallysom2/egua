import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    // Limpar dados existentes
    await prisma.userProgress.deleteMany();
    await prisma.exercise.deleteMany();
    await prisma.lesson.deleteMany();

    // Lição 1: Hello World
    await prisma.lesson.create({
      data: {
        title: "Hello World em Égua",
        description: "Aprenda a escrever seu primeiro programa em Égua!",
        content: `Bem-vindo à sua primeira lição de programação em Égua!

Nesta lição, você aprenderá a escrever seu primeiro programa: o famoso "Hello World".

Em Égua, para exibir texto na tela, usamos o comando 'escreva'.
Por exemplo:

escreva("Olá, Mundo!")

É simples assim! O texto que queremos mostrar fica entre aspas.`,
        order: 1,
        exercises: {
          create: {
            title: "Seu primeiro programa",
            description: "Escreva um programa que mostre a mensagem 'Olá, Mundo!' na tela.",
            expectedOutput: "Olá, Mundo!",
            expectedCode: `escreva("Olá, Mundo!");`
          }
        }
      }
    });

    // Lição 2: Comentários
    await prisma.lesson.create({
      data: {
        title: "Comentários no Código",
        description: "Aprenda a adicionar comentários para explicar seu código",
        content: `Os comentários são muito úteis para explicar o que seu código faz.
Em Égua, usamos # para fazer comentários.

Por exemplo:
# Este é um comentário
escreva("Olá!") # Este comentário explica que vamos cumprimentar

Tudo que vem depois do # é ignorado pelo computador.`,
        order: 2,
        exercises: {
          create: {
            title: "Adicionando comentários",
            description: "Escreva um programa que mostre 'Bom dia!' e adicione um comentário explicando o que o programa faz.",
            expectedOutput: "Bom dia!",
            expectedCode: `// Este programa mostra uma mensagem de bom dia
escreva("Bom dia!") // Exibe a saudação`
          }
        }
      }
    });

    // Lição 3: Variáveis
    await prisma.lesson.create({
      data: {
        title: "Usando Variáveis",
        description: "Aprenda a guardar informações em variáveis",
        content: `Variáveis são como caixas onde podemos guardar informações.
Em Égua, criamos variáveis assim:

var nome = "Maria"
escreva(nome)

Você pode mudar o valor de uma variável quando quiser:
nome = "João"
escreva(nome)`,
        order: 3,
        exercises: {
          create: {
            title: "Seu nome em uma variável",
            description: "Crie uma variável com seu nome e use escreva para mostrá-lo na tela.",
            expectedOutput: "Maria",
            expectedCode: `var nome = "Maria" // Guarda o nome em uma variável
escreva(nome) // Mostra o nome na tela`
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