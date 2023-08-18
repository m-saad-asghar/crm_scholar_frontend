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
  import { SubjectPopup } from 'src/components/product/subject_modal';
  import { useSelector } from 'react-redux';
import { minWidth } from '@mui/system';

const tableHeaders = [
  "Actions",
  "Subject",
  
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


const useSubjects = (page, rowsPerPage, categories) => {
  return useMemo(
    () => {
      return applyPagination(categories, page, rowsPerPage);
    },
    [page, rowsPerPage, categories]
  );
};
const useSubjectsIds = (categories) => {
  return useMemo(
    () => {
      return categories.map((subject) => subject.id);
    },
    [categories]
  );
};


const Subject = () => {
  const auth_token = useSelector((state) => state.token);
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [SubjectModal, setSubjectModal] = useState(false);
  const [addSubjectModal, setAddSubjectModal] = useState(false);
  const [categories, setSubjects] = useState([]);
  const subject_data = useSubjects(page, rowsPerPage, categories);
  const categoriesIds = useSubjectsIds(categories);
  const [subjectID, setSubjectID] = useState('');
  const [subjectName, setSubjectName] = useState('');
  
  const categoriesSelection = useSelection(categoriesIds);
  const selectedSome = (categoriesSelection.selected.length > 0) && (categoriesSelection.selected.length < subject_data.length);
  const selectedAll = (subject_data.length > 0) && (categoriesSelection.selected.length === subject_data.length);
  const [currentData, setCurrentData] = useState('');
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [isDataLoading, setIsDataLoading] = useState(true);
  
  

  useEffect(() => {
    getSubjects();
    
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

  const getSubjects = () => {
    fetch(baseUrl + 'get_subjects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${auth_token}`,
      },
    })
      .then(response => response.json())
      .then(data => {
        setIsDataLoading(false);
        setSubjects(data.subject);
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
    {subject_data && subject_data.map((subject) => {
                  const isSelected = categoriesSelection.selected.includes(subject.id);
                  return (
                    <TableRow
                      hover
                      key={subject.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              categoriesSelection.handleSelectOne?.(subject.id);
                            } else {
                              categoriesSelection.handleDeselectOne?.(subject.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateSubject.bind(this, subject)} /></Button>
                          <Switch defaultChecked={subject.active == 1 ? true : false} onChange={onChangeEnable.bind(this, subject.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell style={{minWidth: 50}}>
                        {subject.subject}
                      </TableCell>
                     
                    </TableRow>
                  );
                })}
    </>
  }
  const handleUpdateSubject = (data) => {
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
    setSubjectModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_subject/' + data.id, {
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
  
  const openSubject = () => {
    setSubjectModal(true);
  };
  const closeSubject = () => {
    setSubjectModal(false);
    resetForm();
  };
  const resetForm = () => {
    
    setSubjectName('');
    setCurrentData('')
    
  };
  const closeSubjectModal = () => {
    setSubjectModal(false);
  }
   
  const onChangeSubjectName = (e) => {
    setSubjectName(e.target.value);
  };
  
  const getLatestSubjects = (data) => {
    setSubjects(data);
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
      <SubjectPopup 
      SubjectModal={SubjectModal}
      closeSubject={closeSubject}
      currentData={currentData}
      setSubjects={setSubjects}
      closeSubjectModal={closeSubjectModal}
      />
      <Head>
        <title>
          Subject | Scholar CRM
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
                  Subjects
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openSubject}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add Subject
                </Button>
              </div>
            </Stack>
            <ProductsSearch sendProducts={getLatestSubjects}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={categories.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
              sendSubjects={getLatestSubjects}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Subject.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Subject;