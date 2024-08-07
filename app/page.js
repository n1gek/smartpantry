'use client'
import {Box, Stack, Typography, Button, Modal, TextField, FormControl, InputLabel, Select, MenuItem} from '@mui/material'
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

    const [openAddItem, setOpenAddItem] = useState(false);
    const handleOpen = () => setOpenAddItem(true);
    const handleClose = () => setOpenAddItem(false);

    const [openRecipes, setOpenRecipe] = useState(false);
    const openRecipe = () => setOpenRecipe(true);
    const closeRecipe = () => setOpenRecipe(false);

    const [ingredients, setIngredients] = useState([]);
    const [selectedIngredients, setselectedIngredients] = useState([]);
    const [recipe, setRecipe] = useState('');

    const handleSuggestRecipe = async () => {
      const recipeIngredients = selectedIngredients.map(ingredient => ingredient.trim()).join(', ');
    
      try {
        const response = await fetch('/app/server', { 
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ingredients: recipeIngredients.split(', ') }), 
        });
    
        const data = await response.json();
        if (response.ok) {
          setRecipe(data.recipe);
          openRecipe();
        } else {
          console.error('Error:', data.error);
        }
      } catch (error) {
        console.error('Fetch error:', error);
      }
    };
  
  

  useEffect(() => {
    const fetchIngredients = async () => {
      const snapshot = await getDocs(collection(firestore, 'pantry'));
      const ingredientsList = snapshot.docs.map(doc => doc.id);
      setIngredients(ingredientsList);
      console.log(ingredientsList);
    };
    fetchIngredients();
  }, []);

  const handleIngredientChange = (event) => {
    setselectedIngredients(event.target.value);
  };

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
        <Stack mt={10} padding={3} direction={'column'} spacing={2}>
          <ItemBox objectFit='cover'
          ><img src="icon2.jpeg"/></ItemBox>
          <Button variant='outlined' startIcon={<HomeIcon color="secondary"/>}> Pantry</Button>
          <Button onClick={handleOpen} variant='outlined' startIcon={<AddIcon fontSize='large' color='success'/>} > Add New Item</Button> 
          <Modal open={openAddItem} onClose={handleClose} aria-labelledby="modal-modal-title"  aria-describedby="modal-modal-description">
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
          
          <Button onClick={openRecipe} variant='outlined' >Recipes</Button>
          
          <Modal open={openRecipes} onClose={closeRecipe} aria-labelledby='modal-modal-title' aria-describedby='modal-modal-description' >
            <Box sx={{ top: '10%', left: '20%', display: 'block', position: 'absolute', bgcolor: 'whitesmoke',
              width: '70%', height: '80%', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant='h4' bgcolor={'#d67964'}>Select your ingredients to get a Recipe</Typography>
              <FormControl fullWidth>
                <InputLabel id="ingredient select label" bgcolor='white' >Select Ingredient</InputLabel>
                <Select labelId="ingredient select label" id="ingredient label" multiple value={selectedIngredients} label="Ingredient"
                  onChange={handleIngredientChange}>
                  {ingredients.map((ingredient, index) => (
                    <MenuItem value={ingredient} key={index} >{ingredient}</MenuItem>))}
                </Select>
              </FormControl>
              <Button onClick={handleSuggestRecipe} variant='contained' color='secondary'>Get Recipe</Button>
              <Typography variant='h4' bgcolor={'#b79f9a'}>Recipe Suggestion</Typography>
                    <Typography bgcolor={'whitesmoke'} variant='h6'> Your recipe is going to show up here! {recipe} </Typography>
              {/* <Button onClick={() => closeRecipe()} variant='contained' color='primary'>Close</Button> */}
            </Box>
          </Modal>

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