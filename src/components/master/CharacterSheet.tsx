import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Paper,
  Typography,
  Grid,
  Button,
  Tabs,
  Tab,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  Snackbar,
  Alert,
  Avatar,
  Input
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import Inventory from '../shared/Inventory';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface Character {
  id: string;
  name: string;
  class: string;
  race: string;
  level: number;
  experience: number;
  imageUrl?: string;
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

interface CharacterSheetProps {
  character?: Character;
  onSave?: (character: Character) => void;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`character-tabpanel-${index}`}
      aria-labelledby={`character-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const CharacterSheet: React.FC<CharacterSheetProps> = ({ character: initialCharacter, onSave }) => {
  const [tabValue, setTabValue] = useState(0);
  const [character, setCharacter] = useState<Character>(initialCharacter || {
    id: Date.now().toString(),
    name: '',
    class: '',
    race: '',
    level: 1,
    experience: 0,
    hp: { current: 10, max: 10 },
    mp: { current: 10, max: 10 },
    attributes: {
      strength: 10,
      dexterity: 10,
      constitution: 10,
      intelligence: 10,
      wisdom: 10,
      charisma: 10
    },
    skills: [],
    background: ''
  });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error'
  });
  const [image, setImage] = useState<File | null>(null);

  useEffect(() => {
    if (initialCharacter) {
      setCharacter(initialCharacter);
    }
  }, [initialCharacter]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAttributeChange = (attribute: keyof typeof character.attributes, value: number) => {
    setCharacter(prev => ({
      ...prev,
      attributes: {
        ...prev.attributes,
        [attribute]: value
      }
    }));
  };

  const handleAddSkill = () => {
    setCharacter(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', level: 1, description: '' }]
    }));
  };

  const handleSkillChange = (index: number, field: keyof typeof character.skills[0], value: string | number) => {
    const newSkills = [...character.skills];
    newSkills[index] = { ...newSkills[index], [field]: value };
    setCharacter(prev => ({ ...prev, skills: newSkills }));
  };

  const handleRemoveSkill = (index: number) => {
    setCharacter(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImage(file);
  };

  const handleImageSubmit = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append('image', image);

    try {
      const response = await fetch('http://localhost:3001/api/upload/character-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Erro ao fazer upload da imagem');
      }

      const data = await response.json();
      setCharacter(prev => ({
        ...prev,
        imageUrl: `http://localhost:3001${data.imageUrl}`
      }));

      setSnackbar({
        open: true,
        message: 'Imagem enviada com sucesso!',
        severity: 'success'
      });
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: `Erro ao enviar imagem: ${error.message}`,
        severity: 'error'
      });
    }
  };

  const handleSave = () => {
    if (onSave) {
      onSave(character);
    }
    setSnackbar({
      open: true,
      message: 'Personagem salvo com sucesso!',
      severity: 'success'
    });
  };

  const classes = ['Guerreiro', 'Mago', 'Clérigo', 'Ladino', 'Ranger', 'Paladino'];
  const races = ['Humano', 'Elfo', 'Anão', 'Halfling', 'Meio-Orc', 'Gnomo'];

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">
          Ficha de Personagem
        </Typography>
        <Button
          variant="contained"
          startIcon={<SaveIcon />}
          onClick={handleSave}
        >
          Salvar
        </Button>
      </Box>

      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange}>
          <Tab label="Informações Básicas" />
          <Tab label="Atributos & Habilidades" />
          <Tab label="Inventário" />
          <Tab label="História" />
        </Tabs>
      </Box>

      <TabPanel value={tabValue} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} display="flex" justifyContent="center" alignItems="center">
            <Box sx={{ position: 'relative' }}>
              <Avatar
                src={character.imageUrl}
                sx={{ width: 150, height: 150, mb: 2 }}
              />
              <label htmlFor="character-image-upload">
                <Input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="character-image-upload"
                  type="file"
                  onChange={handleImageUpload}
                />
                <IconButton
                  component="span"
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: -20,
                    backgroundColor: 'primary.main',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'primary.dark',
                    }
                  }}
                >
                  <AddPhotoAlternateIcon />
                </IconButton>
              </label>
              <Button onClick={handleImageSubmit}>Enviar Imagem</Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Nome do Personagem"
              value={character.name}
              onChange={(e) => setCharacter(prev => ({ ...prev, name: e.target.value }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Classe</InputLabel>
              <Select
                value={character.class}
                label="Classe"
                onChange={(e) => setCharacter(prev => ({ ...prev, class: e.target.value }))}
              >
                {classes.map(c => (
                  <MenuItem key={c} value={c}>{c}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Raça</InputLabel>
              <Select
                value={character.race}
                label="Raça"
                onChange={(e) => setCharacter(prev => ({ ...prev, race: e.target.value }))}
              >
                {races.map(r => (
                  <MenuItem key={r} value={r}>{r}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Nível"
              value={character.level}
              onChange={(e) => setCharacter(prev => ({ ...prev, level: Number(e.target.value) }))}
              inputProps={{ min: 1 }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="HP Atual"
              value={character.hp.current}
              onChange={(e) => setCharacter(prev => ({ 
                ...prev, 
                hp: { ...prev.hp, current: Number(e.target.value) }
              }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="HP Máximo"
              value={character.hp.max}
              onChange={(e) => setCharacter(prev => ({ 
                ...prev, 
                hp: { ...prev.hp, max: Number(e.target.value) }
              }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="MP Atual"
              value={character.mp.current}
              onChange={(e) => setCharacter(prev => ({ 
                ...prev, 
                mp: { ...prev.mp, current: Number(e.target.value) }
              }))}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="MP Máximo"
              value={character.mp.max}
              onChange={(e) => setCharacter(prev => ({ 
                ...prev, 
                mp: { ...prev.mp, max: Number(e.target.value) }
              }))}
            />
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={1}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <Typography variant="h6" gutterBottom>
              Atributos
            </Typography>
          </Grid>
          {Object.entries(character.attributes).map(([attr, value]) => (
            <Grid item xs={12} sm={4} key={attr}>
              <TextField
                fullWidth
                label={attr.charAt(0).toUpperCase() + attr.slice(1)}
                type="number"
                value={value}
                onChange={(e) => handleAttributeChange(attr as keyof typeof character.attributes, Number(e.target.value))}
                inputProps={{ min: 1 }}
              />
            </Grid>
          ))}

          <Grid item xs={12}>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Habilidades
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={handleAddSkill}
                variant="outlined"
              >
                Adicionar Habilidade
              </Button>
            </Box>
          </Grid>

          {character.skills.map((skill, index) => (
            <Grid item xs={12} key={index} container spacing={2}>
              <Grid item xs={12} sm={4}>
                <TextField
                  fullWidth
                  label="Nome da Habilidade"
                  value={skill.name}
                  onChange={(e) => handleSkillChange(index, 'name', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={2}>
                <TextField
                  fullWidth
                  type="number"
                  label="Nível"
                  value={skill.level}
                  onChange={(e) => handleSkillChange(index, 'level', Number(e.target.value))}
                  inputProps={{ min: 1 }}
                />
              </Grid>
              <Grid item xs={12} sm={5}>
                <TextField
                  fullWidth
                  label="Descrição"
                  value={skill.description}
                  onChange={(e) => handleSkillChange(index, 'description', e.target.value)}
                />
              </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton onClick={() => handleRemoveSkill(index)} color="error">
                  <DeleteIcon />
                </IconButton>
              </Grid>
            </Grid>
          ))}
        </Grid>
      </TabPanel>

      <TabPanel value={tabValue} index={2}>
        <Inventory characterId={character.id} />
      </TabPanel>

      <TabPanel value={tabValue} index={3}>
        <TextField
          fullWidth
          multiline
          rows={10}
          label="História do Personagem"
          value={character.background}
          onChange={(e) => setCharacter(prev => ({ ...prev, background: e.target.value }))}
        />
      </TabPanel>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <Alert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default CharacterSheet;
