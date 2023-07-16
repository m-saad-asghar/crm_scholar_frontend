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
    
  },
  {
    title: 'Product - Category',
    path: '/products/category',
    icon: (
      <SvgIcon fontSize="small">
        <CategoryIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product - Subject',
    path: '/products/subject',
    icon: (
      <SvgIcon fontSize="small">
        <SubjectIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product - Paper',
    path: '/products/paper',
    icon: (
      <SvgIcon fontSize="small">
        <BlindsClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product - Paper Type',
    path: '/products/papertype',
    icon: (
      <SvgIcon fontSize="small">
        <BlindsClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product - Plates',
    path: '/products/plates',
    icon: (
      <SvgIcon fontSize="small">
        <BlindsClosedIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product - For Board',
    path: '/products/productfor',
    icon: (
      <SvgIcon fontSize="small">
        <WrapTextIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Product - Sheet Size',
    path: '/products/sheetsize',
    icon: (
      <SvgIcon fontSize="small">
        <WrapTextIcon />
      </SvgIcon>
    )
  },
  
  {
    title: 'Overview',
    path: '/',
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
    title: 'Godown',
    path: '/godown',
    icon: (
      <SvgIcon fontSize="small">
        <UsersIcon />
      </SvgIcon>
    )
  },
  
  {
    title: 'Companies',
    path: '/companies',
    icon: (
      <SvgIcon fontSize="small">
        <ShoppingBagIcon />
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
