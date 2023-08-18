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
  import { CategoryPopup } from 'src/components/product/category_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Category",
  
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


const useCategories = (page, rowsPerPage, categories) => {
  return useMemo(
    () => {
      return applyPagination(categories, page, rowsPerPage);
    },
    [page, rowsPerPage, categories]
  );
};
const useCategoriesIds = (categories) => {
  return useMemo(
    () => {
      return categories.map((category) => category.id);
    },
    [categories]
  );
};


const Category = () => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [CategoryModal, setCategoryModal] = useState(false);
  const [addCategoryModal, setAddCategoryModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const category_data = useCategories(page, rowsPerPage, categories);
  const categoriesIds = useCategoriesIds(categories);
  const [categoryID, setCategoryID] = useState('');
  const [categoryName, setCategoryName] = useState('');
  
  const categoriesSelection = useSelection(categoriesIds);
  const selectedSome = (categoriesSelection.selected.length > 0) && (categoriesSelection.selected.length < category_data.length);
  const selectedAll = (category_data.length > 0) && (categoriesSelection.selected.length === category_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getCategories();
    
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

  const getCategories = () => {
    fetch(baseUrl + 'get_category', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setCategories(data.category);
      })
      .catch(error => console.error(error));
  }

  const tableHeader = () => {
    return <>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={(selectedAll)}
                      indeterminate={selectedSome}
                      onChange={(event) => {
                        if (event.target.checked) {
                          categoriesSelection.handleSelectAll?.();
                        } else {
                          categoriesSelection.handleDeselectAll?.();
                        }
                      }}
                    />
                  </TableCell>
                  
                  {tableHeaders && tableHeaders.map((header, index) => (
                    <TableCell key={index} style={{minWidth: 50}}>
                      {header}
                    </TableCell>
                  ))}
    </>
  }
  const tableBody = () => {
    return <>
    {category_data && category_data.map((category) => {
                  const isSelected = categoriesSelection.selected.includes(category.id);
                  return (
                    <TableRow
                      hover
                      key={category.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              categoriesSelection.handleSelectOne?.(category.id);
                            } else {
                              categoriesSelection.handleDeselectOne?.(category.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateCategory.bind(this, category)} /></Button>
                          <Switch defaultChecked={category.active == 1 ? true : false} onChange={onChangeEnable.bind(this, category.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {category.category}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdateCategory = (data) => {
    getUpdateData(data);
  };
  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked,
      id: id
    }
    changeStatus(data);
  };
  const getUpdateData = (data) => {
    setCurrentData(data);
    setCategoryModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_category/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
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
  
  const openCategory = () => {
    setCategoryModal(true);
  };
  const closeCategory = () => {
    setCategoryModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    setCategoryName('');
    setCurrentData('')
    
  };
  const closeCategoryModal = () => {
    setCategoryModal(false);
  }
   
  const onChangeCategoryName = (e) => {
    setCategoryName(e.target.value);
  };
  
  const getLatestCategories = (data) => {
    setCategories(data);
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
      <CategoryPopup 
      CategoryModal={CategoryModal}
      closeCategory={closeCategory}
      currentData={currentData}
      setCategories={setCategories}
      closeCategoryModal={closeCategoryModal}
      />
      <Head>
        <title>
          Category | Scholar CRM
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
                  Categories
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openCategory}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Category
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestCategories}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={categories.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendCategories={getLatestCategories}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Category.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Category;