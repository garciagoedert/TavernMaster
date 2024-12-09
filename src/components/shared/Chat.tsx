import React, { useState, useEffect } from 'react';
import { Box, Paper, Typography, List, ListItem, TextField, IconButton, ListItemText } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { Socket } from 'socket.io-client';

interface ChatProps {
  socket: Socket;
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

const Chat: React.FC<ChatProps> = ({ socket, username, roomId, isMaster }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    if (socket) {
      // Entrar na sala quando o componente montar
      socket.emit('join', { username, roomId, isMaster });

      // Ouvir mensagens anteriores
      socket.on('previousMessages', (previousMessages: Message[]) => {
        setMessages(previousMessages);
      });

      // Ouvir novas mensagens
      socket.on('message', (message: Message) => {
        setMessages(prev => [...prev, message]);
      });

      // Limpar listeners quando o componente desmontar
      return () => {
        socket.off('previousMessages');
        socket.off('message');
      };
    }
  }, [socket, username, roomId, isMaster]);

  const sendMessage = () => {
    if (newMessage.trim() !== '' && socket) {
      socket.emit('sendMessage', {
        sender: username,
        content: newMessage,
        type: 'message'
      });
      setNewMessage('');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const formatMessage = (message: Message) => {
    switch (message.type) {
      case 'system':
        return <Typography color="text.secondary" variant="body2">{message.content}</Typography>;
      case 'roll':
        return (
          <Box>
            <Typography color="primary" component="span">{message.sender}: </Typography>
            <Typography component="span">{message.content}</Typography>
          </Box>
        );
      default:
        return (
          <Box>
            <Typography color="primary" component="span">{message.sender}: </Typography>
            <Typography component="span">{message.content}</Typography>
          </Box>
        );
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 2, m: 2, display: 'flex', flexDirection: 'column', height: '500px' }}>
      <Typography variant="h6" gutterBottom>
        Chat
      </Typography>
      
      <List sx={{ 
        flex: 1, 
        overflow: 'auto',
        bgcolor: 'background.paper',
        borderRadius: 1,
        mb: 2
      }}>
        {messages.map((message) => (
          <ListItem key={message.id}>
            <ListItemText
              primary={formatMessage(message)}
              secondary={new Date(message.timestamp).toLocaleTimeString()}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <TextField
          fullWidth
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Digite sua mensagem..."
          size="small"
          multiline
          maxRows={3}
        />
        <IconButton 
          onClick={sendMessage}
          color="primary"
          sx={{ alignSelf: 'flex-end' }}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default Chat;
