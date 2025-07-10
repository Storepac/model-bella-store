const fs = require('fs');
const path = require('path');

function switchToRemote() {
  try {
    console.log('🔄 Alternando para configuração REMOTA...');
    
    // Ler configuração remota
    const remoteConfig = fs.readFileSync(path.join(__dirname, 'env.remote'), 'utf8');
    
    // Escrever como .env.local
    fs.writeFileSync(path.join(__dirname, '.env.local'), remoteConfig);
    
    console.log('✅ Configuração REMOTA ativada!');
    console.log('📋 URLs configuradas:');
    console.log('   Backend: https://backend-e5txym-30bc43-152-53-192-161.traefik.me');
    console.log('   API: https://backend-e5txym-30bc43-152-53-192-161.traefik.me/api');
    console.log('');
    console.log('🚀 Execute: npm run dev');
    console.log('🌐 Acesse: http://localhost:3000');
    
  } catch (error) {
    console.error('❌ Erro ao alternar para remoto:', error.message);
    process.exit(1);
  }
}

switchToRemote(); 