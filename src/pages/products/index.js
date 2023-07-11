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

const Products = () => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [addProductModal, setAddProductModal] = useState(false);
  const [productBarCode, setProductBarCode] = useState('');
  const [productShortName, setProductShortName] = useState('');
  const [productName, setProductName] = useState('');
  const [facePrice, setFacePrice] = useState('');
  const [grade, setGrade] = useState('0');
  const [pages, setPages] = useState('');
  const [rulePages, setRulePages] = useState('');
  const [farmay, setFarmay] = useState('');
  const [sheetSize, setSheetSize] = useState('0');
  const [titleSheetSize, setTitleSheetSize] = useState('0');
  const [bookWeight, setBookWeight] = useState('');
  const [bookFor, setBookFor] = useState('0');
  const [binderProduct, setBinderProduct] = useState('0');
  const [warningLevel, setWarningLevel] = useState('');
  const [deadLevel, setDeadLevel] = useState('');
  const [openingStock, setOpeningStock] = useState('');
  const [manufacturer, setManufacturer] = useState('0');
  const [category, setCategory] = useState('0');
  const [type, setType] = useState('0');
  const [uom, setUom] = useState('0');
  const [edition, setEdition] = useState('0');
  const [subject, setSubject] = useState('0');
  const [isProductLoading, setIsProductLoading] = useState(false);
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

  const openAddProduct = () => {
    setAddProductModal(true);
  };
  const closeAddProduct = () => {
    setAddProductModal(false);
    resetForm();
  };
  const resetForm = () => {
    setProductBarCode('');
    setProductShortName('');
    setProductName('');
    setFacePrice('');
    setGrade('0');
    setPages('');
    setRulePages('');
    setFarmay('');
    setSheetSize('0');
    setTitleSheetSize('0');
    setBookWeight('');
    setBookFor('0');
    setBinderProduct('0');
    setWarningLevel('');
    setDeadLevel('');
    setOpeningStock('');
    setManufacturer('0');
    setCategory('0');
    setType('0');
    setUom('0');
    setEdition('0');
    setSubject('0');
  };
  const addProduct = () => {
    setIsProductLoading(true);
    const data = {
      product_bar_code: productBarCode,
      product_short_name: productShortName,
      product_name: productName,
      face_price: facePrice,
      grade: grade,
      pages: pages,
      rule_pages: rulePages,
      farmay: farmay,
      sheet_size: sheetSize,
      title_sheet_size: titleSheetSize,
      book_weight: bookWeight,
      book_for: bookFor,
      binder_product: binderProduct,
      warning_level: warningLevel,
      dead_level: deadLevel,
      opening_stock: openingStock,
      manufacturer: manufacturer,
      category: category,
      type: type,
      uom: uom,
      edition: edition,
      subject: subject
    };

      fetch(baseUrl + 'add_new_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setIsProductLoading(false);
          if (data.success == 1){
            toast.success("Product is Successfully Saved!")
            // Update Products
          }else{
            toast.error("Something Went Wrong!")
          }
        })
        .catch(error => toast.error("Something Went Wrong!"))
        .finally(() => {
          setIsProductLoading(false);
        });
  };
  const onChangeProductBarcode = (e) => {
    setProductBarCode(e.target.value);
  };
  const onChangeProductShortName = (e) => {
    setProductShortName(e.target.value);
  };
  const onChangeProductName = (e) => {
    setProductName(e.target.value);
  };
  const onChangeFacePrice = (e) => {
    setFacePrice(e.target.value);
  };
  const onChangeGrade = (e) => {
    setGrade(e.target.value);
  };
  const onChangePages = (e) => {
    setPages(e.target.value);
  };
  const onChangeRulePages = (e) => {
    setRulePages(e.target.value);
  };
  const onChangeFarmay = (e) => {
    setFarmay(e.target.value);
  };
  const onChangeSheetSize = (e) => {
    setSheetSize(e.target.value);
  };
  const onChangeTitleSheetSize = (e) => {
    setTitleSheetSize(e.target.value);
  };
  const onChangeBookWeight = (e) => {
    setBookWeight(e.target.value);
  };
  const onChangeBookFor = (e) => {
    setBookFor(e.target.value);
  };
  const onChangeBinderProduct = (e) => {
    setBinderProduct(e.target.value);
  };
  const onChangeWarningLevel = (e) => {
    setWarningLevel(e.target.value);
  };
  const onChangeDeadLevel = (e) => {
    setDeadLevel(e.target.value);
  };
  const onChangeOpeningStock = (e) => {
    setOpeningStock(e.target.value);
  };
  const onChangeManufacturer = (e) => {
    setManufacturer(e.target.value);
  };
  const onChangeCategory = (e) => {
    setCategory(e.target.value);
  };
  const onChangeType = (e) => {
    setType(e.target.value);
  };
  const onChangeUom = (e) => {
    setUom(e.target.value);
  };
  const onChangeEdition = (e) => {
    setEdition(e.target.value);
  };
  const onChangeSubject = (e) => {
    setSubject(e.target.value);
  };

  return (
    <>
      <ToastContainer />
      {/*Add Product Modal*/}
      <Modal
        open={addProductModal}
        onClose={closeAddProduct}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            + Add Product
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 4 }}>
            {/*<FormControl>*/}
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_barcode" style={{ position: 'unset' }}>Product
                  Barcode</InputLabel>
                <Input id="product_barcode" aria-describedby="add-product-barcode"
                       onChange={onChangeProductBarcode} value={productBarCode}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_short_name" style={{ position: 'unset' }}>Product Short
                  Name</InputLabel>
                <Input id="product_short_name" aria-describedby="add-product-shortname"
                       onChange={onChangeProductShortName} value={productShortName}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_name" style={{ position: 'unset' }}>Product
                  Name</InputLabel>
                <Input id="product_name" aria-describedby="add-product-name"
                       onChange={onChangeProductName} value={productName}/>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="face_price" style={{ position: 'unset' }}>Face
                  Price</InputLabel>
                <Input id="face_price" aria-describedby="add-face-price"
                       onChange={onChangeFacePrice} value={facePrice}/>
              </Grid>
              {/*
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="add_grades"
                  id="add_grades"
                  label="Add Grade"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeGrade}
                  value={grade}
                >
                  <MenuItem value="0">
                    <em>Select Grade</em>
                  </MenuItem>
                  <MenuItem value="9">9th</MenuItem>
                  <MenuItem value="10">10th</MenuItem>
                  <MenuItem value="11">11th</MenuItem>
                  <MenuItem value="12">12th</MenuItem>
                </Select>
              </Grid>
  */}
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="pages" style={{ position: 'unset' }}>Pages</InputLabel>
                <Input id="pages" aria-describedby="add-pages" onChange={onChangePages}
                       value={pages}/>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="rule_pages" style={{ position: 'unset' }}>Rule
                  Pages</InputLabel>
                <Input id="rule_pages" aria-describedby="add-rule-pages"
                       onChange={onChangeRulePages} value={rulePages}/>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <InputLabel htmlFor="farmay" style={{ position: 'unset' }}>Amount of
                  Farmay</InputLabel>
                <Input id="farmay" aria-describedby="add-farmay" onChange={onChangeFarmay}
                       value={farmay}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="sheet_size"
                  id="sheet_size"
                  label="Sheet Size"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeSheetSize}
                  value={sheetSize}
                >
                  <MenuItem value="0">
                    <em>Select Sheet Size</em>
                  </MenuItem>
                  <MenuItem value="1">23x36/8</MenuItem>
                  <MenuItem value="2">23x36/8</MenuItem>
                  <MenuItem value="3">23x36/8</MenuItem>
                  <MenuItem value="4">23x36/8</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="title_sheet_size"
                  id="title_sheet_size"
                  label="Title Sheet Size"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeTitleSheetSize}
                  value={titleSheetSize}
                >
                  <MenuItem value="0">
                    <em>Select Title Sheet Size</em>
                  </MenuItem>
                  <MenuItem value="1">23x36/4</MenuItem>
                  <MenuItem value="2">23x36/4</MenuItem>
                  <MenuItem value="3">23x36/4</MenuItem>
                  <MenuItem value="4">23x36/4</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="book_weight" style={{ position: 'unset' }}>Book
                  Weight</InputLabel>
                <Input id="book_weight" aria-describedby="add-book-weight"
                       onChange={onChangeBookWeight} value={bookWeight}/>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Select
                  labelId="book_for"
                  id="book_for"
                  label="Book For"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeBookFor}
                  value={bookFor}
                >
                  <MenuItem value="0">
                    <em>Select Book For</em>
                  </MenuItem>
                  <MenuItem value="federal">Federal Board</MenuItem>
                  <MenuItem value="lahore">Lahore Board</MenuItem>
                  <MenuItem value="federal">Federal Board</MenuItem>
                  <MenuItem value="lahore">Lahore Board</MenuItem>
                </Select>
              </Grid>
              {/*
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <Select
                  labelId="binder_product"
                  id="binder_product"
                  label="Binder Product"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeBinderProduct}
                  value={binderProduct}
                >
                  <MenuItem value="0">
                    <em>Select Binder Product</em>
                  </MenuItem>
                  <MenuItem value="1">23x36/16</MenuItem>
                  <MenuItem value="2">23x36/16</MenuItem>
                  <MenuItem value="3">23x36/16</MenuItem>
                  <MenuItem value="4">23x36/16</MenuItem>
                </Select>
              </Grid>
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="warning_level" style={{ position: 'unset' }}>Warning
                  Level</InputLabel>
                <Input id="warning_level" aria-describedby="add-warning-level"
                       onChange={onChangeWarningLevel} value={warningLevel}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="dead_level" style={{ position: 'unset' }}>Dead
                  Level</InputLabel>
                <Input id="dead_level" aria-describedby="add-dead-level"
                       onChange={onChangeDeadLevel} value={deadLevel}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="opening_stock" style={{ position: 'unset' }}>Opening
                  Stock</InputLabel>
                <Input id="opening_stock" aria-describedby="add-opening-stock"
                       onChange={onChangeOpeningStock} value={openingStock}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="manufacturer"
                  id="manufacturer"
                  label="Manufacturer"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeManufacturer}
                  value={manufacturer}
                >
                  <MenuItem value="0">
                    <em>Select Manufacturer</em>
                  </MenuItem>
                  <MenuItem value="scholar">Scholar Publishers</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                  <MenuItem value="scholar">Scholar Publishers</MenuItem>
                  <MenuItem value="other">Other</MenuItem>
                </Select>
              </Grid>
  */}
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="category"
                  id="category"
                  label="Category"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeCategory}
                  value={category}
                >
                  <MenuItem value="0">
                    <em>Select Category</em>
                  </MenuItem>
                  <MenuItem value="objective">Objective</MenuItem>
                  <MenuItem value="subjective">Subjective</MenuItem>
                </Select>
              </Grid>
              {/*
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="type"
                  id="type"
                  label="Type"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeType}
                  value={type}
                >
                  <MenuItem value="0">
                    <em>Select Type</em>
                  </MenuItem>
                  <MenuItem value="FD">Objective</MenuItem>
                  <MenuItem value="subjective">Subjective</MenuItem>
                </Select>
              </Grid>
              
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="uom"
                  id="uom"
                  label="UoM"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeUom}
                  value={uom}
                >
                  <MenuItem value="0">
                    <em>Select UoM</em>
                  </MenuItem>
                  <MenuItem value="piece">Piece</MenuItem>
                  <MenuItem value="bundle">Bundle</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="edition"
                  id="edition"
                  label="edition"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeEdition}
                  value={edition}
                >
                  <MenuItem value="0">
                    <em>Select Edition</em>
                  </MenuItem>
                  <MenuItem value="22">22 Edition</MenuItem>
                  <MenuItem value="21">21 Edition</MenuItem>
                </Select>
              </Grid>
*/}
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <Select
                  labelId="subject"
                  id="subject"
                  label="subject"
                  style={{ minWidth: '95%' }}
                  onChange={onChangeSubject}
                  value={subject}
                >
                  <MenuItem value="0">
                    <em>Select Subject</em>
                  </MenuItem>
                  <MenuItem value="physics">Physics</MenuItem>
                  <MenuItem value="chemistry">Chemistry</MenuItem>
                  <MenuItem value="math">Math</MenuItem>
                  <MenuItem value="biology">Biology</MenuItem>
                </Select>
              </Grid>
            </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isProductLoading} onClick={addProduct}> {isProductLoading ? (
              <CircularProgress
                size={20}
                style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
              />
            ) : 'Submit'}</Button>
            <Button variant="contained" disabled={isProductLoading}  onClick={closeAddProduct}>Cancel</Button>
          </Grid>
        </Box>
      </Modal>
      <Head>
        <title>
          Products | Scholar CRM
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
                  Products
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
                  onClick={openAddProduct}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Product
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

Products.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Products;