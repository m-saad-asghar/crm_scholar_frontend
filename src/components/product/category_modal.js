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
export const CategoryPopup = (props) => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [categoryName, setCategoryName] = useState('');
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  
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
    setCategoryName((data && data.category != null && data.category != undefined) ? data.category : '')
    
  }, [props.currentData]);

  
  
  const closeCategory = () => {
    resetForm();
    props.closeCategory();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!categoryName) {
      isValid = false;
      validationerrors["categoryName"] = "Category is required.";
    }
   
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitCategory = () => {
    if (validate()){
      setIsCategoryLoading(true);
      
     
      const data = {
        category: categoryName,
      }
      if (currentId == ''){
        addNewCategory(data);
      }else{
        updateCategory(data);
      }
      
    }
    
    
  }

  const addNewCategory = (data) => {
    fetch(baseUrl + 'add_new_category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsCategoryLoading(false);
        if (data.success == 1){
          toast.success("Category is Successfully Saved!")
          props.setCategories(data.category)
        props.closeCategoryModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsCategoryLoading(false);
      });
    closeCategory(true);
  };

  const updateCategory = (data) => {
    fetch(baseUrl + 'update_category/' + currentId, {
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
        setIsCategoryLoading(false);
        if (data.success == 1){
          toast.success("Category is Successfully Updated!")
          props.setCategories(data.category)
          props.closeCategoryModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsCategoryLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setCategoryName('');
  };

  const onChangeCategoryName = (e) => {
    setCategoryName(e.target.value);
  }

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.CategoryModal}
        onClose={props.closeCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Category
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              {/*<Grid item xs={12} sm={4} md={4} lg={4}>*/}
              {/*  <InputLabel htmlFor="category_id" style={{ position: 'unset' }}>Category Id*/}
              {/*    </InputLabel>*/}
              {/*  <Input id="category_id" aria-describedby="add-category-id"*/}
              {/*         onChange={onChangeCategoryId} value={categoryID}/>*/}
              {/*</Grid>*/}
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <InputLabel htmlFor="category_name" style={{ position: 'unset' }}>Category Name</InputLabel>
                <Input id="category_name" aria-describedby="add-category-name"
                       onChange={onChangeCategoryName} value={categoryName}
                       error={Boolean(validationerrors.categoryName)}
                    helperText={validationerrors.categoryName || ""}/>
              </Grid>
              </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={submitCategory}>Submit</Button>
            <Button variant="contained" onClick={closeCategory}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
  </>
  );
};