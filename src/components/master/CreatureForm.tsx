import React, { useState } from 'react';
import {
  Box,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Typography
} from '@mui/material';

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

interface CreatureFormProps {
  creature?: Creature;
  onSave: (creature: Creature) => void;
}

const creatureTypes = [
  'Aberração',
  'Besta',
  'Celestial',
  'Constructo',
  'Dragão',
  'Elemental',
  'Fada',
  'Fera',
  'Gigante',
  'Humanóide',
  'Monstruosidade',
  'Morto-vivo',
  'Planta'
];

const CreatureForm: React.FC<CreatureFormProps> = ({ creature: initialCreature, onSave }) => {
  const [creature, setCreature] = useState<Creature>({
    id: initialCreature?.id || Date.now().toString(),
    name: initialCreature?.name || '',
    type: initialCreature?.type || creatureTypes[0],
    challengeRating: initialCreature?.challengeRating || 1,
    hp: initialCreature?.hp || { current: 10, max: 10 },
    armorClass: initialCreature?.armorClass || 10,
    attributes: initialCreature?.attributes || {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    abilities: initialCreature?.abilities || [],
    description: initialCreature?.description || '',
    imageUrl: initialCreature?.imageUrl || ''
  });

  const [newAbility, setNewAbility] = useState({ name: '', description: '' });

  const handleAttributeChange = (attr: keyof typeof creature.attributes, value: number) => {
    setCreature(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attr]: value
      }
    }));
  };

  const handleAddAbility = () => {
    if (newAbility.name && newAbility.description) {
      setCreature(prev => ({
        ...prev,
        abilities: [...prev.abilities, { ...newAbility }]
      }));
      setNewAbility({ name: '', description: '' });
    }
  };

  const handleRemoveAbility = (index: number) => {
    setCreature(prev => ({
      ...prev,
      abilities: prev.abilities.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = () => {
    onSave(creature);
  };

  return (
    <Box component="form" sx={{ mt: 2 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            label="Nome"
            value={creature.name}
            onChange={(e) => setCreature({ ...creature, name: e.target.value })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Tipo</InputLabel>
            <Select
              value={creature.type}
              label="Tipo"
              onChange={(e) => setCreature({ ...creature, type: e.target.value })}
            >
              {creatureTypes.map(type => (
                <MenuItem key={type} value={type}>{type}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Nível de Desafio"
            value={creature.challengeRating}
            onChange={(e) => setCreature({ ...creature, challengeRating: Number(e.target.value) })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="Classe de Armadura"
            value={creature.armorClass}
            onChange={(e) => setCreature({ ...creature, armorClass: Number(e.target.value) })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="HP Atual"
            value={creature.hp.current}
            onChange={(e) => setCreature({ 
              ...creature, 
              hp: { ...creature.hp, current: Number(e.target.value) }
            })}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <TextField
            fullWidth
            type="number"
            label="HP Máximo"
            value={creature.hp.max}
            onChange={(e) => setCreature({ 
              ...creature, 
              hp: { ...creature.hp, max: Number(e.target.value) }
            })}
          />
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Atributos
          </Typography>
          <Grid container spacing={2}>
            {Object.entries(creature.attributes).map(([attr, value]) => (
              <Grid item xs={6} sm={4} key={attr}>
                <TextField
                  fullWidth
                  type="number"
                  label={attr.charAt(0).toUpperCase() + attr.slice(1)}
                  value={value}
                  onChange={(e) => handleAttributeChange(attr as keyof typeof creature.attributes, Number(e.target.value))}
                />
              </Grid>
            ))}
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Habilidades
          </Typography>
          {creature.abilities.map((ability, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={5}>
                  <Typography>{ability.name}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography>{ability.description}</Typography>
                </Grid>
                <Grid item xs={1}>
                  <Button 
                    color="error" 
                    onClick={() => handleRemoveAbility(index)}
                  >
                    X
                  </Button>
                </Grid>
              </Grid>
            </Box>
          ))}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Nome da Habilidade"
                value={newAbility.name}
                onChange={(e) => setNewAbility({ ...newAbility, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <TextField
                fullWidth
                label="Descrição"
                value={newAbility.description}
                onChange={(e) => setNewAbility({ ...newAbility, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} sm={2}>
              <Button
                variant="contained"
                onClick={handleAddAbility}
                fullWidth
              >
                Adicionar
              </Button>
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="URL da Imagem"
            value={creature.imageUrl}
            onChange={(e) => setCreature({ ...creature, imageUrl: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Descrição"
            value={creature.description}
            onChange={(e) => setCreature({ ...creature, description: e.target.value })}
          />
        </Grid>

        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            fullWidth
          >
            Salvar
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CreatureForm;
