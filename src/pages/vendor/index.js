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
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';


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
  p: 4,
  overflowY: 'auto',
  overflowX: 'auto',
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
  const [addVendorModal, setAddVendorModal] = useState(false);

  const [vendorName, setVendorName] = useState('');
  const [vendorType, setVendorType] = useState([]);
  const [vendorAddress, setVendorAddress] = useState('');
  const [vendorContactNo, setVendorContactNo] = useState('');
  const [loadVendorTypes, setLoadVendorTypes] = useState([]);

  const [vendorNames, setVendorNames] = useState([]);
  const [isVendorLoading, setIsVendorLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {

    fetch(baseUrl + 'get_vendors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setVendorNames(data.vendors);
        console.log("vendors", data.vendors);
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




  const openAddVendor = () => {
    setAddVendorModal(true);

fetch(baseUrl + 'get_vendor_types', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  })
  .then(response => response.json())
  .then(data => {
    console.log('Types: ' + data.vendor_types);
    setLoadVendorTypes(data.vendor_types)

  })
  .catch(error => console.error(error));


  };
  const closeAddVendor = () => {
    setAddVendorModal(false);
    resetForm();
  };
  const resetForm = () => {

    setVendorName('');
    setVendorAddress('');
    setVendorContactNo('');
    setVendorType([]);

    
  };
  const addVendor = () => {
    setIsVendorLoading(true);
    const data = {

      name: vendorName,
      address: vendorAddress,
      contact_no: vendorContactNo,
      vendor_type: vendorType,

    };

    fetch(baseUrl + 'add_new_vendor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsVendorLoading(false);
        //console.log("Data Success: " + data.vendors);
        if (data.success == 1){
          toast.success("Vendor is Successfully Saved!");
          setAddVendorModal(false);
          closeAddVendor(true);
          // Update Products
        }else{
          toast.error("Something Went Wrong!");
        }
      })
      .catch(error => {
        console.error("Error Vendor: ", error);
        toast.error("Something Went Wrong!");
      })


      .finally(() => {
        setIsVendorLoading(false);
      });

    console.log('add Vendor data', data);
  };

  const onChangeVendorName = (e) => {
    setVendorName(e.target.value);
  };
  
  const onChangeVendorAddress = (e) => {
    setVendorAddress(e.target.value);
  };
  const onChangeVendorContactNo = (e) => {
    setVendorContactNo(e.target.value);
  };
  const onChangeVendorType = (e, newValue) => {



    setVendorType(newValue);

  };
  const handleIsOptionEqualToValue = (option, value) => {
    return option.id === value.id && option.vendor_type === value.vendor_type;
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
      {/*Add Vendor Modal*/}
      <Modal
        open={addVendorModal}
        onClose={closeAddVendor}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Vendor
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="vendor_name" style={{ position: 'unset' }}>Vendor
                  Name</InputLabel>
                <Input id="vendor_name" aria-describedby="add-vendor-name"
                       onChange={onChangeVendorName} value={vendorName}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="vendor_address" style={{ position: 'unset' }}>Vendor
                  Address</InputLabel>
                <Input id="vendor_address" aria-describedby="add-vendor-address"
                       onChange={onChangeVendorAddress} value={vendorAddress}/>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="vendor_contact_no" style={{ position: 'unset' }}>Vendor
                  Contact No</InputLabel>
                <Input id="vendor_contact_no" aria-describedby="add-vendor_contact_no"
                       onChange={onChangeVendorContactNo} value={vendorContactNo}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
              <Stack spacing={3} sx={{ width: 500 }}>
              <Autocomplete
        multiple
        id="vendor_types"
        options={loadVendorTypes}
        getOptionLabel={(option) => option.vendor_type}
        value={vendorType}
        onChange={onChangeVendorType}
        isOptionEqualToValue={handleIsOptionEqualToValue}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="standard"
            label="Vendor Type"
            placeholder="Vendor Types"
          />
        )}
      />
      </Stack>
              </Grid>



                  </Grid>
              
              
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={addVendor}>Submit</Button>
            <Button variant="contained" onClick={closeAddVendor}>Cancel</Button>
          </Grid>
          
        </Box>
      </Modal>
      <Head>
        <title>
          Vendors | Scholar CRM
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
                  Vendors
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
                  onClick={openAddVendor}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Vendor
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