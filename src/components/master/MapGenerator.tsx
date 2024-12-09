import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress
} from '@mui/material';

interface ImageConfig {
  prompt: string;
  type: string;
}

const MapGenerator: React.FC = () => {
  const [config, setConfig] = useState<ImageConfig>({
    prompt: '',
    type: 'dungeon'
  });

  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generatePrompt = () => {
    const basePrompt = config.prompt;
    const sceneType = config.type;
    
    let enhancedPrompt = `${sceneType} scene: ${basePrompt}, fantasy style, detailed, atmospheric lighting`;
    
    switch (sceneType) {
      case 'dungeon':
        enhancedPrompt += ', stone walls, torches, dark atmosphere';
        break;
      case 'cave':
        enhancedPrompt += ', stalactites, natural rock formations, mysterious';
        break;
      case 'castle':
        enhancedPrompt += ', medieval architecture, grand halls, banners';
        break;
      case 'forest':
        enhancedPrompt += ', ancient trees, mystical atmosphere, natural light';
        break;
    }

    return enhancedPrompt;
  };

  const handleGenerate = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('http://localhost:3001/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: generatePrompt()
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao gerar imagem');
      }

      const data = await response.json();
      setImageUrl(data.imageUrl);
    } catch (err: any) {
      setError(err.message);
      console.error('Erro:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Gerador de Cenas
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição da Cena"
            multiline
            rows={4}
            value={config.prompt}
            onChange={(e) => setConfig({ ...config, prompt: e.target.value })}
            placeholder="Descreva a cena que você quer gerar..."
          />
        </Grid>

        <Grid item xs={12}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Cena</InputLabel>
            <Select
              value={config.type}
              label="Tipo de Cena"
              onChange={(e) => setConfig({ ...config, type: e.target.value })}
            >
              <MenuItem value="dungeon">Dungeon</MenuItem>
              <MenuItem value="cave">Caverna</MenuItem>
              <MenuItem value="castle">Castelo</MenuItem>
              <MenuItem value="forest">Floresta</MenuItem>
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={handleGenerate}
            disabled={loading || !config.prompt}
            size="large"
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Gerar Cena'}
          </Button>
        </Grid>

        {error && (
          <Grid item xs={12}>
            <Paper 
              elevation={0} 
              sx={{ 
                p: 2, 
                bgcolor: 'error.light',
                color: 'error.contrastText'
              }}
            >
              {error}
            </Paper>
          </Grid>
        )}

        {imageUrl && (
          <Grid item xs={12}>
            <Box
              sx={{
                mt: 2,
                display: 'flex',
                justifyContent: 'center',
                width: '100%',
                overflow: 'hidden',
                borderRadius: 1,
                boxShadow: 3
              }}
            >
              <img
                src={imageUrl}
                alt="Cena Gerada"
                style={{
                  maxWidth: '100%',
                  height: 'auto',
                  display: 'block'
                }}
              />
            </Box>
          </Grid>
        )}
      </Grid>
    </Paper>
  );
};

export default MapGenerator;
