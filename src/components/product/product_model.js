  import { Box, Button, Typography, Modal, TextField } from '@mui/material';
  import { useState, useEffect } from 'react';
  import CircularProgress from '@mui/material/CircularProgress';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import InputLabel from '@mui/material/InputLabel';
  import Grid from '@mui/material/Grid';
  import MenuItem from '@mui/material/MenuItem';
  import { useSelector } from 'react-redux';
  export const ProductPopup = (props) => {
    
    const jwt_token = localStorage.getItem('jwt_token');
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
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
    const [loadCategory, setLoadCategory] = useState([]);
    const [loadSubjects, setLoadSubjects] = useState([]);
    const [validationerrors, setValidationerrors] = useState({});
    const [currentId, setCurrentId] = useState('');
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

    useEffect(() => {
      
      const data = props.currentData;
      setCurrentId((data && data.id) ? data.id : '')
      setProductBarCode((data && data.product_code != null && data.product_code != undefined) ? data.product_code : '')
      setProductShortName((data && data.product_sname != null && data.product_sname != null) ? data.product_sname : '')
      setProductName((data && data.product_name != null && data.product_name != undefined) ? data.product_name : '')
      setFacePrice((data && data.face_price != null && data.face_price != undefined) ? data.face_price : '')
      setPages((data && data.pages != null && data.pages != undefined) ? data.pages : '')
      setInnerPages((data && data.inner_pages != null && data.inner_pages != undefined) ? data.inner_pages : '')
      setRulePages((data && data.rule_pages != null && data.rule_pages != undefined) ? data.rule_pages : '')
      setFarmay((data && data.farmay != null && data.farmay != undefined) ? data.farmay : '')
      setSheetSize((data && data.book_sheet_size != null && data.book_sheet_size != undefined) ? data.book_sheet_size : 0)
      setTitleSheetSize((data && data.title_sheet_size != null && data.title_sheet_size != undefined) ? data.title_sheet_size : 0)
      setBookWeight((data && data.weight != null && data.weight != undefined) ? data.weight : '')
      setBookFor((data && data.book_for != null && data.book_for != undefined) ? data.book_for : 0)
      setCategory((data && data.category != null && data.category != undefined) ? data.category : 0)
      setSubject((data && data.subject != null && data.subject != undefined) ? data.subject : 0)
    }, [props.currentData]);

    useEffect(() => {
      if(props.currentData == '' || props.currentData == null || props.currentData == undefined){
        resetForm();
      }
      getSubjects();
      getCategories();
      getSheetSizes();
      getTitleSizes();
      getBoards();
    }, []);

    const getSubjects = () => {
      fetch(baseUrl + 'get_subjects',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setLoadSubjects(data.subject);

        })
        .catch(error => console.error(error));
    };
    const getCategories = () => {
      fetch(baseUrl + 'get_category',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setLoadCategory(data.category);

        })
        .catch(error => console.error(error));
    };
    const getSheetSizes = () => {
      fetch(baseUrl + 'get_sheet_sizes',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setLoadSheetSizes(data.sheets);

        })
        .catch(error => console.error(error));
    };
    const getTitleSizes = () => {
      fetch(baseUrl + 'get_sheet_sizes',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setLoadTitleSizes(data.sheets);

        })
        .catch(error => console.error(error));
    };
    const getBoards = () => {
      fetch(baseUrl + 'get_book_for_board',{
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
      })
        .then(response => response.json())
        .then(data => {
          setLoadBookFor(data.boards);

        })
        .catch(error => console.error(error));
    };

    const closeProduct = () => {
      props.closeProduct();
      setValidationerrors({})
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
    const onChangeCategory = (e) => {
      setCategory(e.target.value);
    };
    const onChangeSubject = (e) => {
      setSubject(e.target.value);
    };
    const validate = () => {
      let validationerrors = {};
      let isValid = true;
      if (productBarCode === null || productBarCode === "" || productBarCode === undefined) {
        isValid = false;
        validationerrors["productBarCode"] = "Bar Code is required.";
      }
      if (productShortName === null || productShortName === "" || productShortName === undefined) {
        isValid = false;
        validationerrors["productShortName"] = "Short Name is required.";
      }
      if (productName === null || productName === "" || productName === undefined) {
        isValid = false;
        validationerrors["productName"] = "Name is required.";
      }
      if (facePrice === null || facePrice === "" || facePrice === undefined) {
        isValid = false;
        validationerrors["facePrice"] = "Face Price is required.";
      }
      if (pages === null || pages === "" || pages === undefined) {
        isValid = false;
        validationerrors["pages"] = "Pages is required.";
      }
      if (inner_pages === null || inner_pages === "" || inner_pages === undefined) {
        isValid = false;
        validationerrors["inner_pages"] = "Inner Pages is required.";
      }
      if (rulePages === null || rulePages === "" || rulePages === undefined) {
        isValid = false;
        validationerrors["rulePages"] = "Rule Pages is required.";
      }
      if (farmay === null || farmay === "" || farmay === undefined) {
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
      if (bookWeight === null || bookWeight === "" || bookWeight === undefined) {
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
    const submitProduct = () => {
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
        if (currentId == ''){
          addNewProduct(data);
        }else{
          updateProduct(data);
        }
      }
    }

    const addNewProduct = (data) => {
      fetch(baseUrl + 'add_new_product', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setIsProductLoading(false);
          if (data.success == 1){
            toast.success("Product is Successfully Saved!")
            props.setProducts(data.products)
          props.closeProductModal();
            resetForm();
          }else{
            toast.error("Something Went Wrong!")
          }
        })
        .catch(error => toast.error("Something Went Wrong!"))
        .finally(() => {
          setIsProductLoading(false);
        });
      closeProduct(true);
    };
    const updateProduct = (data) => {
      fetch(baseUrl + 'update_product/' + currentId, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          console.log("data", data)
          setIsProductLoading(false);
          if (data.success == 1){
            toast.success("Product is Successfully Updated!")
            props.setProducts(data.products)
            props.closeProductModal();
            resetForm();
          }else{
            toast.error("Something Went Wrong!")
          }
        })
        .catch(error => toast.error("Something Went Wrong!"))
        .finally(() => {
          setIsProductLoading(false);
        });
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
      setValidationerrors({});
      setCurrentId('');
    };
    return (
    <>
      <ToastContainer />
    <Modal
          open={props.ProductModal}
          onClose={props.closeProduct}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              {currentId == '' ? "+ Add Product" : "Update Product"}
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 4 }}>
              {/*<FormControl>*/}
              <Grid container spacing={2}>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="product_barcode" style={{ position: 'unset' }}>Product
                    Barcode</InputLabel>
                  <TextField
                    id="product_barcode"
                    aria-describedby="product-barcode"
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
                    aria-describedby="product-shortname"
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
                    aria-describedby="product-name"
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
                    aria-describedby="face-price"
                    onChange={onChangeFacePrice}
                    value={facePrice}
                    error={Boolean(validationerrors.facePrice)}
                    helperText={validationerrors.facePrice || ""}
                    variant="standard"
                  />
                </Grid>
                <Grid item xs={12} sm={4} md={4} lg={4}>
                  <InputLabel htmlFor="pages" style={{ position: 'unset' }}>Pages</InputLabel>
                  <TextField
                    id="pages"
                    aria-describedby="pages"
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
                    aria-describedby="inner-pages"
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
                    aria-describedby="rule-pages"
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
                    aria-describedby="farmay"
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
                    aria-describedby="book-weight"
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
                <Grid item xs={12} sm={6} md={6} lg={6}>
                  <TextField
                    labelId="title_sheet_size"
                    id="title_sheet_size"
                    select
                    onChange={onChangeTitleSheetSize}
                    value={titleSheetSize}
                    style={{ minWidth: '95%' }}
                    error={Boolean(validationerrors.titleSheetSize)}
                    helperText={validationerrors.titleSheetSize || ""}
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
              <Button variant="contained" disabled={isProductLoading}  onClick={closeProduct}>Cancel</Button>
              <Button variant="contained" disabled={isProductLoading} onClick={submitProduct}> {isProductLoading ? (
                <CircularProgress
                  size={20}
                  style={{ position: 'absolute', top: '50%', left: '50%', marginTop: -10, marginLeft: -10, color: '#ffffff' }}
                />
              ) : 'Submit'}</Button>
            </Grid>
          </Box>
        </Modal>
    </>
    );
  };