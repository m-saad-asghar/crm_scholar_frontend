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
import Input from '@mui/material/Input';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import CircularProgress from '@mui/material/CircularProgress';
import { ToastContainer, toast } from 'react-toastify';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Paper from '@mui/material/Paper';

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
  const [addGodownModal, setAddGodownModal] = useState(false);
  const [godownID, setGodownID] = useState('');
  const [godownName, setGodownName] = useState('');
  const [godownAddress, setGodownAddress] = useState('');
  const [godownContactNo, setGodownContactNo] = useState('');
  const [godownNames, setGodownNames] = useState([]);
  const [isGodownLoading, setIsGodownLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
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

  useEffect(() => {

    fetch(baseUrl + 'get_godowns', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setGodownNames(data.godowns);
        console.log("godowns", data.godowns)
      })
      .catch(error => console.error(error));
  }, []);


  const openAddGodown = () => {
    setAddGodownModal(true);
  };
  const closeAddGodown = () => {
    setAddGodownModal(false);
    resetForm();
  };
  const resetForm = () => {
    setGodownID('');
    setGodownName('');
    setGodownAddress('');
    setGodownContactNo('');
   
    
  };
  const addGodown = () => {
    setIsGodownLoading(true);
    const data = {
      name: godownName,
      address: godownAddress,
      contact_no: godownContactNo,
      
      
    };
    fetch(baseUrl + 'add_new_godown', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsGodownLoading(false);
        if (data.success == 1){
          toast.success("Godown is Successfully Saved!")
          setAddGodownModal(false);
          // Update Products
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => {
        console.error("Error: ", error);
        toast.error("Something Went Wrong!");
      })
      .finally(() => {
        setIsGodownLoading(false);
      });
    console.log('add Godown data', data);
  };
  const onChangeGodownID = (e) => {
    setGodownID(e.target.value);
  };
  const onChangeGodownName = (e) => {
    setGodownName(e.target.value);
  };
  
  const onChangeGodownAddress = (e) => {
    setGodownAddress(e.target.value);
  };
  const onChangeGodownContactNo = (e) => {
    setGodownContactNo(e.target.value);
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
      {/*Add Godown Modal*/}
      <Modal
        open={addGodownModal}
        onClose={closeAddGodown}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Godown
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="godown_id" style={{ position: 'unset' }}>Godown
                  ID</InputLabel>
                <Input id="godown_id" aria-describedby="add-godown-code"
                       onChange={onChangeGodownID} value={godownID}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="godown_name" style={{ position: 'unset' }}>Godown
                  Name</InputLabel>
                <Input id="godown_name" aria-describedby="add-godown-name"
                       onChange={onChangeGodownName} value={godownName}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="godown_address" style={{ position: 'unset' }}>Godown
                  Address</InputLabel>
                <Input id="godown_address" aria-describedby="add-godown-address"
                       onChange={onChangeGodownAddress} value={godownAddress}/>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="godown_contact_no" style={{ position: 'unset' }}>Godown
                  Contact No</InputLabel>
                <Input id="godown_contact_no" aria-describedby="add-godown_contact_no"
                       onChange={onChangeGodownContactNo} value={godownContactNo}/>
              </Grid>
              
             
              
                  </Grid>          
              
              
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={addGodown}>Submit</Button>
            <Button variant="contained" onClick={closeAddGodown}>Cancel</Button>
          </Grid>
          
        </Box>
      </Modal>
      <Head>
        <title>
          Godown | Scholar CRM
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
                  Godown
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
                  onClick={openAddGodown}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Godown
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