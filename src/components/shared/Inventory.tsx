import React, { useState } from 'react';
import {
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

interface Item {
  id: string;
  name: string;
  description: string;
  quantity: number;
  weight: number;
  value: number;
}

interface InventoryProps {
  characterId?: string;
  isMaster?: boolean;
}

const Inventory: React.FC<InventoryProps> = ({ characterId, isMaster = false }) => {
  const [items, setItems] = useState<Item[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const [newItem, setNewItem] = useState<Partial<Item>>({
    name: '',
    description: '',
    quantity: 1,
    weight: 0,
    value: 0
  });

  const handleAddItem = () => {
    if (newItem.name) {
      const item: Item = {
        id: Date.now().toString(),
        name: newItem.name,
        description: newItem.description || '',
        quantity: newItem.quantity || 1,
        weight: newItem.weight || 0,
        value: newItem.value || 0
      };

      setItems([...items, item]);
      setNewItem({
        name: '',
        description: '',
        quantity: 1,
        weight: 0,
        value: 0
      });
      setOpenDialog(false);
    }
  };

  const handleEditItem = (item: Item) => {
    setEditingItem(item);
    setNewItem(item);
    setOpenDialog(true);
  };

  const handleUpdateItem = () => {
    if (editingItem && newItem.name) {
      const updatedItems = items.map(item =>
        item.id === editingItem.id
          ? { ...item, ...newItem, id: item.id }
          : item
      );
      setItems(updatedItems);
      setEditingItem(null);
      setNewItem({
        name: '',
        description: '',
        quantity: 1,
        weight: 0,
        value: 0
      });
      setOpenDialog(false);
    }
  };

  const handleDeleteItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  const totalValue = items.reduce((sum, item) => sum + (item.value * item.quantity), 0);

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" gutterBottom>
            Inventário
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              setEditingItem(null);
              setNewItem({
                name: '',
                description: '',
                quantity: 1,
                weight: 0,
                value: 0
              });
              setOpenDialog(true);
            }}
          >
            Adicionar Item
          </Button>
        </Grid>

        <Grid item xs={12}>
          <List>
            {items.map((item) => (
              <ListItem key={item.id}>
                <ListItemText
                  primary={`${item.name} (x${item.quantity})`}
                  secondary={`${item.description} | Peso: ${item.weight}kg | Valor: ${item.value} moedas`}
                />
                <ListItemSecondaryAction>
                  <IconButton edge="end" onClick={() => handleEditItem(item)} sx={{ mr: 1 }}>
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" onClick={() => handleDeleteItem(item.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body2" color="textSecondary">
            Peso Total: {totalWeight}kg | Valor Total: {totalValue} moedas
          </Typography>
        </Grid>
      </Grid>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {editingItem ? 'Editar Item' : 'Adicionar Novo Item'}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Nome do Item"
                value={newItem.name}
                onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Descrição"
                multiline
                rows={2}
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Quantidade"
                value={newItem.quantity}
                onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
                inputProps={{ min: 1 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Peso (kg)"
                value={newItem.weight}
                onChange={(e) => setNewItem({ ...newItem, weight: Number(e.target.value) })}
                inputProps={{ min: 0, step: 0.1 }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                fullWidth
                type="number"
                label="Valor"
                value={newItem.value}
                onChange={(e) => setNewItem({ ...newItem, value: Number(e.target.value) })}
                inputProps={{ min: 0 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button
            onClick={editingItem ? handleUpdateItem : handleAddItem}
            variant="contained"
          >
            {editingItem ? 'Atualizar' : 'Adicionar'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};

export default Inventory;
