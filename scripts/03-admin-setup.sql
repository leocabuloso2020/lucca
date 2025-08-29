-- Criar tabela para configurações do evento
CREATE TABLE IF NOT EXISTS event_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(100) UNIQUE NOT NULL,
  setting_value TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Inserir configurações padrão
INSERT INTO event_settings (setting_key, setting_value) VALUES
('event_address', 'Rua das Flores, 123 - Jardim Primavera, São Paulo - SP'),
('event_date', '2024-03-15'),
('event_time', '14:00'),
('admin_password', 'lucca2024'),
('event_title', 'Chá de Bebê do Lucca')
ON CONFLICT (setting_key) DO NOTHING;

-- Adicionar coluna approved nas mensagens para moderação
ALTER TABLE messages ADD COLUMN IF NOT EXISTS approved BOOLEAN DEFAULT true;

-- Políticas RLS para configurações (apenas leitura pública)
ALTER TABLE event_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access to event_settings" ON event_settings
  FOR SELECT USING (true);

CREATE POLICY "Allow admin update access to event_settings" ON event_settings
  FOR UPDATE USING (true);
