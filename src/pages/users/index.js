import { useCallback, useMemo, useState, useEffect } from 'react';
import Head from 'next/head';
import PlusIcon from '@heroicons/react/24/solid/PlusIcon';
import { Box, Button, Container, Stack, SvgIcon, Typography, Modal, TableRow , TableCell, Checkbox} from '@mui/material';
import { useSelection } from 'src/hooks/use-selection';
import { Layout as DashboardLayout } from 'src/layouts/dashboard/layout';
import { TableComponent } from 'src/components/table-component';
import { UsersSearch } from 'src/sections/users/users-search';
import { applyPagination } from 'src/utils/apply-pagination';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CircularProgress from '@mui/material/CircularProgress';
import EditIcon from '@mui/icons-material/Edit';
import Switch from '@mui/material/Switch';
import { UserPopup } from 'src/components/user/user_modal';
const tableHeaders = [
  "Actions",
  "Name",
  "Email",
  "Phone Number"
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
const useUsers = (page, rowsPerPage, users) => {
  return useMemo(
    () => {
      return applyPagination(users, page, rowsPerPage);
    },
    [page, rowsPerPage, users]
  );
};

const useUserIds = (users) => {
  return useMemo(
    () => {
      return users.map((user) => user.id);
    },
    [users]
  );
};

const Users = () => {
  const jwt_token = localStorage.getItem("jwt_token")
  const baseUrl = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [UserModal, setUserModal] = useState(false);
  const [currentData, setCurrentData] = useState('');
  const [isDataLoading, setIsDataLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const user_data = useUsers(page, rowsPerPage, users);
  const usersIds = useUserIds(users);
  const usersSelection = useSelection(usersIds);
  const selectedSome = (usersSelection.selected.length > 0) && (usersSelection.selected.length < user_data.length);
const selectedAll = (user_data.length > 0) && (usersSelection.selected.length === user_data.length);
  useEffect(() => {
    getUsers();
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
                          usersSelection.handleSelectAll?.();
                        } else {
                          usersSelection.handleDeselectAll?.();
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
    {user_data && user_data.map((user) => {
                  const isSelected = usersSelection.selected.includes(user.id);
                  return (
                    <TableRow
                      hover
                      key={user.id}
                      selected={isSelected}
                    >
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(event) => {
                            if (event.target.checked) {
                              usersSelection.handleSelectOne?.(user.id);
                            } else {
                              usersSelection.handleDeselectOne?.(user.id);
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
                          <Button><EditIcon style={{ fontSize: '20px' }} onClick={handleUpdateUser.bind(this, user)} /></Button>
                          <Switch defaultChecked={user.active == 1 ? true : false} onChange={onChangeEnable.bind(this, user.id)}/>
                        </Stack>
                      </TableCell>
                      <TableCell>
                        {user.name}
                      </TableCell>
                      <TableCell>
                        {user.email}
                      </TableCell>
                      <TableCell>
                        {user.phone}
                      </TableCell>
                    </TableRow>
                  );
                })}
    </>
  }

  const handleUpdateUser = (data) => {
    getUpdateData(data);
  };

  const closeUserModal = () => {
    setUserModal(false);
  }

  const onChangeEnable = (id, event) => {
    const data = {
      status: event.target.checked,
      id: id
    }
    changeStatus(data);
  };

  const getUsers = () => {
    const data  = {
      search_term: ""
    }
    fetch(baseUrl + 'get_users', {
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
        setUsers(data.users);
      })
      .catch(error => console.error(error));
  };
  const openUser = () => {
    setUserModal(true);
  };
  const closeUser = () => {
    setUserModal(false);
    setCurrentData('')
  };
  const getLatestUsers = (data) => {
    setUsers(data);
  };
  const getUpdateData = (data) => {
    setCurrentData(data);
    setUserModal(true);
  };
  const changeStatus = (data) => {
    fetch(baseUrl + 'change_status_user/' + data.id, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt_token}`,
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
      <UserPopup 
      UserModal={UserModal}
      closeUser={closeUser}
      currentData={currentData}
      setUsers={setUsers}
      closeUserModal={closeUserModal}
      />
      <Head>
        <title>
          Users | Scholar CRM
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
                  Users
                </Typography>
              </Stack>
              <div>
                <Button
                  onClick={openUser}
                  startIcon={(
                    <SvgIcon fontSize="small">
                      <PlusIcon/>
                    </SvgIcon>
                  )}
                  variant="contained"
                >
                  Add User
                </Button>
              </div>
            </Stack>
            <UsersSearch sendUsers={getLatestUsers}/>
            <TableComponent
              tableHeader={tableHeader}
              tableBody={tableBody}
              count={users.length}
              onPageChange={handlePageChange}
              onRowsPerPageChange={handleRowsPerPageChange}
              page={page}
              rowsPerPage={rowsPerPage}
            />
          </Stack>
        </Container>
      </Box>
    </>
  );
};

Users.getLayout = (page) => (
  <DashboardLayout>
    {page}
  </DashboardLayout>
);

export default Users;