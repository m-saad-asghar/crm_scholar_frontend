  import { useCallback, useMemo, useState, useEffect } from 'react';
  import Head from 'next/head';
  import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
  import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, TableRow , TableCell, Checkbox} from '@mui/material';
  import { useSelection } from 'src/hooks/use-selection';
  import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
  import { TableComponent } from 'src/components/table-component';
  import { ProductsSearch } from 'src/sections/products/products-search';
  import { applyPagination } from 'src/utils/apply-pagination';
  import { ToastContainer, toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
  import CircularProgress from '@mui/material/CircularProgress';
  import EditIcon from '@mui/icons-material/Edit';
  import Switch from '@mui/material/Switch';
  import { ProductPopup } from 'src/components/product/product_model';
  const tableHeaders = [
    "Actions",
    "Barcode",
    "Short Name",
    "Name",
    "Face Price",
    "Pages",
    "Inner Pages",
    "Rule Pages",
    "Farmay",
    "Book Weight",
    "Sheet Size",
    "Subject",
    "Book For",
    "Category",
    "Title Sheet Size"
  ];
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
  const useProducts = (page, rowsPerPage, products) => {
    return useMemo(
      () => {
        return applyPagination(products, page, rowsPerPage);
      },
      [page, rowsPerPage, products]
    );
  };

  const useProductIds = (products) => {
    return useMemo(
      () => {
        return products.map((product) => product.id);
      },
      [products]
    );
  };

  const Products = () => {
    const jwt_token = localStorage.getItem("jwt_token")
    const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [ProductModal, setProductModal] = useState(false);
    const [currentData, setCurrentData] = useState('');
    const [isDataLoading, setIsDataLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const product_data = useProducts(page, rowsPerPage, products);
    const productsIds = useProductIds(products);
    const productsSelection = useSelection(productsIds);
    const selectedSome = (productsSelection.selected.length > 0) && (productsSelection.selected.length < product_data.length);
  const selectedAll = (product_data.length > 0) && (productsSelection.selected.length === product_data.length);
    useEffect(() => {
      getProducts();
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

    const tableHeader = () => {
      return <>
                    <TableCell padding="checkbox">
                      <Checkbox
                        checked={(selectedAll)}
                        indeterminate={selectedSome}
                        onChange={(event) => {
                          if (event.target.checked) {
                            productsSelection.handleSelectAll?.();
                          } else {
                            productsSelection.handleDeselectAll?.();
                          }
                        }}
                      />
                    </TableCell>
                    
                    {tableHeaders && tableHeaders.map((header, index) => (
                      <TableCell key={index} style={{minWidth: 150}}>
                        {header}
                      </TableCell>
                    ))}
      </>
    }

    const tableBody = () => {
      return <>
      {product_data && product_data.map((product) => {
                    const isSelected = productsSelection.selected.includes(product.id);
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
                                productsSelection.handleSelectOne?.(product.id);
                              } else {
                                productsSelection.handleDeselectOne?.(product.id);
                              }
                            }}
                          />
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
                          {product.farmay}
                        </TableCell>
                        <TableCell>
                          {product.weight}
                        </TableCell>
                        <TableCell>
                          {product.book_sheet_size_label}
                        </TableCell>
                        <TableCell>
                          {product.subject_name}
                        </TableCell>
                        <TableCell>
                          {product.board_name}
                        </TableCell>
                        <TableCell>
                          {product.category_name}
                        </TableCell>
                        <TableCell>
                          {product.title_sheet_size_label}
                        </TableCell>
                      </TableRow>
                    );
                  })}
      </>
    }

    const handleUpdateProduct = (data) => {
      getUpdateData(data);
    };

    const closeProductModal = () => {
      setProductModal(false);
    }

    const onChangeEnable = (id, event) => {
      const data = {
        status: event.target.checked,
        id: id
      }
      changeStatus(data);
    };

    const getProducts = () => {
      const data  = {
        search_term: ""
      }
      fetch(baseUrl + 'get_products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${jwt_token}`,
        },
        body: JSON.stringify(data)
      })
        .then(response => response.json())
        .then(data => {
          setIsDataLoading(false);
          setProducts(data.products);
        })
        .catch(error => console.error(error));
    };
    const openProduct = () => {
      setProductModal(true);
    };
    const closeProduct = () => {
      setProductModal(false);
      setCurrentData('')
    };
    const getLatestProducts = (data) => {
      setProducts(data);
    };
    const getUpdateData = (data) => {
      setCurrentData(data);
      setProductModal(true);
    };
    const changeStatus = (data) => {
      fetch(baseUrl + 'change_status_product/' + data.id, {
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
        <ProductPopup 
        ProductModal={ProductModal}
        closeProduct={closeProduct}
        currentData={currentData}
        setProducts={setProducts}
        closeProductModal={closeProductModal}
        />
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
                </Stack>
                <div>
                  <Button
                    onClick={openProduct}
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
              <TableComponent
                tableHeader={tableHeader}
                tableBody={tableBody}
                count={products.length}
                onPageChange={handlePageChange}
                onRowsPerPageChange={handleRowsPerPageChange}
                page={page}
                rowsPerPage={rowsPerPage}
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