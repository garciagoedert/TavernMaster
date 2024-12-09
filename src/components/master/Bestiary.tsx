import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  LinearProgress
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import CreatureForm from './CreatureForm';

interface Creature {
  id: string;
  name: string;
  type: string;
  challengeRating: number;
  hp: {
    current: number;
    max: number;
  };
  armorClass: number;
  attributes: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  abilities: Array<{
    name: string;
    description: string;
  }>;
  description: string;
  imageUrl: string;
}

const initialCreatures: Creature[] = [
  {
    id: '1',
    name: 'Dragão Vermelho',
    type: 'Dragão',
    challengeRating: 17,
    hp: { current: 256, max: 256 },
    armorClass: 19,
    attributes: {
      strength: 27,
      dexterity: 10,
      constitution: 25,
      intelligence: 16,
      wisdom: 13,
      charisma: 21
    },
    abilities: [
      {
        name: 'Sopro de Fogo',
        description: 'Cone de 60 pés, 16d6 de dano de fogo, CD 21'
      },
      {
        name: 'Medo Dracônico',
        description: 'Todas as criaturas num raio de 120 pés devem fazer um teste de Sabedoria CD 19'
      }
    ],
    description: 'Um dragão vermelho adulto, uma das criaturas mais temidas dos reinos.',
    imageUrl: 'https://example.com/red-dragon.jpg'
  },
  {
    id: '2',
    name: 'Lich',
    type: 'Morto-vivo',
    challengeRating: 21,
    hp: { current: 135, max: 135 },
    armorClass: 17,
    attributes: {
      strength: 11,
      dexterity: 16,
      constitution: 16,
      intelligence: 20,
      wisdom: 14,
      charisma: 16
    },
    abilities: [
      {
        name: 'Resistência Lendária',
        description: '3 ações lendárias por rodada'
      },
      {
        name: 'Conjurador',
        description: 'Conjurador de magias de nível 18'
      }
    ],
    description: 'Um poderoso mago que buscou a imortalidade através de rituais profanos.',
    imageUrl: 'https://example.com/lich.jpg'
  },
  {
    id: '3',
    name: 'Beholder',
    type: 'Aberração',
    challengeRating: 13,
    hp: { current: 180, max: 180 },
    armorClass: 18,
    attributes: {
      strength: 10,
      dexterity: 14,
      constitution: 18,
      intelligence: 17,
      wisdom: 15,
      charisma: 17
    },
    abilities: [
      {
        name: 'Raios Oculares',
        description: '3 raios aleatórios por turno'
      },
      {
        name: 'Antimagia',
        description: 'Cone de antimagia do olho central'
      }
    ],
    description: 'Uma criatura flutuante com um olho central e dez tentáculos com olhos menores.',
    imageUrl: 'https://example.com/beholder.jpg'
  }
];

const Bestiary: React.FC = () => {
  const [creatures, setCreatures] = useState<Creature[]>(initialCreatures);
  const [selectedCreature, setSelectedCreature] = useState<Creature | undefined>(undefined);
  const [openDialog, setOpenDialog] = useState(false);
  const [isNewCreature, setIsNewCreature] = useState(false);

  const handleNewCreature = () => {
    setSelectedCreature(undefined);
    setIsNewCreature(true);
    setOpenDialog(true);
  };

  const handleEditCreature = (creature: Creature) => {
    setSelectedCreature(creature);
    setIsNewCreature(false);
    setOpenDialog(true);
  };

  const handleDeleteCreature = (creatureId: string) => {
    setCreatures(creatures.filter(c => c.id !== creatureId));
  };

  const handleSaveCreature = (updatedCreature: Creature) => {
    if (isNewCreature) {
      setCreatures([...creatures, { ...updatedCreature, id: Date.now().toString() }]);
    } else {
      setCreatures(creatures.map(c => 
        c.id === updatedCreature.id ? updatedCreature : c
      ));
    }
    setOpenDialog(false);
    setSelectedCreature(undefined);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedCreature(undefined);
    setIsNewCreature(false);
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Bestiário
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleNewCreature}
        >
          Nova Criatura
        </Button>
      </Box>

      <Grid container spacing={3}>
        {creatures.map((creature) => (
          <Grid item xs={12} sm={6} md={4} key={creature.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={creature.imageUrl}
                alt={creature.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {creature.name}
                </Typography>
                <Typography color="textSecondary" gutterBottom>
                  {creature.type} - ND {creature.challengeRating}
                </Typography>

                <Box sx={{ mt: 2 }}>
                  <Typography variant="body2" gutterBottom>
                    HP: {creature.hp.current}/{creature.hp.max}
                  </Typography>
                  <LinearProgress 
                    variant="determinate" 
                    value={(creature.hp.current / creature.hp.max) * 100}
                    color="error"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="body2">
                    CA: {creature.armorClass}
                  </Typography>
                </Box>

                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={1}>
                    {Object.entries(creature.attributes).map(([attr, value]) => (
                      <Grid item xs={4} key={attr}>
                        <Typography variant="caption" display="block">
                          {attr.charAt(0).toUpperCase() + attr.slice(1)}
                        </Typography>
                        <Typography variant="body2">
                          {value} ({Math.floor((value - 10) / 2)})
                        </Typography>
                      </Grid>
                    ))}
                  </Grid>
                </Box>

                <Box sx={{ mt: 2 }}>
                  {creature.abilities.map((ability, index) => (
                    <Typography key={index} variant="body2" gutterBottom>
                      <strong>{ability.name}:</strong> {ability.description}
                    </Typography>
                  ))}
                </Box>
              </CardContent>

              <CardActions>
                <IconButton 
                  size="small" 
                  onClick={() => handleEditCreature(creature)}
                  color="primary"
                >
                  <EditIcon />
                </IconButton>
                <IconButton 
                  size="small" 
                  onClick={() => handleDeleteCreature(creature.id)}
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
          {isNewCreature ? 'Nova Criatura' : 'Editar Criatura'}
        </DialogTitle>
        <DialogContent>
          <CreatureForm 
            creature={selectedCreature}
            onSave={handleSaveCreature}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Bestiary;
