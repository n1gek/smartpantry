'use client'
import {Box, Stack, Typography, Button, Modal, TextField} from '@mui/material'
import { useEffect, useState} from 'react';
import { firestore } from './firebase';
import { getDocs, doc, deleteDoc, getDoc, collection, query, setDoc} from 'firebase/firestore';
import DeleteIcon from '@mui/icons-material/Delete';
import HomeIcon from '@mui/icons-material/Home';
import AddIcon from '@mui/icons-material/Add';
import {styled} from '@mui/material'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const ItemBox = styled(Box)(({ theme }) => ({
     textAlign: 'center',
     '& img': {
       width: '400px', // Adjust the width as needed
       height: '400px', // Adjust the height as needed
       objectFit: 'cover', // Ensures the image covers the box without distortion
       borderRadius: '20px', // Optional: adds rounded corners
       display: 'block', // Centers the image within the box
       margin: 0 // Optional: adds a margin below the image
     },
   }));

export default function Home() {
    const [pantryList, setPantryList] = useState([]);
    const [itemName, setItemName] = useState('');
    const [quantity, setQuantity] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const updatePantry = async () => {
      const snapshot = query(collection(firestore, 'pantry')); // No need for query() if no filters
      const docs = await getDocs(snapshot);
      const pantryList = []
      docs.forEach((doc) => {
        const data = doc.data();
        pantryList.push({
          name: doc.id, 
          count: data.item ? data.item: 0
        });
      })
    setPantryList(pantryList);
  }
   useEffect(() => {
    updatePantry();
    }, []);
  
    const addItem = async (name, quantity) => {
      // Create a reference to the document in the 'pantry' collection
      const docRef = doc(collection(firestore, 'pantry'), name);

      //get the current document information
      const docSnap = await getDoc(docRef);
     const quan = parseInt(quantity);
     console.log("Document reference:", docRef);
     console.log("Document snapshot exists:", docSnap.exists());
     console.log("Document snapshot data:", docSnap.data());

      if(docSnap.exists()) {
        const data = docSnap.data();
        console.log(data.item);
        const updatedCount = (data.item || 0 ) + quan;
        await setDoc(docRef, {item: updatedCount });
      }
      else {
        await setDoc(docRef, {item: quan});
      }
      setItemName('');
      setQuantity('');
      // Update the pantry list
      updatePantry();
  }
     const increement = async (name) => {
          const docRef = doc(collection(firestore, 'pantry'), name);
          const docSnap = await getDoc(docRef);
          const data = docSnap.data();
          const updatedCount = (data.item || 0 ) + 1;
          await setDoc(docRef, {item: updatedCount });
          updatePantry();
 
     }

  const removeItem = async (name) => {
    const docRef = doc(collection(firestore, 'pantry'), name);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();

    if(data.item > 1) {
      // Update the document with the new count
      const updatedCount = data.item - 1;
      await setDoc(docRef, {item: updatedCount });
    }else {
      await deleteDoc(docRef);
     }
    updatePantry();
  };
  const filteredPantryList = pantryList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <Box width='100vw' height='100vh' display="flex" position="relative" overflow='hidden'>
      <Box width={"450px"} bgcolor={'#f0f0f0'} height={"100vh"}>
        <Stack mt={30} padding={3} direction={'column'} spacing={2}>
          <Button variant='outlined' startIcon={<HomeIcon color="secondary"/>}> Pantry</Button>
          <Button onClick={handleOpen} variant='outlined' startIcon={<AddIcon fontSize='large' color='success'/>} > Add New Item</Button> 
          <Modal open={open} onClose={handleClose} aria-labelledby="modal-modal-title"  aria-describedby="modal-modal-description">
            <Box sx={style}>
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Add Item
              </Typography>
              <Stack width='100%' direction="row" spacing={2}>
                <TextField id="outlined-basic" label="Item" variant='outlined' fullWidth value={itemName} onChange={(e) => setItemName(e.target.value)}/>
                    <TextField id="outlined-basic" label="Quantity" type='number' value={quantity} fullWidth onChange={(e) => setQuantity(e.target.value)} />
              <Button variant="outlined" onClick={() => { addItem(itemName, quantity); setItemName(''); handleClose();} }>
                  Add
              </Button>           
              </Stack>
            </Box>
          </Modal>
          
          <Button variant='outlined' >Recipes</Button>
        </Stack>
      </Box>
      <Box flex={1} bgcolor={'#B6D0E2'} height={"100vh"} overflow={'auto'}>
        <Box padding={8} >
          <Stack direction={'row'} width={'100%'}>
            <Typography variant='h1' fontSize={'4rem'} textAlign={'center'} color={'white'}>
              Welcome to your Smart Pantry!
            </Typography>
            <Box flexGrow={1} textAlign={'right'} mt={10} >
              <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} variant='standard' size='large' textAlign='right' label='Search Item' sx={{ borderRadius: '6px', backgroundColor: '#fff'}}/>
            </Box>
          </Stack>
        </Box>
        <Box mt={-20} padding={15} gap={0} display='grid' gridTemplateColumns="repeat(2, 1fr)" overflow='auto'>
               {filteredPantryList.map(item => (
            <ItemBox key={'item'} margin={5} width={400}>
              <img src="icon.jpeg" alt="Item 1" />
              <Box bgcolor={'#40B5AD'}  borderRadius={5} height={200}>
               <Typography padding={2} textAlign={'left'} color='white' variant="h4">{item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}</Typography>
               <Typography padding={2} textAlign={'left'} color='white' variant='h5'>Quantity: {item.count}</Typography>
                    <Button variant='outlined' size='large' color='success' onClick={() => increement(item.name)} startIcon={<AddIcon/>}></Button>
                    <Button variant='outlined' size='large' color='error' onClick={() => removeItem(item.name)} startIcon={<DeleteIcon />}></Button>
              </Box>
       
            </ItemBox>
               ))}
        </Box>
      </Box>
        
    </Box>
   
)};