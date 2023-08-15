import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
export const ProductForPopup = (props) => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [productForName, setProductForName] = useState('');
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isProductForLoading, setIsProductForLoading] = useState(false);
  
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflowY: 'auto',
    overflowX: 'auto',
  };
  const textFieldStyles = {
    borderColor: 'blue', // Set your desired border color
  };

  useEffect(() => {
    const data = props.currentData;
    setCurrentId((data && data.id) ? data.id : '')
    setProductForName((data && data.name != null && data.name != undefined) ? data.name : '')
    
  }, [props.currentData]);

  
  
  const closeProductFor = () => {
    resetForm();
    props.closeProductFor();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!productForName) {
      isValid = false;
      validationerrors["productForName"] = "Paper Type is required.";
    }
   
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitProductFor = () => {
    if (validate()){
      setIsProductForLoading(true);
      
     
      const data = {
        board: productForName,
      }
      if (currentId == ''){
        addNewProductFor(data);
      }else{
        updateProductFor(data);
      }
      
    }
    
    
  }

  const addNewProductFor = (data) => {
    fetch(baseUrl + 'add_new_book_for_board', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${auth_token}`,
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setIsProductForLoading(false);
          if (data.success == 1){
            toast.success("Board is Successfully Saved!");
            props.setProductFors(data.boards);
            props.closeProductForModal();
            // Update Products
          }else{
            toast.error("Something Went Wrong!")
          }
        })
        .catch(error => toast.error("Something Went Wrong!"))
        .finally(() => {
          setIsProductForLoading(false);
        });
    //closeProductFor(true);
  };

  const updateProductFor = (data) => {
    fetch(baseUrl + 'update_book_for_board/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsProductForLoading(false);
        if (data.success == 1){
          toast.success("Board is Successfully Updated!")
          props.setProductFors(data.boards);
          props.closeProductForModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsProductForLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setProductForName('');
  };

  const onChangeProductForName = (e) => {
    setProductForName(e.target.value);
  }

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.ProductForModal}
        onClose={props.closeProductFor}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Product For
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              {/*<Grid item xs={12} sm={4} md={4} lg={4}>*/}
              {/*  <InputLabel htmlFor="product_for_id" style={{ position: 'unset' }}>Id*/}
              {/*    </InputLabel>*/}
              {/*  <Input id="product_for_id" aria-describedby="add-product_for-id"*/}
              {/*         onChange={onChangeProductForId} value={productForID}/>*/}
              {/*</Grid>*/}
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="product_for_name" style={{ position: 'unset' }}>Name</InputLabel>
                <Input id="product_for_name" aria-describedby="add-product_for-name"
                       onChange={onChangeProductForName} value={productForName}/>
              </Grid>
              </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={closeProductFor}>Cancel</Button>
            <Button variant="contained" onClick={submitProductFor}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
  </>
  );
};