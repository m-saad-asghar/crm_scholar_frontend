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
  const [addPaperProductModal, setAddPaperProductModal] = useState(false);

  const [paperName, setPaperName] = useState('');
  const [paperLength, setPaperLength] = useState('');
  const [paperWidth, setPaperWidth] = useState('');
  const [paperWeight, setPaperWeight] = useState('');
  const [paperType, setPaperType] = useState('0');
  const [loadPaperTypes, setLoadPaperTypes] = useState([]);

  const [paperSizes, setPaperSizes] = useState([]);
  const [isPaperSizeLoading, setIsPaperSizeLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);

  const customers = useCustomers(page, rowsPerPage);
  const customersIds = useCustomerIds(customers);
  const customersSelection = useSelection(customersIds);

  useEffect(() => {

    fetch(baseUrl + 'get_papers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setPaperSizes(data.papers);
        console.log("paper Size", data.papers);
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

  const openAddPaperProduct = () => {
    setAddPaperProductModal(true);

    fetch(baseUrl + 'get_paper_types',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadPaperTypes(data.paper_types);
      console.log("paper type", data.paper_types)

    })
    .catch(error => console.error(error));

  };
  const closeAddPaperProduct = () => {
    setAddPaperProductModal(false);
    resetForm();
  };
  const resetForm = () => {

    setPaperName('');
    setPaperLength('');
    setPaperWidth('');
    setPaperWeight('');
    setPaperType('0');
    
  };
  const addPaperProduct = () => {
    setIsPaperSizeLoading(true);
    const data = {

      paper: paperName,
      length: paperLength,
      width: paperWidth,
      weight: paperWeight,
      paper_type: paperType,
      
    };

    fetch(baseUrl + 'add_new_paper', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsPaperSizeLoading(false);
        console.log("Data Success: " + data.success);
        if (data.success == 1){
          toast.success("Paper Size is Successfully Saved!");
          setAddPaperProductModal(false);
          // Update Products
        }else{
          toast.error("Something Went Wrong!");
        }
      })
      .catch(error => {
        console.error("Error: ", error);
        toast.error("Something Went Wrong!");
      })


      .finally(() => {
        setIsPaperSizeLoading(false);
      });
      closeAddPaperProduct(true);

    console.log('add Paper Product data', data);


  };

  const onChangePaperName = (e) => {
    setPaperName(e.target.value);
  };
  const onChangePaperLength = (e) => {
    setPaperLength(e.target.value);
  }
  const onChangePaperWidth = (e) => {
    setPaperWidth(e.target.value);
  }
  const onChangePaperWeight = (e) => {
    setPaperWeight(e.target.value);
  }
  const onChangePaperType = (e) => {
    setPaperType(e.target.value);
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
      {/*Add Paper Product Modal*/}
      <Modal
        open={addPaperProductModal}
        onClose={closeAddPaperProduct}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Paper Product
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_size" style={{ position: 'unset' }}>Paper Size</InputLabel>
                <Input id="paper_size" aria-describedby="add-paper-size"
                       onChange={onChangePaperName} value={paperName}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_length" style={{ position: 'unset' }}>Paper Length</InputLabel>
                <Input id="paper_length" aria-describedby="add-paper-length"
                       onChange={onChangePaperLength} value={paperLength}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_width" style={{ position: 'unset' }}>Paper Width</InputLabel>
                <Input id="paper_width" aria-describedby="add-paper-width"
                       onChange={onChangePaperWidth} value={paperWidth}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="paper_weight" style={{ position: 'unset' }}>Paper Weight</InputLabel>
                <Input id="paper_weight" aria-describedby="add-paper-weight"
                       onChange={onChangePaperWeight} value={paperWeight}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="paper_type"
                  id="paper_type"
                  label="Paper Type"
                  style={{ minWidth: '95%' }}
                  onChange={onChangePaperType}
                  value={paperType}
                >
                  <MenuItem value="0">
                    <em>Select Paper Type</em>
                  </MenuItem>
                  {
                    loadPaperTypes.map((ptypes) => (
                      <MenuItem key={ptypes.id} value={ptypes.id}>
                        {ptypes.name}
                      </MenuItem>
                    ))
                  }
                </Select>
              </Grid>
              </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={addPaperProduct}>Submit</Button>
            <Button variant="contained" onClick={closeAddPaperProduct}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
      <Head>
        <title>
          Paper Product | Scholar CRM
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
                  Paper Product
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
                  onClick={openAddPaperProduct}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Paper Product
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