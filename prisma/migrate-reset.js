import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import { fileURLToPath } from 'url';

// Obtenha o diretório atual
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Caminho para o diretório de migrações
const migrationsDir = path.join(__dirname, 'migrations');

// Função para remover diretório recursivamente
function removeDir(dirPath) {
  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(file => {
      const curPath = path.join(dirPath, file);
      if (fs.lstatSync(curPath).isDirectory()) {
        removeDir(curPath);
      } else {
        fs.unlinkSync(curPath);
      }
    });
    fs.rmdirSync(dirPath);
    console.log(`Diretório removido: ${dirPath}`);
  }
}

// Remover diretório de migrações
console.log('Removendo diretório de migrações...');
removeDir(migrationsDir);
console.log('Diretório de migrações removido com sucesso!');

console.log('Agora execute "npx prisma migrate dev --name init" para criar uma nova migração inicial'); 