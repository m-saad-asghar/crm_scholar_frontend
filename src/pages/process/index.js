import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, Table, TextField } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { VoucherTable } from 'src/sections/purchase/pv_table';
import { ProductsSearch } from 'src/sections/products/products-search';
import { applyPagination } from 'src/utils/apply-pagination';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';
import 'bootstrap/dist/css/bootstrap.min.css';
import { textAlign } from '@mui/system';
import { ToastContainer, toast } from 'react-toastify';
import CircularProgress from '@mui/material/CircularProgress';
import Autocomplete from '@mui/material/Autocomplete';


const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  maxHeight: '800px',
  maxWidth: '800px',
  overflow: 'auto',
};

const now = new Date();

const data = [
  {
    id: '5e887ac47eed253091be10cb',
    address: {
      city: 'Cleveland',
      country: 'USA',
      state: 'Ohio',
      street: '2849 Fulton Street'
    },
    avatar: '/assets/avatars/avatar-carson-darrin.png',
    createdAt: subDays(subHours(now, 7), 1).getTime(),
    email: 'carson.darrin@devias.io',
    name: 'Carson Darrin',
    phone: '304-428-3097'
  },
  {
    id: '5e887b209c28ac3dd97f6db5',
    address: {
      city: 'Atlanta',
      country: 'USA',
      state: 'Georgia',
      street: '1865  Pleasant Hill Road'
    },
    avatar: '/assets/avatars/avatar-fran-perez.png',
    createdAt: subDays(subHours(now, 1), 2).getTime(),
    email: 'fran.perez@devias.io',
    name: 'Fran Perez',
    phone: '712-351-5711'
  },
  
];

const productData = [
  {
    id: '24',
    code: '1234',
    name: 'Physics',
    rate: 100,

  },
  {
    id: '25',
    code: '1235',
    name: 'Physics',
    rate: 110,
    
  }
]



const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};
{/*
const useVoucherItems = (page, rowsPerPage) => {
  return useMemo(
    () => {
      const iData = itemData;
      return applyPagination(iData, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};
*/}
const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};
const useItemIds = (voucherItems) => {
return useMemo( () => {
  return voucherItems.map((voucherItems) => voucherItems.id);
})
};

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addBatchModal, setAddBatchModal] = useState(false);
  
  
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
  const customers = useCustomers(page, rowsPerPage);
  
  const customersIds = useCustomerIds(customers);
  
  const customersSelection = useSelection(customersIds);
  const handlePageChange = useCallback(
    (event, value) => {
      setPage(value);
    },
    []
  );

  const handleRowsPerPageChange = useCallback(
    (event) => {
      setRowsPerPage(event.target.value);
    },
    []
  );

  const openAddBatch = () => {

    

    fetch(baseUrl + 'get_processes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
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
        'Content-Type': 'application/json'
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
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadPaperProduct(data.papers)
      

    })
    .catch(error => console.error(error));

    setAddBatchModal(true);

    
    
  };
  const closeAddBatch = () => {
    resetForm();
    setAddBatchModal(false);
    
  };
  const resetForm = () => {
    
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
  const addBatch = () => {
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
      //is_bookprinting: batchProcess.find(item => item.process === 'Book Printing') ? 1 : 0,
      //is_titleprinting: batchProcess.find(item => item.process === 'Title Printing') ? 1 : 0,
      //is_innerprinting: batchProcess.find(item => item.process === 'Inner Printing') ? 1 : 0,
      //is_ruleprinting: batchProcess.find(item => item.process === 'Rule Printing') ? 1 : 0,
     // is_lamination: batchProcess.find(item => item.process === 'Lamination') ? 1 : 0,
      //is_spotuv: batchProcess.find(item => item.process === 'Spot UV') ? 1 : 0,
     // is_binding: batchProcess.find(item => item.process === 'Binding') ? 1 : 0,
      status: 'Open',
      created_by: 1,
      batch_processes: batchProcess,

    };

    
    console.log('Batch Processes: ' + batchProcess);
console.log(batchInfo);
    fetch(baseUrl + 'add_new_batch', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(batchInfo)
    })
    .then(response => response.json())
    .then(data => {
console.log('Success');
    });
    
      
    resetForm();
    setAddBatchModal(false);
    
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

    ream = (bookFarmay/2) * (printOrder/1000);
    ream = ream * (1 + wastage/100);
    setReamForPages(ream);

     ream = ((innerPages/2)/sheetPortion) * (printOrder/1000);
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
        open={addBatchModal}
        onClose={closeAddBatch}
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
                <Select
                  labelId="product_name"
                  id="product_name"
                  label="Product Name"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductName}
                  
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


  
                </Select>
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
              <Select
                  labelId="for_title_printing"
                  id="title_printing"
                  label="For Title Printing"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeForTitlePrinting}
                  value={forTitlePrinting}
                  
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
                  
                </Select>
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
              <Select
                  labelId="paper_for_book"
                  id="paper_for_book"
                  label="Paper For Book"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForBook}
                  value={paperForBook}
                  
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
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <Select
                  labelId="paper_for_inner"
                  id="paper_for_inner"
                  label="Paper For Inner"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForInner}
                  value={paperForInner}
                  
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
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <Select
                  labelId="paper_for_rule"
                  id="paper_for_rule"
                  label="Paper For Rule"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForRule}
                  value={paperForRule}
                  
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
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6} container alignItems="flex-end">
              <Select
                  labelId="paper_for_title"
                  id="paper_for_title"
                  label="Paper For Title"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperForTitle}
                  value={paperForTitle}
                  
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
                  
                </Select>
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
        //isOptionEqualToValue={handleIsOptionEqualToValue}
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
            <Button variant="contained" onClick={closeAddBatch}>Cancel</Button>
            <Button variant="contained" onClick={addBatch}>Submit</Button>
            
          </Grid>
        </Box>
      </Modal>
      <Head>
        <title>
          Batch | Scholar CRM
        </title>
      </Head>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          py: 8
        }}
      >
        <Container maxWidth="xl">
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              spacing={4}
            >
              <Stack spacing={1}>
                <Typography variant="h4">
                  Batch Process
                </Typography>
                {/*<Stack*/}
                {/*  alignItems="center"*/}
                {/*  direction="row"*/}
                {/*  spacing={1}*/}
                {/*>*/}
                {/*  <Button*/}
                {/*    color="inherit"*/}
                {/*    startIcon={(*/}
                {/*      <SvgIcon fontSize="small">*/}
                {/*        <ArrowUpOnSquareIcon />*/}
                {/*      </SvgIcon>*/}
                {/*    )}*/}
                {/*  >*/}
                {/*    Import*/}
                {/*  </Button>*/}
                {/*  <Button*/}
                {/*    color="inherit"*/}
                {/*    startIcon={(*/}
                {/*      <SvgIcon fontSize="small">*/}
                {/*        <ArrowDownOnSquareIcon />*/}
                {/*      </SvgIcon>*/}
                {/*    )}*/}
                {/*  >*/}
                {/*    Export*/}
                {/*  </Button>*/}
                {/*</Stack>*/}
              </Stack>
              <div>
                <Button
                  onClick={openAddBatch}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Batch
                </Button>
              </div>
            </Stack>
            <ProductsSearch/>
            <CustomersTable
              count={data.length}
              items={customers}
              onDeselectAll={customersSelection.handleDeselectAll}
              onDeselectOne={customersSelection.handleDeselectOne}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              onSelectAll={customersSelection.handleSelectAll}
              onSelectOne={customersSelection.handleSelectOne}
              page={page}
              rowsPerPage={rowsPerPage}
              selected={customersSelection.selected}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Page.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Page;
