"use client";

import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore";
import { firestore } from "@/firebase";
import {
  Box,
  Modal,
  TextField,
  Typography,
  Stack,
  Button,
  Paper,
  IconButton,
  Fab,
} from "@mui/material";
import { Add, Remove } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

export default function Home() {
  const [inventory, setInventory] = useState([]);
  const [open, setOpen] = useState(false);
  const [itemName, setItemName] = useState("");
  const [quantity, setQuantity] = useState(1);

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, "inventory"));
    const docs = await getDocs(snapshot);
    const inventoryList = [];
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      });
    });
    setInventory(inventoryList);
  };

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      if (quantity === 1) {
        await deleteDoc(docRef);
      } else {
        await setDoc(docRef, { quantity: quantity - 1 }, { merge: true });
      }
    }
    await updateInventory();
  };

  const addItem = async (item, qty) => {
    const docRef = doc(collection(firestore, "inventory"), item);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const { quantity } = docSnap.data();
      await setDoc(docRef, { quantity: quantity + qty }, { merge: true });
    } else {
      await setDoc(docRef, { quantity: qty });
    }
    await updateInventory();
  };

  useEffect(() => {
    updateInventory();
  }, []);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <ThemeProvider theme={theme}>
      <Box
        width="100vw"
        height="100vh"
        display="flex"
        flexDirection="column"
        alignItems="center"
        bgcolor="#f9ffea" // third-color
        fontFamily="'Roboto', sans-serif"
      >
        <Box
          width="100%"
          display="flex"
          justifyContent="center"
          textAlign="center"
          p={2}
          bgcolor="#a6d0e4" // fourth-color
        >
          <Typography variant="h4" color="#333">
            Inventory Management Service
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" alignItems="center" gap={2} mt={2}>
          <Modal open={open} onClose={handleClose}>
            <Box
              position="absolute"
              top="50%"
              left="50%"
              width={400}
              bgcolor="background.paper"
              borderRadius={3}
              boxShadow={24}
              p={4}
              display="flex"
              flexDirection="column"
              gap={2}
              sx={{
                transform: "translate(-50%, -50%)",
              }}
            >
              <Typography variant="h6" color="text.primary">Add Item</Typography>
              <Stack direction="column" spacing={2}>
                <TextField
                  variant="outlined"
                  fullWidth
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  placeholder="Item Name"
                />
                <Typography variant="h6" color="text.primary">Quantity</Typography>
                <TextField
                  variant="outlined"
                  fullWidth
                  type="number"
                  onChange={(e) => setQuantity(parseInt(e.target.value))}
                  placeholder="Quantity"
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => {
                    addItem(itemName, quantity);
                    setItemName("");
                    setQuantity(0);
                    handleClose();
                  }}
                  sx={{ backgroundColor: "#d4a5a5" }} // first-color
                >
                  Add
                </Button>
              </Stack>
            </Box>
          </Modal>

          <Fab
            color="primary"
            aria-label="add"
            onClick={handleOpen}
            sx={{ backgroundColor: "#d4a5a5" }} // first-color
          >
            <Add />
          </Fab>

          <Paper elevation={3} sx={{ width: '100000%', maxWidth: 800, p: 1, backgroundColor: '#ffecda' }}>
            <Stack spacing={2} mt={2} overflow="auto" sx={{ maxHeight: 500 }}>
              {inventory.map(({ name, quantity }) => (
                <Box
                  key={name}
                  display="flex"
                  alignItems="center"
                  justifyContent="space-between"
                  p={2}
                  bgcolor="background.paper"
                  borderRadius={1}
                  boxShadow={1}
                  width="100%"
                >
                  <Typography variant="h6" color="text.primary">
                    {name.charAt(0).toUpperCase() + name.slice(1)}
                  </Typography>
                  <Box display="flex" alignItems="center" gap={1}>
                    <IconButton
                      color="secondary"
                      onClick={() => removeItem(name)}
                    >
                      <Remove />
                    </IconButton>
                    <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ minWidth: '30px' }}>
                      {isNaN(quantity) ? 0 : quantity}
                    </Typography>
                    <IconButton
                      color="secondary"
                      onClick={() => addItem(name, 1)}
                    >
                      <Add />
                    </IconButton>
                  </Box>
                </Box>
              ))}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </ThemeProvider>
  );
}