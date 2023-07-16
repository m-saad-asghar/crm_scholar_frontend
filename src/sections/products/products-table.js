import PropTypes from 'prop-types';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import {
  Avatar,
  Box,
  Card,
  Checkbox,
  Stack,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TablePagination,
  TableRow,
  Typography, Modal
} from '@mui/material';
import { Scrollbar } from 'src/components/scrollbar';
import { getInitials } from 'src/utils/get-initials';
import { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Input from '@mui/material/Input';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CircularProgress from '@mui/material/CircularProgress';

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

export const ProductsTable = (props) => {
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [currentId, setCurrentId] = useState({});
  const [updateProductModal, setUpdateProductModal] = useState(false);
  const [productBarCode, setProductBarCode] = useState('');
  const [productShortName, setProductShortName] = useState('');
  const [productName, setProductName] = useState('');
  const [facePrice, setFacePrice] = useState('');
  const [pages, setPages] = useState('');
  const [inner_pages, setInnerPages] = useState('');
  const [rulePages, setRulePages] = useState('');
  const [farmay, setFarmay] = useState('');
  const [sheetSize, setSheetSize] = useState('0');
  const [titleSheetSize, setTitleSheetSize] = useState('0');
  const [bookWeight, setBookWeight] = useState('');
  const [bookFor, setBookFor] = useState('0');
  const [category, setCategory] = useState('0');
  const [subject, setSubject] = useState('0');
  const [isProductLoading, setIsProductLoading] = useState(false);
  const handleUpdateProduct = (data) => {
    setCurrentId((data && data.id) ? data.id : '')
    setProductBarCode((data && data.product_code) ? data.product_code : '')
    setProductShortName((data && data.product_sname) ? data.product_sname : '')
    setProductName((data && data.product_name) ? data.product_name : '')
    setFacePrice((data && data.face_price) ? data.face_price : '')
    setPages((data && data.pages) ? data.pages : '')
    setInnerPages((data && data.inner_pages) ? data.inner_pages : '')
    setRulePages((data && data.rule_pages) ? data.rule_pages : '')
    setFarmay((data && data.amount_of_farmay) ? data.amount_of_farmay : '')
    setSheetSize((data && data.book_sheet_size) ? data.book_sheet_size : 0)
    setTitleSheetSize((data && data.title_sheet_size) ? data.title_sheet_size : 0)
    setBookWeight((data && data.weight) ? data.weight : '')
    setBookFor((data && data.book_for) ? data.book_for : 0)
    setCategory((data && data.category) ? data.category : 0)
    setSubject((data && data.subject) ? data.subject : 0)
    setUpdateProductModal(true);
  };
  const {
    count = 0,
    items = [],
    onDeselectAll,
    onDeselectOne,
    onPageChange = () => {},
    onRowsPerPageChange,
    onSelectAll,
    onSelectOne,
    page = 0,
    rowsPerPage = 0,
    selected = []
  } = props;

  const selectedSome = (selected.length > 0) && (selected.length < items.length);
  const selectedAll = (items.length > 0) && (selected.length === items.length);
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
  const onChangePages = (e) => {
    setPages(e.target.value);
  };
  const onChangeInnerPages = (e) => {
    setInnerPages(e.target.value);
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
  const onChangeCategory = (e) => {
    setCategory(e.target.value);
  };
  const onChangeSubject = (e) => {
    setSubject(e.target.value);
  };
  const closeUpdateProduct = () => {
    setUpdateProductModal(false);
    resetForm();
  };
  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked
    }
    fetch(baseUrl + 'change_status_product/' + id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        if (data.success == 0){
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
  };
  const resetForm = () => {
    setProductBarCode('');
    setProductShortName('');
    setProductName('');
    setFacePrice('');
    setPages('');
    setRulePages('');
    setFarmay('');
    setSheetSize('0');
    setTitleSheetSize('0');
    setBookWeight('');
    setBookFor('0');
    setCategory('0');
    setSubject('0');
    setCurrentId('');
  };
  const updateProduct = () => {
    setIsProductLoading(true);
    const data = {
      product_bar_code: productBarCode,
      product_short_name: productShortName,
      product_name: productName,
      face_price: facePrice,
      pages: pages,
      inner_pages: inner_pages,
      rule_pages: rulePages,
      farmay: farmay,
      sheet_size: sheetSize,
      title_sheet_size: titleSheetSize,
      book_weight: bookWeight,
      book_for: bookFor,
      category: category,
      subject: subject
    };

    fetch(baseUrl + 'update_product/' + currentId, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsProductLoading(false);
        if (data.success == 1){
          toast.success("Product is Successfully Updated!")
          props.sendProducts(data.products)
          setUpdateProductModal(false);
        }else{
          toast.error("Something Went Wrong!")
        }
      })
      .catch(error => toast.error("Something Went Wrong!"))
      .finally(() => {
        setIsProductLoading(false);
      });
  };

  return (
    <>
      <ToastContainer />
      {/*Update Product Modal*/}
      <Modal
        open={updateProductModal}
        onClose={closeUpdateProduct}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Update Product
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
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="pages" style={{ position: 'unset' }}>Pages</InputLabel>
                <Input id="pages" aria-describedby="add-pages" onChange={onChangePages}
                       value={pages}/>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="inner_pages" style={{ position: 'unset' }}>Inner Pages</InputLabel>
                <Input id="inner_pages" aria-describedby="add-inner-pages" onChange={onChangeInnerPages}
                       value={inner_pages}/>
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="rule_pages" style={{ position: 'unset' }}>Rule
                  Pages</InputLabel>
                <Input id="rule_pages" aria-describedby="add-rule-pages"
                       onChange={onChangeRulePages} value={rulePages}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="farmay" style={{ position: 'unset' }}>Amount of
                  Farmay</InputLabel>
                <Input id="farmay" aria-describedby="add-farmay" onChange={onChangeFarmay}
                       value={farmay}/>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="book_weight" style={{ position: 'unset' }}>Book
                  Weight</InputLabel>
                <Input id="book_weight" aria-describedby="add-book-weight"
                       onChange={onChangeBookWeight} value={bookWeight}/>
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
                  <MenuItem value="1">Physics</MenuItem>
                  <MenuItem value="2">Chemistry</MenuItem>
                  <MenuItem value="3">Math</MenuItem>
                  <MenuItem value="4">Biology</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
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
                  <MenuItem value="1">Federal Board</MenuItem>
                  <MenuItem value="2">Lahore Board</MenuItem>
                  <MenuItem value="3">Federal Board</MenuItem>
                  <MenuItem value="4">Lahore Board</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={4} lg={6}>
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
                  <MenuItem value="1">Objective</MenuItem>
                  <MenuItem value="2">Subjective</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={12} sm={6} md={6} lg={6}>
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
            </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isProductLoading}  onClick={closeUpdateProduct}>Cancel</Button>
            <Button variant="contained" disabled={isProductLoading} onClick={updateProduct}> {isProductLoading ? (
              <CircularProgress
                size={20}
                style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
              />
            ) : 'Submit'}</Button>
          </Grid>
        </Box>
      </Modal>
      <Card>
        <Scrollbar>
          <Box sx={{ minWidth: 800 }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedAll}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          onSelectAll?.();
                        } else {
                          onDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  <TableCell style={{minWidth: 100}}>
                    Barcode
                  </TableCell>
                  <TableCell style={{minWidth: 120}}>
                    Short name
                  </TableCell>
                  <TableCell style={{minWidth: 150}}>
                    Name
                  </TableCell>
                  <TableCell style={{minWidth: 120}}>
                    Face price
                  </TableCell>
                  <TableCell style={{minWidth: 100}}>
                    Pages
                  </TableCell>
                  <TableCell style={{minWidth: 120}}>
                    Inner pages
                  </TableCell>
                  <TableCell style={{minWidth: 120}}>
                    Rule pages
                  </TableCell>
                  <TableCell style={{minWidth: 100}}>
                    Farmay
                  </TableCell>
                  <TableCell style={{minWidth: 130}}>
                    Book weight
                  </TableCell>
                  <TableCell style={{minWidth: 120}}>
                    Sheet size
                  </TableCell>
                  <TableCell style={{minWidth: 100}}>
                    Subject
                  </TableCell>
                  <TableCell style={{minWidth: 120}}>
                    Book for
                  </TableCell>
                  <TableCell style={{minWidth: 100}}>
                    Category
                  </TableCell>
                  <TableCell style={{minWidth: 150}}>
                    Title Sheet size
                  </TableCell>
                  <TableCell style={{minWidth: 100}}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items && items.map((product) => {
                  const isSelected = selected.includes(product.id);

                  return (
                    <TableRow
                      hover
                      key={product.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              onSelectOne?.(product.id);
                            } else {
                              onDeselectOne?.(product.id);
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        {product.product_code}
                      </TableCell>
                      <TableCell>
                        {product.product_sname}
                      </TableCell>
                      <TableCell>
                        {product.product_name}
                      </TableCell>
                      <TableCell>
                        {product.face_price}
                      </TableCell>
                      <TableCell>
                        {product.pages}
                      </TableCell>
                      <TableCell>
                        {product.inner_pages}
                      </TableCell>
                      <TableCell>
                        {product.rule_pages}
                      </TableCell>
                      <TableCell>
                        {product.amount_of_farmay}
                      </TableCell>
                      <TableCell>
                        {product.weight}
                      </TableCell>
                      <TableCell>
                        {product.book_sheet_size}
                      </TableCell>
                      <TableCell>
                        {product.subject}
                      </TableCell>
                      <TableCell>
                        {product.book_for}
                      </TableCell>
                      <TableCell>
                        {product.category}
                      </TableCell>
                      <TableCell>
                        {product.title_sheet_size}
                      </TableCell>
                      <TableCell>
                        <Stack
                          alignItems="center"
                          direction="row"
                          spacing={2}
                        >
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateProduct.bind(this, product)} /></Button>
                          <Switch defaultChecked={product.active == 1 ? true : false} onChange={onChangeEnable.bind(this, product.id)}/>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </Box>
        </Scrollbar>
        <TablePagination
          component="div"
          count={count}
          onPageChange={onPageChange}
          onRowsPerPageChange={onRowsPerPageChange}
          page={page}
          rowsPerPage={rowsPerPage}
          rowsPerPageOptions={[5, 10, 25]}
        />
      </Card>
    </>
  );
};

ProductsTable.propTypes = {
  count: PropTypes.number,
  items: PropTypes.array,
  onDeselectAll: PropTypes.func,
  onDeselectOne: PropTypes.func,
  onPageChange: PropTypes.func,
  onRowsPerPageChange: PropTypes.func,
  onSelectAll: PropTypes.func,
  onSelectOne: PropTypes.func,
  page: PropTypes.number,
  rowsPerPage: PropTypes.number,
  selected: PropTypes.array
};