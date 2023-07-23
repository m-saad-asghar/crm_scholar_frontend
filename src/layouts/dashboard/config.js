import ChartBarIcon from '@heroicons/react/24/solid/ChartBarIcon';
import CogIcon from '@heroicons/react/24/solid/CogIcon';
import LockClosedIcon from '@heroicons/react/24/solid/LockClosedIcon';
import ShoppingBagIcon from '@heroicons/react/24/solid/ShoppingBagIcon';
import UserIcon from '@heroicons/react/24/solid/UserIcon';
import UserPlusIcon from '@heroicons/react/24/solid/UserPlusIcon';
import UsersIcon from '@heroicons/react/24/solid/UsersIcon';
import XCircleIcon from '@heroicons/react/24/solid/XCircleIcon';
import ProductIcon from '@mui/icons-material/ProductionQuantityLimits';
import CategoryIcon from '@mui/icons-material/Category';
import SubjectIcon from '@mui/icons-material/Subject';
import WrapTextIcon from '@mui/icons-material/WrapText';
import BlindsClosedIcon from '@mui/icons-material/BlindsClosed';
import PressIcon from '@mui/icons-material/Compress';
import PaperIcon from '@mui/icons-material/Note';
import { SvgIcon } from '@mui/material';

export const items = [
  {
    title: 'Products',
    path: '/products',
    icon: (
      <SvgIcon fontSize="small">
        <ProductIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: 'Products',
        path: '/products',
      },
      {
        title: 'Product - Category',
        path: '/products/category',
      },
      {
        title: 'Product - Subject',
        path: '/products/subject',
      },
      {
        title: 'Product - Paper',
        path: '/products/paper',
      },
      {
        title: 'Product - Paper Type',
        path: '/products/papertype',
      },
      {
        title: 'Product - Plates',
        path: '/products/plates',
      },
      {
        title: 'Product - For Board',
        path: '/products/productfor',
      },
      {
        title: 'Product - Sheet Size',
        path: '/products/sheetsize',
      },
    ],
  },
  
  {
    title: 'Batch',
    path: '/process',
    icon: (
      <SvgIcon fontSize="small">
        <ChartBarIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Vendor',
    path: '/vendor',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Purchase',
    path: '/purchase',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'PO For Press',
    path: '/purchase/popress',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Godown',
    path: '/godown',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  
  
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <UserIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Settings',
    path: '/settings',
    icon: (
      <SvgIcon fontSize="small">
        <CogIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Login',
    path: '/auth/login',
    icon: (
      <SvgIcon fontSize="small">
        <LockClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Register',
    path: '/auth/register',
    icon: (
      <SvgIcon fontSize="small">
        <UserPlusIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Error',
    path: '/404',
    icon: (
      <SvgIcon fontSize="small">
        <XCircleIcon />
      </SvgIcon>
    )
  }
];
