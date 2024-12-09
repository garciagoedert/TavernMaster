# RPG Manager

Um aplicativo web para gerenciamento de partidas de RPG online, com áreas específicas para mestres e jogadores.

## Funcionalidades

### Área do Mestre
- Criador/editor de ficha de personagens
- Gerenciamento de monstros e NPCs
- Gerenciamento de tesouros e itens
- Gerenciamento de quests e aventuras
- Gerador de mapas

### Área dos Jogadores
- Mesa para rolar dados com histórico
- Visualização de fichas de personagens
- Chat em tempo real
- Sistema de inventário

## Tecnologias Utilizadas

- Frontend: React com TypeScript
- Backend: Node.js com Express e Socket.IO
- UI: Material-UI (MUI)

## Pré-requisitos

- Node.js (versão 14 ou superior)
- npm (gerenciador de pacotes do Node.js)

## Como Executar

1. Clone o repositório:
```bash
git clone [url-do-repositorio]
cd rpg-manager
```

2. Instale as dependências:
```bash
npm install
```

3. Inicie o projeto em modo desenvolvimento:
```bash
npm run dev
```

Isso iniciará:
- O servidor backend na porta 3001
- O cliente frontend na porta 3002

## Estrutura do Projeto

```
rpg-manager/
├── server/                 # Código do servidor
│   ├── index.ts           # Configuração do servidor Express e Socket.IO
│   └── tsconfig.json      # Configuração do TypeScript para o servidor
├── src/
│   ├── components/        # Componentes React
│   │   ├── master/       # Componentes da área do mestre
│   │   ├── player/       # Componentes da área do jogador
│   │   └── shared/       # Componentes compartilhados
│   ├── App.tsx           # Componente principal
│   └── index.tsx         # Ponto de entrada do React
└── package.json          # Dependências e scripts
```

## Componentes Principais

### CharacterSheet
- Gerenciamento completo de fichas de personagens
- Sistema de atributos e habilidades
- Integração com o sistema de inventário

### DiceRoller
- Suporte para diferentes tipos de dados (d4, d6, d8, d10, d12, d20, d100)
- Histórico de rolagens
- Modificadores de atributos
- Integração com o chat

### MapGenerator
- Geração de mapas procedurais
- Diferentes tipos de terreno
- Customização de tamanho e complexidade

### Chat
- Comunicação em tempo real
- Suporte para salas
- Integração com o sistema de dados
- Mensagens do sistema

### Inventory
- Sistema de gerenciamento de itens
- Peso e valor dos itens
- Compartilhamento entre mestre e jogadores
# TavernMaster
