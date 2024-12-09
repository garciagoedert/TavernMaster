import 'dotenv/config';
import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';
import multer from 'multer';
import path from 'path';

if (!process.env.GOOGLE_API_KEY) {
  console.error('GOOGLE_API_KEY não encontrada no arquivo .env');
  process.exit(1);
}

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ["http://localhost:3002", "http://localhost:3003", "http://localhost:3004"],
    methods: ["GET", "POST"]
  }
});

// Configuração do Multer para upload de imagens
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'server/uploads/characters');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Tipo de arquivo inválido. Apenas JPEG, PNG e GIF são permitidos.'));
    }
  }
});

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('server/uploads'));

interface User {
  id: string;
  username: string;
  roomId: string;
  isMaster: boolean;
}

interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: Date;
  type: 'message' | 'roll' | 'system';
}

const users = new Map<string, User>();
const rooms = new Map<string, Message[]>();

// Endpoint para upload de imagem do personagem
app.post('/api/upload/character-image', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Nenhuma imagem foi enviada' });
    }

    const imageUrl = `/uploads/characters/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error: any) {
    console.error('Erro no upload de imagem:', error);
    res.status(500).json({ error: error.message });
  }
});

// Endpoint para geração de imagem usando Gemini
app.post('/api/generate-image', async (req, res) => {
  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt é obrigatório' });
    }

    console.log('Gerando imagem com prompt:', prompt);

    const model = genAI.getGenerativeModel({ model: "gemini-pro-vision" });
    
    const result = await model.generateContent([
      "Create a high-quality, detailed image for a RPG scene with the following description:",
      prompt,
      "The image should be realistic, with atmospheric lighting and rich details suitable for a fantasy RPG setting."
    ]);

    const response = await result.response;
    const imageData = response.text();
    
    console.log('Imagem gerada com sucesso');
    res.json({ imageUrl: imageData });
  } catch (error: any) {
    console.error('Erro ao gerar imagem:', error);
    res.status(500).json({ error: error.message });
  }
});

io.on('connection', (socket) => {
  console.log('Novo usuário conectado:', socket.id);

  socket.on('join', ({ username, roomId, isMaster }) => {
    // Registrar usuário
    users.set(socket.id, {
      id: socket.id,
      username,
      roomId,
      isMaster
    });

    // Entrar na sala
    socket.join(roomId);

    // Inicializar sala se não existir
    if (!rooms.has(roomId)) {
      rooms.set(roomId, []);
    }

    // Enviar mensagens anteriores
    const previousMessages = rooms.get(roomId) || [];
    socket.emit('previousMessages', previousMessages);

    // Enviar mensagem de sistema sobre novo usuário
    const systemMessage: Message = {
      id: Date.now().toString(),
      sender: 'Sistema',
      content: `${username} entrou na sala`,
      timestamp: new Date(),
      type: 'system'
    };

    io.to(roomId).emit('message', systemMessage);
    rooms.get(roomId)?.push(systemMessage);
  });

  // Lidar com novas mensagens
  socket.on('sendMessage', (message: Partial<Message>) => {
    const user = users.get(socket.id);
    if (!user) return;

    const fullMessage: Message = {
      id: Date.now().toString(),
      sender: message.sender || user.username,
      content: message.content || '',
      timestamp: new Date(),
      type: message.type || 'message'
    };

    io.to(user.roomId).emit('message', fullMessage);
    rooms.get(user.roomId)?.push(fullMessage);
  });

  // Lidar com rolagens de dados
  socket.on('diceRoll', (data: { roll: any, type: string }) => {
    const user = users.get(socket.id);
    if (!user) return;

    const rollMessage: Message = {
      id: Date.now().toString(),
      sender: user.username,
      content: `Rolou ${data.roll.results.length}d${data.roll.type}: ${data.roll.results.join(', ')} ${data.roll.modifier !== 0 ? `(${data.roll.modifier > 0 ? '+' : ''}${data.roll.modifier})` : ''} = ${data.roll.total}${data.roll.description ? ` (${data.roll.description})` : ''}`,
      timestamp: new Date(),
      type: 'roll'
    };

    io.to(user.roomId).emit('message', rollMessage);
    rooms.get(user.roomId)?.push(rollMessage);
  });

  // Lidar com desconexão
  socket.on('disconnect', () => {
    const user = users.get(socket.id);
    if (user) {
      const systemMessage: Message = {
        id: Date.now().toString(),
        sender: 'Sistema',
        content: `${user.username} saiu da sala`,
        timestamp: new Date(),
        type: 'system'
      };

      io.to(user.roomId).emit('message', systemMessage);
      rooms.get(user.roomId)?.push(systemMessage);
      users.delete(socket.id);
    }
  });
});

const PORT = process.env.PORT || 3001;

httpServer.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
