import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  LinearProgress,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CharacterSheet from './CharacterSheet';

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  experience: number;
  hp: {
    current: number;
    max: number;
  };
  mp: {
    current: number;
    max: number;
  };
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  skills: Array<{
    name: string;
    level: number;
    description: string;
  }>;
  background: string;
}

const PartyManager: React.FC = () => {
  const [characters, setCharacters] = useState<Character[]>([
    {
      id: '1',
      name: 'Aragorn',
      class: 'Guerreiro',
      race: 'Humano',
      level: 5,
      experience: 2500,
      hp: { current: 45, max: 50 },
      mp: { current: 20, max: 20 },
      attributes: {
        strength: 16,
        dexterity: 14,
        constitution: 15,
        intelligence: 12,
        wisdom: 13,
        charisma: 14
      },
      skills: [
        {
          name: 'Golpe Poderoso',
          level: 3,
          description: 'Um ataque devastador que causa dano extra'
        }
      ],
      background: 'Um nobre guerreiro do norte, herdeiro do trono de Gondor.'
    },
    {
      id: '2',
      name: 'Gandalf',
      class: 'Mago',
      race: 'Humano',
      level: 8,
      experience: 5000,
      hp: { current: 30, max: 35 },
      mp: { current: 80, max: 80 },
      attributes: {
        strength: 10,
        dexterity: 12,
        constitution: 13,
        intelligence: 18,
        wisdom: 16,
        charisma: 15
      },
      skills: [
        {
          name: 'Bola de Fogo',
          level: 5,
          description: 'Uma explosão mágica de chamas'
        }
      ],
      background: 'Um poderoso mago que vaga pela Terra-média.'
    }
  ]);

  const [selectedCharacter, setSelectedCharacter] = useState<Character | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewCharacter, setIsNewCharacter] = useState(false);

  const handleEditCharacter = (character: Character) => {
    setSelectedCharacter(character);
    setIsNewCharacter(false);
    setOpenDialog(true);
  };

  const handleNewCharacter = () => {
    setSelectedCharacter(undefined);
    setIsNewCharacter(true);
    setOpenDialog(true);
  };

  const handleDeleteCharacter = (characterId: string) => {
    setCharacters(characters.filter(char => char.id !== characterId));
  };

  const handleSaveCharacter = (updatedCharacter: Character) => {
    if (isNewCharacter) {
      setCharacters([...characters, { ...updatedCharacter, id: Date.now().toString() }]);
    } else {
      setCharacters(characters.map(char => 
        char.id === updatedCharacter.id ? updatedCharacter : char
      ));
    }
    setOpenDialog(false);
    setSelectedCharacter(undefined);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCharacter(undefined);
    setIsNewCharacter(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Gerenciamento do Grupo
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCharacter}
        >
          Novo Personagem
        </Button>
      </Box>

      <Grid container spacing={3}>
        {characters.map((character) => (
          <Grid item xs={12} sm={6} md={4} key={character.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {character.name}
                </Typography>
                <Typography color="textSecondary">
                  {character.race} - {character.class} (Nível {character.level})
                </Typography>
                
                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    HP: {character.hp.current}/{character.hp.max}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(character.hp.current / character.hp.max) * 100}
                    color="error"
                    sx={{ mb: 1 }}
                  />
                  
                  <Typography variant="body2" gutterBottom>
                    MP: {character.mp.current}/{character.mp.max}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(character.mp.current / character.mp.max) * 100}
                    color="primary"
                  />
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {Object.entries(character.attributes).map(([attr, value]) => (
                      <Grid item xs={4} key={attr}>
                        <Typography variant="caption" display="block">
                          {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </Typography>
                        <Typography variant="body2">
                          {value}
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="caption" display="block">
                    Experiência: {character.experience}
                  </Typography>
                  {character.skills.length > 0 && (
                    <Typography variant="caption" display="block">
                      Habilidades: {character.skills.map(skill => skill.name).join(', ')}
                    </Typography>
                  )}
                </Box>
              </CardContent>

              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditCharacter(character)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteCharacter(character.id)}
                  color="error"
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          {isNewCharacter ? 'Novo Personagem' : 'Editar Personagem'}
        </DialogTitle>
        <DialogContent>
          <CharacterSheet 
            character={selectedCharacter}
            onSave={handleSaveCharacter}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>
            Cancelar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PartyManager;
