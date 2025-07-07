-- Adicionar coluna slug na tabela products
ALTER TABLE products ADD COLUMN slug VARCHAR(255) NULL AFTER name;

-- Criar índice único para slug + storeId para melhor performance
CREATE UNIQUE INDEX idx_products_slug_store ON products(slug, storeId);

-- Verificar estrutura da tabela
DESCRIBE products; 