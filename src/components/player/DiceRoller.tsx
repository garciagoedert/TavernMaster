import React, { useState } from 'react';
import {
  Box,
  Button,
  Paper,
  Typography,
  Grid,
  List,
  ListItem,
  ListItemText,
  TextField,
  IconButton,
  Tooltip,
  Chip,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import CasinoIcon from '@mui/icons-material/Casino';
import { Socket } from 'socket.io-client';

interface DiceRoll {
  id: string;
  type: number;
  results: number[];
  modifier: number;
  total: number;
  timestamp: Date;
  description?: string;
}

interface DiceRollerProps {
  socket?: Socket;
  characterAttributes?: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
}

const DiceRoller: React.FC<DiceRollerProps> = ({ socket, characterAttributes }) => {
  const [rollHistory, setRollHistory] = useState<DiceRoll[]>([]);
  const [selectedDice, setSelectedDice] = useState<number>(20);
  const [numberOfDice, setNumberOfDice] = useState<number>(1);
  const [modifier, setModifier] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [selectedAttribute, setSelectedAttribute] = useState<string>('');

  const diceTypes = [4, 6, 8, 10, 12, 20, 100];

  const calculateModifier = (attributeValue: number) => {
    return Math.floor((attributeValue - 10) / 2);
  };

  const rollDice = () => {
    const results: number[] = [];
    for (let i = 0; i < numberOfDice; i++) {
      results.push(Math.floor(Math.random() * selectedDice) + 1);
    }

    let totalModifier = modifier;
    if (selectedAttribute && characterAttributes) {
      const attrValue = characterAttributes[selectedAttribute as keyof typeof characterAttributes];
      totalModifier += calculateModifier(attrValue);
    }

    const total = results.reduce((sum, result) => sum + result, 0) + totalModifier;

    const newRoll: DiceRoll = {
      id: Date.now().toString(),
      type: selectedDice,
      results,
      modifier: totalModifier,
      total,
      timestamp: new Date(),
      description: description || undefined
    };

    setRollHistory([newRoll, ...rollHistory]);

    if (socket) {
      socket.emit('diceRoll', {
        roll: newRoll,
        type: 'roll'
      });
    }

    // Limpar descrição após o rolamento
    setDescription('');
  };

  const clearHistory = () => {
    setRollHistory([]);
  };

  const formatRollResult = (roll: DiceRoll) => {
    const diceNotation = `${roll.results.length}d${roll.type}`;
    const resultsList = roll.results.join(' + ');
    const modifierStr = roll.modifier !== 0 ? (roll.modifier > 0 ? ` + ${roll.modifier}` : ` - ${Math.abs(roll.modifier)}`) : '';
    
    return `${diceNotation} (${resultsList})${modifierStr} = ${roll.total}`;
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Rolador de Dados
      </Typography>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <FormControl fullWidth>
            <InputLabel>Tipo de Dado</InputLabel>
            <Select
              value={selectedDice}
              label="Tipo de Dado"
              onChange={(e) => setSelectedDice(Number(e.target.value))}
            >
              {diceTypes.map((dice) => (
                <MenuItem key={dice} value={dice}>
                  d{dice}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Quantidade"
            value={numberOfDice}
            onChange={(e) => setNumberOfDice(Math.max(1, Number(e.target.value)))}
            inputProps={{ min: 1, max: 20 }}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <TextField
            fullWidth
            type="number"
            label="Modificador"
            value={modifier}
            onChange={(e) => setModifier(Number(e.target.value))}
          />
        </Grid>

        {characterAttributes && (
          <Grid item xs={12} sm={6} md={3}>
            <FormControl fullWidth>
              <InputLabel>Atributo</InputLabel>
              <Select
                value={selectedAttribute}
                label="Atributo"
                onChange={(e) => setSelectedAttribute(e.target.value)}
              >
                <MenuItem value="">Nenhum</MenuItem>
                {Object.entries(characterAttributes).map(([attr, value]) => (
                  <MenuItem key={attr} value={attr}>
                    {attr.charAt(0).toUpperCase() + attr.slice(1)} ({calculateModifier(value)})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        )}

        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Descrição do Rolamento"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Ex: Ataque com espada longa"
          />
        </Grid>

        <Grid item xs={12}>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={rollDice}
              startIcon={<CasinoIcon />}
              fullWidth
            >
              Rolar Dados
            </Button>
            <Button
              variant="outlined"
              color="error"
              onClick={clearHistory}
              startIcon={<DeleteIcon />}
            >
              Limpar Histórico
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Divider sx={{ my: 2 }} />

      <Typography variant="h6" gutterBottom>
        Histórico de Rolagens
      </Typography>

      <List>
        {rollHistory.map((roll) => (
          <ListItem
            key={roll.id}
            secondaryAction={
              <Tooltip title="Remover">
                <IconButton
                  edge="end"
                  onClick={() => setRollHistory(rollHistory.filter(r => r.id !== roll.id))}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            }
          >
            <ListItemText
              primary={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body1">
                    {formatRollResult(roll)}
                  </Typography>
                  {roll.description && (
                    <Chip
                      label={roll.description}
                      size="small"
                      color="primary"
                      variant="outlined"
                    />
                  )}
                </Box>
              }
              secondary={new Date(roll.timestamp).toLocaleTimeString()}
            />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
};

export default DiceRoller;
