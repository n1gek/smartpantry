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
       width: '60%',
       height: '60%',
       objectFit: 'cover',
       borderRadius: '10%', 
       display: 'block', 
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
      const snapshot = query(collection(firestore, 'pantry'));
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
      // Create a reference to the document in the pantry collection
      const docRef = doc(collection(firestore, 'pantry'), name);

      //get the current document information
      const docSnap = await getDoc(docRef);

      //now convert the quantity to an integer 
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
      // Always update the pantry list
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
      // update the count now!!!!!
      const updatedCount = data.item - 1;
      await setDoc(docRef, {item: updatedCount });
    }else {
      await deleteDoc(docRef);
     }
    updatePantry();
  };
  const filteredPantryList = pantryList.filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
  return (
    <Box  flexDirection={{ xs: 'column', md: 'row' }} width='100vw' height='100vh' display="flex" position="relative" overflow='hidden'>
      <Box width={"20%"} bgcolor={'#f0f0f0'} height={"100vh"}>
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
        <Box padding={{xs: 4, sm:8}} >
          <Stack direction={'row'} width={'100%'}>
            <Typography variant='h1' fontSize={'4rem'} textAlign={'center'} color={'white'}>
              Welcome to your Smart Pantry!
            </Typography>
            <Box flexGrow={1} textAlign={'right'} mt={10} >
              <TextField value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} variant='standard' size='large' textAlign='right' label='Search Item' sx={{ borderRadius: '6px', backgroundColor: '#fff'}}/>
            </Box>
          </Stack>
        </Box>
        <Box  display='grid' gridTemplateColumns={{ xs: '1fr', sm: 'repeat(2, 1fr)'}} gap={0} ml={{xs: 0, sm: '20%'}} overflow='auto'>
               {filteredPantryList.map(item => (
            <ItemBox key={'item'} padding={2} width={'100%'}>
              <img src="icon.jpeg" alt="Item 1" />
              <Box bgcolor={'#40B5AD'}  borderRadius={'7%'} width='60%' height={'25%'}>
               <Typography  ml={'5%'} textAlign={'left'} color='white' variant="h5">{item.name.charAt(0).toUpperCase() + item.name.slice(1).toLowerCase()}</Typography>
               <Typography ml={'5%'} padding={1} textAlign={'left'} color='white' variant='h6'>Quantity: {item.count}</Typography>
                    <Button variant='outlined' size='medium' color='success' onClick={() => increement(item.name)} startIcon={<AddIcon/>}></Button>
                    <Button variant='outlined' size='medium' color='error' onClick={() => removeItem(item.name)} startIcon={<DeleteIcon />}></Button>
          </Box>
       
            </ItemBox>
               ))}
        </Box>
      </Box>
        
    </Box>
   
)};