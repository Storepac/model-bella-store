const fs = require('fs');
const path = require('path');

function switchToLocal() {
  try {
    console.log('🔄 Alternando para configuração LOCAL...');
    
    // Ler configuração local
    const localConfig = fs.readFileSync(path.join(__dirname, 'env.local'), 'utf8');
    
    // Escrever como .env.local
    fs.writeFileSync(path.join(__dirname, '.env.local'), localConfig);
    
    console.log('✅ Configuração LOCAL ativada!');
    console.log('📋 URLs configuradas:');
    console.log('   Backend: http://localhost:3001');
    console.log('   API: http://localhost:3001/api');
    console.log('');
    console.log('🚀 Execute: npm run dev');
    console.log('🌐 Acesse: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Erro ao alternar para local:', error.message);
    process.exit(1);
  }
}

switchToLocal(); 