import { Box, Button, Typography, Modal, TextField, Stack, Autocomplete, FormControl, FormLabel, RadioGroup, FormControlLabel, Radio, Table, Input } from '@mui/material';
import { useState, useEffect } from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import { textAlign } from '@mui/system';
import { useSelector } from 'react-redux';
export const BatchPopup = (props) => {
  const jwt_token = localStorage.getItem('jwt_token');
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
 
  
  const [validationerrors, setValidationerrors] = useState({});
  const [currentId, setCurrentId] = useState('');
  const [batchNo, setBatchNo] = useState('');
  const [productName, setProductName] = useState('0');
  const [productID, setProductID] = useState('0');
  const [loadProducts, setLoadProducts] = useState([]);
    
  const [batchProcess, setBatchProcess] = useState([]);
  const [loadBatchProcesses, setLoadBactProcesses] = useState([]);

  const [sheetSize, setSheetSize] = useState('');
  const [sheetPortion, setSheetPortion] = useState('');
  const [titleSize, setTitleSize] = useState('');
  const [titlePortion, setTitlePortion] = useState('');
  const [bookPages, setBookPages] = useState('');
  const [innerPages, setInnerPages] = useState('');
  const [rulePages, setRulePages] = useState('');
  const [bookFarmay, setBookFarmay] = useState('');

  const [printOrder, setPrintOrder] = useState('');
  const [wastage, setWastage] = useState('');
  const [forTitlePrinting, setForTitlePrinting] = useState('0');
  const [reamForPages, setReamForPages] = useState('');
  const [reamForInnerPages, setReamForInnerPages] = useState('');
  const [reamForRulePages, setReamForRulePages] = useState('');
  const [reamForTitle, setReamForTitle] = useState('');

  const [paperForBook, setPaperForBook] = useState('0');
  const [paperForInner, setPaperForInner] = useState('0');
  const [paperForRule, setPaperForRule] = useState('0');
  const [paperForTitle, setPaperForTitle] = useState('0');

  const [paperForBookID, setPaperForBookID] = useState('0');
  const [paperForInnerID, setPaperForInnerID] = useState('0');
  const [paperForRuleID, setPaperForRuleID] = useState('0');
  const [paperForTitleID, setPaperForTitleID] = useState('0');

  const [loadPaperProduct, setLoadPaperProduct] = useState([]);
  
  const [isDataLoading, setIsDataLoading] = useState(false);
  
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
    openBatch();
    const data = props.currentData;
    if(data && data.id){
      setCurrentId((data && data.id) ? data.id : '')
      
      setProductName(data.Product)
      onClickProduct(data.for_product)
      
      

      setPrintOrder(data.book_print_qty)
      setWastage(data.book_paper_wastage)
      setReamForPages(data.book_paper_qty)
      if(data.paper_for_book != 0)
      setPaperForBook((loadPaperProduct.find(paper => paper.id == data.paper_for_book)).name)
      else
      setPaperForBook(0)
      setPaperForBookID(data.paper_for_book)

      setReamForInnerPages(data.inner_paper_qty)
      if(data.paper_for_inner != 0)
      setPaperForInner((loadPaperProduct.find(paper => paper.id == data.paper_for_inner)).name)
      else
      setPaperForInner(0)
      setPaperForInnerID(data.paper_for_inner)

      setReamForTitle(data.title_paper_qty)
      if(data.paper_for_title != 0)
      setPaperForTitle((loadPaperProduct.find(paper => paper.id == data.paper_for_title)).name)
      else
      setPaperForTitle(0)
      setPaperForTitleID(data.paper_for_title)

      setReamForRulePages(data.rule_paper_qty)
      if(data.paper_for_rule != 0)
      setPaperForRule((loadPaperProduct.find(paper => paper.id == data.paper_for_rule)).name)
    else
    setPaperForRule(0);
      setPaperForRuleID(data.paper_for_rule)

      loadBatchProcessesForUpdate(data.batch_no)

      setBatchNo(data.batch_no);

    }
    else{
      setCurrentId('')
    }
   
    

    
  }, [props.currentData]);

  const loadBatchProcessesForUpdate = (batchNo) => {
    fetch(baseUrl + 'get_processes_of_batch/' + batchNo, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setBatchProcess(data.processes)
    })
    .catch(error => console.error(error));
  }

  const openBatch = () => {

    fetch(baseUrl + 'get_processes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwt_token}`,
        },
    })
    .then(response => response.json())
    .then(data => {
        setLoadBactProcesses(data.processes);
    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_products_for_batch',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadProducts(data.products);     

    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_paper_with_type',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadPaperProduct(data.papers)
    })
    .catch(error => console.error(error));

    
  };
  
  
  const closeBatch = () => {
    resetForm();
    props.closeBatch();
    setValidationerrors({})

  };
  const validate = () => {
    let validationerrors = {};
    let isValid = true;
   
   
    setValidationerrors(validationerrors);

    return isValid;
  }
  const submitBatch = () => {
    if (validate()){
      setIsDataLoading(true);

      const batchInfo = {
        for_product: productID,
        book_print_qty: printOrder,
        book_paper_qty: reamForPages,
        wastage: wastage,
        title_paper_qty: reamForTitle,
        inner_paper_qty: reamForInnerPages,
        rule_paper_qty: reamForRulePages, 
        paper_for_book: paperForBookID,
        paper_for_inner: paperForInnerID,
        paper_for_rule: paperForRuleID,
        paper_for_title: paperForTitleID,
        status: 'Open',
        created_by: 1,
        batch_processes: batchProcess,
        batch_no: batchNo,
  
      };
      if (currentId == ''){
        addNewBatch(batchInfo);
      }else{
        if(isBatchUpdateable(batchNo) == true){
          console.log('Update Submit:')
          updateBatch(batchInfo);
        }
          
      }
      setIsDataLoading(false);      
    }   
  }

  const addNewBatch = (batchinfo) => {
    
  
    fetch(baseUrl + 'add_new_batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(batchinfo)
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        if (data.success == 1){
          toast.success("Batch is Successfully Saved!")
          props.setBatches(data.batches)
        props.closeBatchModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsDataLoading(false);
      });
    closeBatch(true);
  };

  const isBatchUpdateable = (batchno) => {
    console.log('Batch Processes: ' + JSON.stringify(batchProcess) )
    fetch(baseUrl + 'check_batch_isupdateable/' + batchno, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
    })
    .then(response => response.json())
    .then(data => {
      if(data.isUpdateable == 1)
      return true;
    else{
      toast.error('You can not update Batch: ' + batchno)
      setIsDataLoading(false);
      return false;
    }
    })
    .catch(error =>{
      toast.error('Something went wrong!')
      setIsDataLoading(false);
      return false;
    }) 
  }

  const updateBatch = (batchinfo) => {
    console.log('Update Batch: ' + JSON.stringify(batchinfo));
    fetch(baseUrl + 'update_batch/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
      },
      body: JSON.stringify(batchinfo)
    })
      .then(response => response.json())
      .then(data => {
        console.log("data", data)
        setIsDataLoading(false);
        if (data.success == 1){
          toast.success("Batch is Successfully Updated!")
          props.setBatches(data.batches)
          props.closeBatchModal();
          resetForm();
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsDataLoading(false);
      });
  };

  const resetForm = () => {
    
    setValidationerrors({});
    setCurrentId('');
    setProductName('0');
    setPrintOrder('');
    setWastage('');
    setForTitlePrinting('0');
    setReamForPages('');
    setReamForInnerPages('');
    setReamForRulePages('');
    setReamForTitle('');
    setBatchProcess([]);
  };
  const onChangeProductName = (e) => {
    
    setProductName(e.target.value);
  };
  const onClickProduct = (pid) => {
    setProductID(pid);
    const product = loadProducts.find(product => product.id === pid);
    setSheetSize(product.sheet);
    setSheetPortion(product.s_portion);
    setTitleSize(product.title);
    setTitlePortion(product.t_portion);
    setBookPages(product.pages);
    setInnerPages(product.inner_pages);
    setRulePages(product.rule_pages);
    setBookFarmay(product.farmay);
  }
  const onChangeSheetSize = (e) => {
    
  }
  const onChangeTitleSize = (e) => {
    
  }
  const onChangeBookPages = (e) => {
    
  }
  const onChangeInnerPages = (e) => {
    
  }
  const onChangeRulePages = (e) => {
    
  }
  const onChangeBookFarmay = (e) => {
    
  }
  const onChangePrintOrder = (e) => {
    setPrintOrder(e.target.value);
  }
  const onChangeWastage = (e) => {
    setWastage(e.target.value);
  }
  const onChangeForTitlePrinting = (e) => {
    setForTitlePrinting(e.target.value);
  }
  const onChangeReamForBookPages = (e) =>{
    setReamForPages(e.target.value);
    
      }
 const onChangeReamForInnerPages = (e) =>{
        setReamForInnerPages(e.target.value);
        
          }
 const onChangeReamForRulePages = (e) => {
    setReamForRulePages(e.target.value);
 }
 
  const onChangeReamForTitle = (e) =>{
setReamForTitle(e.target.value);

  }
  const onClickCalcButton = (e) => {
let ream = 0;
    if(forTitlePrinting === '1')
    {
        ream = (printOrder/titlePortion)/500;
        ream = ream * (1 + wastage/100);
        setReamForTitle(ream);
    }
    else if (forTitlePrinting === '2'){
        ream = (printOrder/titlePortion)/100;
        ream = ream * (1 + wastage/100);
        setReamForTitle(ream);
    }
    else{
        setReamForTitle(0);
    }

    ream = (bookFarmay) * (printOrder/500);
    ream = ream * (1 + wastage/100);
    setReamForPages(ream);

     ream = (printOrder/sheetPortion)/500 * innerPages/2;
     ream = ream * (1 + wastage/100);
    setReamForInnerPages(ream);

    ream = ((rulePages/2)/sheetPortion) * (printOrder/1000);
    ream = ream * (1 + wastage/100);
    setReamForRulePages(ream);

  }
 
  const onChangeBatchProcesses = (e, newValue) => {
setBatchProcess(newValue);

  }
  const onChangePaperForBook = (e) => {
setPaperForBook(e.target.value);
  }
  const onChangePaperForInner = (e) => {
    setPaperForInner(e.target.value);
  }
  const onChangePaperForRule = (e) => {
    setPaperForRule(e.target.value);
  }
  const onChangePaperForTitle = (e) => {
    setPaperForTitle(e.target.value);
  }
  const onClickPaperForBook = (id) => {
    setPaperForBookID(id);
  }
  const onClickPaperForInner = (id) => {
    setPaperForInnerID(id);
  }
  const onClickPaperForRule = (id) => {
    setPaperForRuleID(id);
  }
  const onClickPaperForTitle = (id) => {
    setPaperForTitleID(id);
  }
 

  return (
  <>
    <ToastContainer />
    <Modal
        open={isDataLoading}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
          {<CircularProgress
            size={100}
            style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
          />}
      </Modal>
      <ToastContainer />
      {/*Add Purchase Voucher Modal*/}
      <Modal
        open={props.BatchModal}
        onClose={props.closeBatch}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Batch
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            
            <Grid container spacing={2}>
            
            <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  labelId="product_name"
                  id="product_name"
                  label="Product Name"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductName}
                  select
                  value={productName}
                >
                  <MenuItem value="0">
                    <em>Select Product Name</em>
                  </MenuItem>
                  {
                   loadProducts.map((product) => (
                    <MenuItem data-key={product.id} value={product.name} 
                    onClick={() => onClickProduct(product.id)}>
                      {product.name}
                    </MenuItem>
                  ))
                  }


  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
              <InputLabel htmlFor="sheet_size" style={{ position: 'unset' }}>Sheet Size
                  </InputLabel>
                <TextField id="sheet_size" aria-describedby="add-sheet_size"
                       onChange={onChangeSheetSize} value={sheetSize}/>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6}>
              <InputLabel htmlFor="title_size" style={{ position: 'unset' }}>Title Size
                  </InputLabel>
                <TextField id="title_size" aria-describedby="add-title_size"
                       onChange={onChangeTitleSize} value={titleSize}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
              
              <InputLabel htmlFor="pages" style={{ position: 'unset' }}>Pages
                  </InputLabel>
                <TextField id="pages" aria-describedby="add-pages"
                       onChange={onChangeBookPages} value={bookPages}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="inner_pages" style={{ position: 'unset' }}>Inner Pages
                  </InputLabel>
                <TextField id="inner_pages" aria-describedby="add-inner_pages"
                       onChange={onChangeInnerPages} value={innerPages}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="rule_pages" style={{ position: 'unset' }}>Rule Pages
                  </InputLabel>
                <TextField id="rule_pages" aria-describedby="add-rule_pages"
                       onChange={onChangeRulePages} value={rulePages}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="farmay" style={{ position: 'unset' }}>Farmay
                  </InputLabel>
                <TextField id="farmay" aria-describedby="add-farmay"
                       onChange={onChangeBookFarmay} value={bookFarmay}/>
                </Grid>
<Grid container spacing={2}>

                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="print_order" style={{ position: 'unset' }}>Print Order
                  </InputLabel>
                <TextField id="print_order" aria-describedby="add-print_order"
                       onChange={onChangePrintOrder} value={printOrder}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="wastage" style={{ position: 'unset' }}>Wastage %
                  </InputLabel>
                <TextField id="wastage" aria-describedby="add-wastage"
                       onChange={onChangeWastage} value={wastage}/>
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4} container alignItems="flex-end">
              <TextField
                  labelId="for_title_printing"
                  id="title_printing"
                  label="For Title Printing"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeForTitlePrinting}
                  value={forTitlePrinting}
                  select
                >
                  <MenuItem value="0">
                    <em>For Title Printing</em>
                  </MenuItem>
                  <MenuItem value="1">
                    <em>Ream</em>
                  </MenuItem>
                  <MenuItem value="2">
                    <em>Packet</em>
                  </MenuItem>
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2} md={2} lg={2} container alignItems="flex-end">
              <Button variant="contained" onClick={onClickCalcButton}>Calc.</Button>
              </Grid>
</Grid>
              <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="ream_for_pages" style={{ position: 'unset' }}>Ream For Pages
                  </InputLabel>
                <TextField id="ream_for_pages" aria-describedby="add-ream_for_pages"
                       onChange={onChangeReamForBookPages} value={reamForPages}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="ream_for_inner" style={{ position: 'unset' }}>Ream For Inner
                  </InputLabel>
                <TextField id="ream_for_inner" aria-describedby="add-ream_for_inner"
                       onChange={onChangeReamForInnerPages} value={reamForInnerPages}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="ream_for_rule" style={{ position: 'unset' }}>Ream For Rule
                  </InputLabel>
                <TextField id="ream_for_rule" aria-describedby="add-ream_for_rule"
                       onChange={onChangeReamForRulePages} value={reamForRulePages}/>
                </Grid>
                <Grid item xs={12} sm={3} md={3} lg={3}>
                <InputLabel htmlFor="ream_for_tile" style={{ position: 'unset' }}>Ream For Title
                  </InputLabel>
                <TextField id="ream_for_title" aria-describedby="add-ream_for_title"
                       onChange={onChangeReamForTitle} value={reamForTitle}/>
                </Grid>
                <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <TextField
                  labelId="paper_for_book"
                  id="paper_for_book"
                  label="Paper For Book"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForBook}
                  value={paperForBook}
                  select
                >
                  <MenuItem value="0">
                    <em>Paper For Book</em>
                  </MenuItem>
                  {
                  loadPaperProduct.map((paper) => (
                    <MenuItem key={paper.id} value={paper.name}
                    onClick={() => onClickPaperForBook(paper.id)}>{paper.name}</MenuItem>
                  ))
                 }
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <TextField
                  labelId="paper_for_inner"
                  id="paper_for_inner"
                  label="Paper For Inner"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForInner}
                  value={paperForInner}
                  select
                >
                  <MenuItem value="0">
                    <em>Paper For Inner</em>
                  </MenuItem>
                  {
                  loadPaperProduct.map((paper) => (
                    <MenuItem key={paper.id} value={paper.name}
                    onClick={() => onClickPaperForInner(paper.id)}>{paper.name}</MenuItem>
                  ))
                 }
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <TextField
                  labelId="paper_for_rule"
                  id="paper_for_rule"
                  label="Paper For Rule"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForRule}
                  value={paperForRule}
                  select
                >
                  <MenuItem value="0">
                    <em>Paper For Rule</em>
                  </MenuItem>
                   {
                  loadPaperProduct.map((paper) => (
                    <MenuItem key={paper.id} value={paper.name}
                    onClick={() => onClickPaperForRule(paper.id)}>{paper.name}</MenuItem>
                  ))
                 }
                  
                </TextField>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <TextField
                  labelId="paper_for_title"
                  id="paper_for_title"
                  label="Paper For Title"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForTitle}
                  value={paperForTitle}
                  select
                >
                  <MenuItem value="0">
                    <em>Paper For Title</em>
                  </MenuItem>
                  {
                  loadPaperProduct.map((paper) => (
                    <MenuItem key={paper.id} value={paper.name}
                    onClick={() => onClickPaperForTitle(paper.id)}>{paper.name}</MenuItem>
                  ))
                 }
                  
                </TextField>
              </Grid>
                <Grid item xs={12} sm={12} md={12} lg={12}>
                <Stack spacing={3} sx={{ width: 500 }}>
              <Autocomplete
        multiple
        id="batch_process"
        options={loadBatchProcesses}
        getOptionLabel={(option) => option.process}
        //getOptionSelected={(option, value) => option.id === value.id} // Handle option selection based on id
        value={batchProcess}
        onChange={onChangeBatchProcesses}
        isOptionEqualToValue={(option, value) => option.id == value.id}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Select Processes"
            placeholder="Select Processes"
          />
        )}
      />
      </Stack>
                </Grid>

            </Grid>

            {/* Grid Table */}

            


            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={closeBatch}>Cancel</Button>
            <Button variant="contained" onClick={submitBatch}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
    </>
  );
};