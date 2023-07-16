import { useCallback, useMemo, useState } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, Table } from '@mui/material';
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
  {
    id: '5e887b7602bdbc4dbb234b27',
    address: {
      city: 'North Canton',
      country: 'USA',
      state: 'Ohio',
      street: '4894  Lakeland Park Drive'
    },
    avatar: '/assets/avatars/avatar-jie-yan-song.png',
    createdAt: subDays(subHours(now, 4), 2).getTime(),
    email: 'jie.yan.song@devias.io',
    name: 'Jie Yan Song',
    phone: '770-635-2682'
  },
  {
    id: '5e86809283e28b96d2d38537',
    address: {
      city: 'Madrid',
      country: 'Spain',
      name: 'Anika Visser',
      street: '4158  Hedge Street'
    },
    avatar: '/assets/avatars/avatar-anika-visser.png',
    createdAt: subDays(subHours(now, 11), 2).getTime(),
    email: 'anika.visser@devias.io',
    name: 'Anika Visser',
    phone: '908-691-3242'
  },
  {
    id: '5e86805e2bafd54f66cc95c3',
    address: {
      city: 'San Diego',
      country: 'USA',
      state: 'California',
      street: '75247'
    },
    avatar: '/assets/avatars/avatar-miron-vitold.png',
    createdAt: subDays(subHours(now, 7), 3).getTime(),
    email: 'miron.vitold@devias.io',
    name: 'Miron Vitold',
    phone: '972-333-4106'
  },
  {
    id: '5e887a1fbefd7938eea9c981',
    address: {
      city: 'Berkeley',
      country: 'USA',
      state: 'California',
      street: '317 Angus Road'
    },
    avatar: '/assets/avatars/avatar-penjani-inyene.png',
    createdAt: subDays(subHours(now, 5), 4).getTime(),
    email: 'penjani.inyene@devias.io',
    name: 'Penjani Inyene',
    phone: '858-602-3409'
  },
  {
    id: '5e887d0b3d090c1b8f162003',
    address: {
      city: 'Carson City',
      country: 'USA',
      state: 'Nevada',
      street: '2188  Armbrester Drive'
    },
    avatar: '/assets/avatars/avatar-omar-darboe.png',
    createdAt: subDays(subHours(now, 15), 4).getTime(),
    email: 'omar.darobe@devias.io',
    name: 'Omar Darobe',
    phone: '415-907-2647'
  },
  {
    id: '5e88792be2d4cfb4bf0971d9',
    address: {
      city: 'Los Angeles',
      country: 'USA',
      state: 'California',
      street: '1798  Hickory Ridge Drive'
    },
    avatar: '/assets/avatars/avatar-siegbert-gottfried.png',
    createdAt: subDays(subHours(now, 2), 5).getTime(),
    email: 'siegbert.gottfried@devias.io',
    name: 'Siegbert Gottfried',
    phone: '702-661-1654'
  },
  {
    id: '5e8877da9a65442b11551975',
    address: {
      city: 'Murray',
      country: 'USA',
      state: 'Utah',
      street: '3934  Wildrose Lane'
    },
    avatar: '/assets/avatars/avatar-iulia-albu.png',
    createdAt: subDays(subHours(now, 8), 6).getTime(),
    email: 'iulia.albu@devias.io',
    name: 'Iulia Albu',
    phone: '313-812-8947'
  },
  {
    id: '5e8680e60cba5019c5ca6fda',
    address: {
      city: 'Salt Lake City',
      country: 'USA',
      state: 'Utah',
      street: '368 Lamberts Branch Road'
    },
    avatar: '/assets/avatars/avatar-nasimiyu-danai.png',
    createdAt: subDays(subHours(now, 1), 9).getTime(),
    email: 'nasimiyu.danai@devias.io',
    name: 'Nasimiyu Danai',
    phone: '801-301-7894'
  }
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

  const [tableData, setTableData] = useState([]);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addPurchaseModal, setAddPurchaseModal] = useState(false);
  const [purchaseVoucherNo, setPurchaseVoucherNo] = useState('');
  const [vendorName, setVendorName] = useState('');
  const [productType, setProductType] = useState('0');
  const [productName, setProductName] = useState('0');
  const [productCode, setProductCode] = useState('0');
  const [productGodown, setProductGodown] = useState('0');
  const [productQty, setProductQty] = useState('');
  const [productRate, setProductRate] = useState('');
  const [productAmount, setProductAmount] = useState('');

  
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

  const openAddPurchase = () => {
    setAddPurchaseModal(true);
  };
  const closeAddPurchase = () => {
    setAddPurchaseModal(false);
    resetForm();
  };
  const resetForm = () => {
    setPurchaseVoucherNo('');
    setVendorName('');
    setProductType('0');
    setProductName('');
    setProductCode('');
    setProductGodown('');
    setProductQty('');
    setProductRate('');
    setProductAmount('');

    setTableData([]);
    
  };
  const addPurchase = () => {
    const data = {
      purchase_voucher_no: purchaseVoucherNo,
      vendor_name: vendorName,
      
      
    };
  };
  const onClickAddButton = () => {
    const newItem = {
      product_code: productCode,
      product_name: productName,
      product_godown: productGodown,
      product_qty: productQty,
      product_rate: productRate,
      product_amount: productAmount,
    };
    setTableData((prevTableData) => [...prevTableData, newItem]);
  };
  const onChangePurchaseVoucherNo = (e) => {
    setPurchaseVoucherNo(e.target.value);
  };
  
  const onChangeVendorName = (e) => {
    setVendorName(e.target.value);
  };
  
  const onChangeProductType = (e) => {
    setProductType(e.target.value);
  }

  const onChangeProductName = (e) => {
    
    setProductName(e.target.value);

    

  }
  const onClickProductName = ( pid) =>{
    const selectedProduct = productData.find(
      (product) => product.id === pid 
    );
    

  if (selectedProduct) {
    setProductCode(selectedProduct.code);
  } else {
    setProductCode('');
  }
  }
  const onChangeProductCode = (e) => {
   
    setProductCode(e.target.value);

    
  
  }
  const onClickProductCode = (pid) => {
    const selectedProduct = productData.find(
      (product) => product.id === pid 
    );
    

  if (selectedProduct) {
    setProductName(selectedProduct.name);
  } else {
    setProductName('');
  }
  }
  const onChangeProductGodown = (e) => {
    setProductGodown(e.target.value);
  }
  const onChangeProductQty = (e) => {
    setProductQty(e.target.value);
  }
  const onChangeProductRate = (e) => {
    setProductRate(e.target.value);
  }
  const onChangeProductAmount = (e) => {
    setProductAmount(e.target.value);
  }

  return (
    <>
      {/*Add Purchase Voucher Modal*/}
      <Modal
        open={addPurchaseModal}
        onClose={closeAddPurchase}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Purchase
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            
            <Grid container spacing={2}>
            
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="purchase_voucher_no" style={{ position: 'unset' }}>Purchase
                  Voucher No</InputLabel>
                <Input id="purchase_voucher_no" aria-describedby="add-purchase-voucher_no"
                       onChange={onChangePurchaseVoucherNo} value={purchaseVoucherNo}/>
              </Grid>
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="vendor_name" style={{ position: 'unset' }}>Vendor
                  Name</InputLabel>
                <Input id="vendor_name" aria-describedby="add-vendor-name"
                       onChange={onChangeVendorName} value={vendorName}/>
              </Grid>
              

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="product_type"
                  id="product_type"
                  label="Product Type"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductType}
                  value={productType}
                >
                  <MenuItem value="0">
                    <em>Select Product Type</em>
                  </MenuItem>
                  <MenuItem value="1">Paper</MenuItem>
                  <MenuItem value="2">Plate</MenuItem>
                  
                </Select>
              </Grid>
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="product_code"
                  id="product_code"
                  label="Product Code"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductCode}
                  value={productCode}
                >
                  <MenuItem value="0">
                    <em>Select Product Code</em>
                  </MenuItem>
                  
                 { productData.map((product) => (
                    <MenuItem key={product.id} value={product.code}
                    onClick={onClickProductCode.bind(this, product.id)}>
                      {product.code}
                    </MenuItem>
                  ))
                 }
                
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
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
                   productData.map((product) => (
                    <MenuItem data-key={product.id} value={product.name} 
                    onChange={onClickProductName.bind(this, product.id)}>
                      {product.name}
                    </MenuItem>
                  ))
                  }

{/*
productData.map((product, index) => (
            product.name === productName && (
              <MenuItem key={index} value={product.name}>
                {product.name}
              </MenuItem>
            )
          ))
            */}
  
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="product_godown"
                  id="product_godown"
                  label="Product Godown"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeProductGodown}
                  value={productGodown}
                >
                  <MenuItem value="0">
                    <em>Select Godown</em>
                  </MenuItem>
                  <MenuItem value="1">1234</MenuItem>
                  <MenuItem value="2">1235</MenuItem>
                  
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_qty" style={{ position: 'unset' }}>Qty
                  </InputLabel>
                <Input id="product_qty" aria-describedby="add-product_qty"
                       onChange={onChangeProductQty} value={productQty}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_rate" style={{ position: 'unset' }}>Rate
                  </InputLabel>
                <Input id="product_rate" aria-describedby="add-product_rate"
                       onChange={onChangeProductRate} value={productRate}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_amount" style={{ position: 'unset' }}>Amount
                  </InputLabel>
                <Input id="product_amount" aria-describedby="add-product_amount"
                       onChange={onChangeProductAmount} value={productAmount}/>
              </Grid>
              
              <Button variant="contained" onClick={onClickAddButton}>Add</Button>
             
              
            </Grid>

            {/* Grid Table */}
            <Table>
<thead>
  <tr>
    <th>Product Code</th>
    <th>Product Name</th>
    <th>Godown</th>
    <th>Qty</th>
    <th>Rate</th>
    <th>Amount</th>
  </tr>
</thead>
<tbody>
{tableData.map((rowData, index) => (
  <tr key={index}>
  <td>{rowData.product_code}</td>
  <td>{rowData.product_name}</td>
  <td>{rowData.product_godown}</td>
  <td>{rowData.product_qty}</td>
  <td>{rowData.product_rate}</td>
  <td>{rowData.product_amount}</td>
  
</tr>
))}
</tbody>


            </Table>


            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" onClick={addPurchase}>Submit</Button>
            <Button variant="contained" onClick={closeAddPurchase}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
      <Head>
        <title>
          Purchases | Scholar CRM
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
                  Purchases
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
                  onClick={openAddPurchase}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Purchase
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