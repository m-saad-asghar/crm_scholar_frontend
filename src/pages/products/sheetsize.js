import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { CustomersTable } from 'src/sections/customer/customers-table';
import { ProductsSearch } from 'src/sections/products/products-search';
import { applyPagination } from 'src/utils/apply-pagination';
import FilledInput from '@mui/material/FilledInput';
import FormControl from '@mui/material/FormControl';
import FormHelperText from '@mui/material/FormHelperText';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
//import { error } from 'console';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4
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

const useCustomers = (page, rowsPerPage) => {
  return useMemo(
    () => {
      return applyPagination(data, page, rowsPerPage);
    },
    [page, rowsPerPage]
  );
};

const useCustomerIds = (customers) => {
  return useMemo(
    () => {
      return customers.map((customer) => customer.id);
    },
    [customers]
  );
};

const Page = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addSheetSizeModal, setAddSheetSizeModal] = useState(false);
  const [sheetSizeName, setSheetSizeName] = useState('');
  const [sheetLength, setSheetLength] = useState('');
  const [sheetWidth, setSheetWidth] = useState('');
  const [sheetPortion, setSheetPortion] = useState('');
  const [sheetSizes, setSheetSizes] = useState([]);
  const [isSheetSizeLoading, setIsSheetSizeLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  useEffect(() => {
    
    fetch(baseUrl + 'get_sheet_sizes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setSheetSizes(data.sheets);
        console.log("sheetSize", data.sheets);
      })
      .catch(error => console.error(error));
  }, []);



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

  const openAddSheetSize = () => {
    setAddSheetSizeModal(true);
  };
  const closeAddSheetSize = () => {
    setAddSheetSizeModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    setSheetSizeName('');
    setSheetLength('');
    setSheetWidth('');
    setSheetPortion('');
    
  };
  const addSheetSize = () => {
    setIsSheetSizeLoading(true);
    const data = {
      
      sheet: sheetSizeName,
      length: sheetLength,
      width: sheetWidth,
      portion: sheetPortion,
      
    };
    fetch(baseUrl + 'add_new_sheet_size', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsSheetSizeLoading(false);
        if (data.success == 1){
          toast.success("Sheet Size is Successfully Saved!")
          setAddSheetSizeModal(false);
          // Update Products
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsSheetSizeLoading(false);
      });
      closeAddSheetSize(true);
    console.log('add SheetSize data', data);
  };

  
  const onChangeSheetSizeName = (e) => {
    setSheetSizeName(e.target.value);
  };
  const onChangeSheetLength = (e) => {
    setSheetLength(e.target.value);
  };
  const onChangeSheetWidth = (e) => {
    setSheetWidth(e.target.value);
  };
  const onChangeSheetPortion = (e) => {
    setSheetPortion(e.target.value);
  };
  

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
      {/*Add SheetSize Modal*/}
      <Modal
        open={addSheetSizeModal}
        onClose={closeAddSheetSize}
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
            <Button variant="contained" onClick={addSheetSize}>Submit</Button>
            <Button variant="contained" onClick={closeAddSheetSize}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
      <Head>
        <title>
          Sheet Size | Scholar CRM
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
                  Sheet Size
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
                  onClick={openAddSheetSize}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Sheet Size
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