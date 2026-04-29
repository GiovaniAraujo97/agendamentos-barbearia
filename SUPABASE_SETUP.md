# Configuração do Supabase

## Tabelas Necessárias

Execute os seguintes comandos SQL no console do Supabase:

### Usuários
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR NOT NULL UNIQUE,
  name VARCHAR NOT NULL,
  role VARCHAR NOT NULL DEFAULT 'client',
  salon_id UUID REFERENCES salons(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Salões
```sql
CREATE TABLE salons (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  phone VARCHAR NOT NULL,
  slug VARCHAR NOT NULL UNIQUE,
  address VARCHAR,
  city VARCHAR,
  state VARCHAR,
  zip_code VARCHAR,
  logo VARCHAR,
  color VARCHAR,
  owner_id UUID REFERENCES users(id),
  operating_hours JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Serviços
```sql
CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  description TEXT,
  duration INT NOT NULL,
  price DECIMAL NOT NULL,
  salon_id UUID NOT NULL REFERENCES salons(id),
  category VARCHAR,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Profissionais
```sql
CREATE TABLE professionals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR NOT NULL,
  email VARCHAR NOT NULL,
  salon_id UUID NOT NULL REFERENCES salons(id),
  specialties UUID[] DEFAULT '{}',
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Agendamentos
```sql
CREATE TABLE appointments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  salon_id UUID NOT NULL REFERENCES salons(id),
  client_id UUID REFERENCES users(id),
  client_name VARCHAR NOT NULL,
  client_email VARCHAR NOT NULL,
  client_phone VARCHAR NOT NULL,
  service_id UUID NOT NULL REFERENCES services(id),
  professional_id UUID NOT NULL REFERENCES professionals(id),
  start_time TIMESTAMP NOT NULL,
  end_time TIMESTAMP NOT NULL,
  status VARCHAR DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_ANON_KEY=sua-chave-anonima
```

E atualize `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  supabaseUrl: import.meta.env['NG_APP_SUPABASE_URL'],
  supabaseAnonKey: import.meta.env['NG_APP_SUPABASE_ANON_KEY'],
  apiUrl: 'http://localhost:3000/api'
};
```

## RLS (Row Level Security)

Habilite RLS nas tabelas para segurança:

```sql
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE salons ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE professionals ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
```

### Policies

Crie policies básicas para garantir segurança dos dados:

```sql
-- Usuários podem ler seu próprio perfil
CREATE POLICY "Users can read own profile" ON users
  FOR SELECT USING (auth.uid() = id);

-- Salões podem ler seus serviços
CREATE POLICY "Salons can read their services" ON services
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM salons WHERE salons.id = services.salon_id AND salons.owner_id = auth.uid())
  );
```

## Próximas Etapas

1. Criar as tabelas no Supabase
2. Configurar RLS policies
3. Adicionar as credenciais ao `.env.local`
4. Testar autenticação e CRUD operations
