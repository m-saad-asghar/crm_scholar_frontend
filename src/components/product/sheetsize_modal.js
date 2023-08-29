import { Box, Button, Typography, Modal, TextField, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input, Select } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
export const SheetPopup = (props) => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [sheetSizeName, setSheetSizeName] = useState('');
  const [sheetLength, setSheetLength] = useState('');
  const [sheetWidth, setSheetWidth] = useState('');
  const [sheetPortion, setSheetPortion] = useState('');
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [isSheetLoading, setIsSheetLoading] = useState(false);
  
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
    setSheetSizeName((data && data.sheet != null && data.sheet != undefined) ? data.sheet : '')
    setSheetLength((data && data.length != null && data.length != undefined) ? data.length : '')
    setSheetWidth((data && data.width != null && data.width != undefined) ? data.width : '')
    setSheetPortion((data && data.portion != null && data.portion != undefined) ? data.portion : '')
    
    
  }, [props.currentData]);

  useEffect(() => {
    if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
        resetForm();
      }
  
}, []);

  
  const closeSheet = () => {
    resetForm();
    props.closeSheet();
    setValidationerrors({})

  };
 
  
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
    if (!sheetSizeName) {
      isValid = false;
      validationerrors["sheetSizeName"] = "Sheet Size is required.";
    }
    else if (!sheetLength) {
        isValid = false;
        validationerrors["sheetLength"] = "Sheet Length is required.";
      }
      else if (!sheetWidth) {
        isValid = false;
        validationerrors["sheetWidth"] = "Sheet Width is required.";
      }
      else if (!sheetPortion) {
        isValid = false;
        validationerrors["sheetPortion"] = "Sheet Portion is required.";
      }
      
    setValidationerrors(validationerrors);

    return isValid;
  }

  

  const submitSheet = () => {
    if (validate()){
      setIsSheetLoading(true);
      
     
      const data = {
        sheet: sheetSizeName,
        length: sheetLength,
        width: sheetWidth,
        portion: sheetPortion,
        
      }
      if (currentId == ''){
        addNewSheet(data);
      }else{
        updateSheet(data);
      }
      
    }
    
    
  }

  const addNewSheet = (data) => {
    fetch(baseUrl + 'add_new_sheet_size', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsSheetLoading(false);
        if (data.success == 1){
          toast.success("Sheet Size is Successfully Saved!")
          props.setSheets(data.sheets)
        props.closeSheetModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsSheetLoading(false);
      });
    closeSheet(true);
  };

  const updateSheet = (data) => {
    fetch(baseUrl + 'update_sheet_size/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsSheetLoading(false);
        if (data.success == 1){
          toast.success("Sheet Size is Successfully Updated!")
          props.setSheets(data.sheets)
          props.closeSheetModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsSheetLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');

    setSheetSizeName('');
    setSheetLength('');
    setSheetWidth('');
    setSheetPortion('');
    
  };

  const onChangeSheetSizeName = (e) => {
    setSheetSizeName(e.target.value);
  };
  const onChangeSheetLength = (e) => {
    setSheetLength(e.target.value);
  }
  const onChangeSheetWidth = (e) => {
    setSheetWidth(e.target.value);
  }
  const onChangeSheetPortion = (e) => {
    setSheetPortion(e.target.value);
  }
  

  return (
  <>
    <ToastContainer />
  <Modal
        open={props.SheetModal}
        onClose={props.closeSheet}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Sheet Size
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              {/*<Grid item xs={12} sm={4} md={4} lg={4}>*/}
              {/*  <InputLabel htmlFor="sheetSize_id" style={{ position: 'unset' }}>SheetSize Id*/}
              {/*    </InputLabel>*/}
              {/*  <Input id="sheetSize_id" aria-describedby="add-sheetSize-id"*/}
              {/*         onChange={onChangeSheetSizeId} value={sheetSizeID}/>*/}
              {/*</Grid>*/}
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputLabel htmlFor="sheet_size" style={{ position: 'unset' }}>Sheet Size</InputLabel>
                <Input id="sheet_size" aria-describedby="add-sheet-size"
                       onChange={onChangeSheetSizeName} value={sheetSizeName}/>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputLabel htmlFor="sheet_length" style={{ position: 'unset' }}>Sheet Length</InputLabel>
                <Input id="sheet_length" aria-describedby="add-sheet-length"
                       onChange={onChangeSheetLength} value={sheetLength}/>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputLabel htmlFor="sheet_width" style={{ position: 'unset' }}>Sheet Width</InputLabel>
                <Input id="sheet_width" aria-describedby="add-sheet-width"
                       onChange={onChangeSheetWidth} value={sheetWidth}/>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <InputLabel htmlFor="sheet_portion" style={{ position: 'unset' }}>Sheet Portion</InputLabel>
                <Input id="sheet_portion" aria-describedby="add-sheet-portion"
                       onChange={onChangeSheetPortion} value={sheetPortion}/>
              </Grid>
              </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={6} md={6} lg={6}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            
            <Button variant="contained" onClick={closeSheet}>Cancel</Button>
            <Button variant="contained" onClick={submitSheet}>Submit</Button>
          </Grid>
        </Box>
     
      </Modal>
  </>
  );
};