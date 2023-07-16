import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import { subDays, subHours } from 'date-fns';
import ArrowDownOnSquareIcon from '@heroicons/react/24/solid/ArrowDownOnSquareIcon';
import ArrowUpOnSquareIcon from '@heroicons/react/24/solid/ArrowUpOnSquareIcon';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, TextField } from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { ProductsTable } from 'src/sections/products/products-table';
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
const useCustomers = (page, rowsPerPage, products) => {
  return useMemo(
    () => {
      return applyPagination(products, page, rowsPerPage);
    },
    [page, rowsPerPage, products]
  );
};

const useCustomerIds = (products) => {
  return useMemo(
    () => {
      return products.map((product) => product.id);
    },
    [products]
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
  const [inner_pages, setInnerPages] = useState('');
  const [rulePages, setRulePages] = useState('');
  const [farmay, setFarmay] = useState('');
  const [sheetSize, setSheetSize] = useState('0');
  const [loadSheetSizes, setLoadSheetSizes] = useState([]);
  const [titleSheetSize, setTitleSheetSize] = useState('0');
  const [loadTitleSizes, setLoadTitleSizes] = useState([]);
  const [bookWeight, setBookWeight] = useState('');
  const [bookFor, setBookFor] = useState('0');
  const [loadBookFor, setLoadBookFor] = useState([]);
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
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const customers = useCustomers(page, rowsPerPage, products);
  const customersIds = useCustomerIds(products);
  const [loadCategory, setLoadCategory] = useState([]);
  const [loadSubjects, setLoadSubjects] = useState([]);
  const [validationerrors, setValidationerrors] = useState({});
  const customersSelection = useSelection(customersIds);

  useEffect(() => {
    const data  = {
      search_term: ""
    }
    fetch(baseUrl + 'get_products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setProducts(data.products);
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

  const openAddProduct = () => {
    fetch(baseUrl + 'get_subjects',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadSubjects(data.subject);

    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_category',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadCategory(data.category);

    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_sheet_sizes',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadSheetSizes(data.sheets);

    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_sheet_sizes',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadTitleSizes(data.sheets);

    })
    .catch(error => console.error(error));

    fetch(baseUrl + 'get_book_for_board',{
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
    .then(response => response.json())
    .then(data => {
      setLoadBookFor(data.boards);

    })
    .catch(error => console.error(error));

    setAddProductModal(true);
  };
  const closeAddProduct = () => {
    setAddProductModal(false);
    resetForm();
  };
  const getLatestProducts = (data) => {
    setProducts(data);
  };
  const resetForm = () => {
    setProductBarCode('');
    setProductShortName('');
    setProductName('');
    setFacePrice('');
    setGrade('0');
    setPages('');
    setRulePages('');
    setInnerPages('');
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

  const validate = () => {
    let validationerrors = {};
    let isValid = true;


    if (productBarCode == null || productBarCode == "" || productBarCode == undefined) {
      isValid = false;
      validationerrors["productBarCode"] = "Bar Code is required.";
    }
    if (productShortName == null || productShortName == "" || productShortName == undefined) {
      isValid = false;
      validationerrors["productShortName"] = "Short Name is required.";
    }
    if (productName == null || productName == "" || productName == undefined) {
      isValid = false;
      validationerrors["productName"] = "Name is required.";
    }
    if (facePrice == null || facePrice == "" || facePrice == undefined) {
      isValid = false;
      validationerrors["facePrice"] = "Face Price is required.";
    }
    if (pages == null || pages == "" || pages == undefined) {
      isValid = false;
      validationerrors["pages"] = "Pages is required.";
    }
    if (inner_pages == null || inner_pages == "" || inner_pages == undefined) {
      isValid = false;
      validationerrors["inner_pages"] = "Inner Pages is required.";
    }
    if (rulePages == null || rulePages == "" || rulePages == undefined) {
      isValid = false;
      validationerrors["rulePages"] = "Rule Pages is required.";
    }
    if (farmay == null || farmay == "" || farmay == undefined) {
      isValid = false;
      validationerrors["farmay"] = "Farmay is required.";
    }
    if (sheetSize == null || sheetSize == 0 || sheetSize == undefined) {
      isValid = false;
      validationerrors["sheetSize"] = "Sheet Size is required.";
    }
    if (titleSheetSize == null || titleSheetSize == 0 || titleSheetSize == undefined) {
      isValid = false;
      validationerrors["titleSheetSize"] = "Title Sheet Size is required.";
    }
    if (bookWeight == null || bookWeight == "" || bookWeight == undefined) {
      isValid = false;
      validationerrors["bookWeight"] = "Book Weight is required.";
    }
    if (bookFor == null || bookFor == 0 || bookFor == undefined) {
      isValid = false;
      validationerrors["bookFor"] = "Book For is required.";
    }
    if (category == null || category == 0 || category == undefined) {
      isValid = false;
      validationerrors["category"] = "Category is required.";
    }
    if (subject == null || subject == 0 || subject == undefined) {
      isValid = false;
      validationerrors["subject"] = "Subject is required.";
    }

    setValidationerrors(validationerrors);

    return isValid;
  }
  const addProduct = () => {
    if (validate()){
      setIsProductLoading(true);
      const data = {
        product_bar_code: productBarCode,
        product_short_name: productShortName,
        product_name: productName,
        face_price: facePrice,
        grade: grade,
        pages: pages,
        inner_pages: inner_pages,
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
            setProducts(data.products)
            setAddProductModal(false);
          }else{
            toast.error("Something Went Wrong!")
          }
        })
        .catch(error => toast.error("Something Went Wrong!"))
        .finally(() => {
          setIsProductLoading(false);
        });
      closeAddProduct(true);
    }
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
                <TextField
                  id="product_barcode"
                  aria-describedby="add-product-barcode"
                  error={Boolean(validationerrors.productBarCode)}
                  onChange={onChangeProductBarcode}
                  value={productBarCode}
                  helperText={validationerrors.productBarCode || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_short_name" style={{ position: 'unset' }}>Product Short
                  Name</InputLabel>
                <TextField
                  id="product_short_name"
                  aria-describedby="add-product-shortname"
                  onChange={onChangeProductShortName}
                  value={productShortName}
                  error={Boolean(validationerrors.productShortName)}
                  helperText={validationerrors.productShortName || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="product_name" style={{ position: 'unset' }}>Product
                  Name</InputLabel>
                <TextField
                  id="product_name"
                  aria-describedby="add-product-name"
                  onChange={onChangeProductName}
                  value={productName}
                  error={Boolean(validationerrors.productName)}
                  helperText={validationerrors.productName || ""}
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="face_price" style={{ position: 'unset' }}>Face
                  Price</InputLabel>
                <TextField
                  id="face_price"
                  aria-describedby="add-face-price"
                  onChange={onChangeFacePrice}
                  value={facePrice}
                  error={Boolean(validationerrors.facePrice)}
                  helperText={validationerrors.facePrice || ""}
                  variant="standard"
                />
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
                <TextField
                  id="pages"
                  aria-describedby="add-pages"
                  onChange={onChangePages}
                  value={pages}
                  error={Boolean(validationerrors.pages)}
                  helperText={validationerrors.pages || ""}
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="inner_pages" style={{ position: 'unset' }}>Inner Pages</InputLabel>
                <TextField
                  id="inner_pages"
                  aria-describedby="add-inner-pages"
                  onChange={onChangeInnerPages}
                  value={inner_pages}
                  error={Boolean(validationerrors.inner_pages)}
                  helperText={validationerrors.inner_pages || ""}
                  variant="standard"
                />
              </Grid>

              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="rule_pages" style={{ position: 'unset' }}>Rule
                  Pages</InputLabel>
                <TextField
                  id="rule_pages"
                  aria-describedby="add-rule-pages"
                  onChange={onChangeRulePages}
                  value={rulePages}
                  error={Boolean(validationerrors.rulePages)}
                  helperText={validationerrors.rulePages || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="farmay" style={{ position: 'unset' }}>Amount of
                  Farmay</InputLabel>
                <TextField
                  id="farmay"
                  aria-describedby="add-farmay"
                  onChange={onChangeFarmay}
                  value={farmay}
                  error={Boolean(validationerrors.farmay)}
                  helperText={validationerrors.farmay || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <InputLabel htmlFor="book_weight" style={{ position: 'unset' }}>Book
                  Weight</InputLabel>
                <TextField
                  id="book_weight"
                  aria-describedby="add-book-weight"
                  onChange={onChangeBookWeight}
                  value={bookWeight}
                  error={Boolean(validationerrors.bookWeight)}
                  helperText={validationerrors.bookWeight || ""}
                  variant="standard"
                />
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <TextField
                  labelId="sheet_size"
                  id="sheet_size"
                  select
                  onChange={onChangeSheetSize}
                  style={{ minWidth: '95%' }}
                  value={sheetSize}
                  error={Boolean(validationerrors.sheetSize)}
                  helperText={validationerrors.sheetSize || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Sheet Size</em>
                  </MenuItem>
                  {
                    loadSheetSizes.map((sheets) => (
                      <MenuItem key={sheets.id} value={sheets.id}
                      >
                        {sheets.sheet}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <TextField
                  labelId="subject"
                  id="subject"
                  select
                  onChange={onChangeSubject}
                  style={{ minWidth: '95%' }}
                  value={subject}
                  error={Boolean(validationerrors.subject)}
                  helperText={validationerrors.subject || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Subject</em>
                  </MenuItem>
                  {
                    loadSubjects.map((subject) => (
                      <MenuItem key={subject.id} value={subject.id}>
                        {subject.subject}
                      </MenuItem>
                    ))
                  }
                </TextField>
              </Grid>
              <Grid item xs={12} sm={4} md={4} lg={4}>
                <TextField
                  labelId="book_for"
                  id="book_for"
                  select
                  onChange={onChangeBookFor}
                  style={{ minWidth: '95%' }}
                  value={bookFor}
                  error={Boolean(validationerrors.bookFor)}
                  helperText={validationerrors.bookFor || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Book For</em>
                  </MenuItem>
                  {
                    loadBookFor.map((boards) => (
                      <MenuItem key={boards.id} value={boards.id}>
                        {boards.name}
                      </MenuItem>
                    ))
                  }
                </TextField>
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
              <Grid item xs={12} sm={6} md={4} lg={6}>
                <TextField
                  labelId="category"
                  id="category"
                  select
                  onChange={onChangeCategory}
                  value={category}
                  style={{ minWidth: '95%' }}
                  error={Boolean(validationerrors.category)}
                  helperText={validationerrors.category || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Category</em>
                  </MenuItem>
                  {
                    loadCategory.map((items) => (
                      <MenuItem key={items.id} value={items.id}>
                        {items.category}
                      </MenuItem>
                    ))
                  }
                </TextField>
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
              <Grid item xs={12} sm={6} md={6} lg={6}>
                <TextField
                  labelId="title_sheet_size"
                  id="title_sheet_size"
                  select
                  onChange={onChangeTitleSheetSize}
                  value={titleSheetSize}
                  style={{ minWidth: '95%' }}
                  error={Boolean(validationerrors.subject)}
                  helperText={validationerrors.subject || ""}
                  variant="standard"
                >
                  <MenuItem value="0">
                    <em>Select Title Sheet Size</em>
                  </MenuItem>
                  {
                    loadTitleSizes.map((titles) => (
                      <MenuItem key={titles.id} value={titles.id}>
                        {titles.sheet}
                      </MenuItem>
                    ) )
                  }
                </TextField>
              </Grid>
            </Grid>
            {/*</FormControl>*/}
          </Typography>
          <Grid item xs={12} sm={4} md={4} lg={4}
                style={{ marginTop: 15, display: 'flex', justifyContent: 'space-between' }}>
            <Button variant="contained" disabled={isProductLoading}  onClick={closeAddProduct}>Cancel</Button>
            <Button variant="contained" disabled={isProductLoading} onClick={addProduct}> {isProductLoading ? (
              <CircularProgress
                size={20}
                style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
              />
            ) : 'Submit'}</Button>
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
            <ProductsSearch sendProducts={getLatestProducts}/>
            <ProductsTable
              count={products.length}
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
              sendProducts={getLatestProducts}
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