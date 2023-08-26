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
import DataArrayIcon from '@mui/icons-material/DataArray';
import ArticleIcon from '@mui/icons-material/Article';
import PersonIcon from '@mui/icons-material/Person';
import ShopIcon from '@mui/icons-material/Shop';
import StorefrontIcon from '@mui/icons-material/Storefront';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SettingsIcon from '@mui/icons-material/Settings';
import PeopleIcon from '@mui/icons-material/People';


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
        title: 'Category',
        path: '/products/category',
      },
      {
        title: 'Subject',
        path: '/products/subject',
      },
      {
        title: 'Paper',
        path: '/products/paper',
      },
      {
        title: 'Paper Type',
        path: '/products/papertype',
      },
      {
        title: 'Plates',
        path: '/products/plates',
      },
      {
        title: 'For Board',
        path: '/products/productfor',
      },
      {
        title: 'Sheet Size',
        path: '/products/sheetsize',
      },
    ],
  },
  
  {
    title: 'Batch',
    path: '/process',
    icon: (
      <SvgIcon fontSize="small">
        <DataArrayIcon />
      </SvgIcon>
    ),
    children: [
      {
      title: 'Batch',
    path: '/process',
    },
    {
      title: 'Received Books',
    path: '/process/receivedfrombinder',
    },
    

    ],
  },
  {
    title: 'Vendor',
    path: '/vendor',
    icon: (
      <SvgIcon fontSize="small">
        <PersonIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Purchase Voucher',
    path: '/purchase',
    icon: (
      <SvgIcon fontSize="small">
        <ArticleIcon />
      </SvgIcon>
    ),
    children: [
      {
        title: 'Paper and Plate',
        path: '/purchase',
      },
      {
        title: 'Press',
        path: '/purchase/purchasevoucherpress',
      },
      {
        title: 'Lamination',
        path: '/purchase/purchasevoucherlamination',
      },
      {
        title: 'Binder',
        path: '/purchase/purchasevoucherbinder',
      },
      
    ],
  },
  {
    title: 'Purchase Order',
    path: '/purchaseorder',
    icon: (
      <SvgIcon fontSize="small">
        <ShopIcon />
      </SvgIcon>
    ),
    children: [
      
      {
        title: 'Press',
        path: '/purchaseorder/popress',
      },
      {
        title: 'Lamination',
        path: '/purchaseorder/polamination',
      },
      {
        title: 'Binder',
        path: '/purchaseorder/pobinder',
      },
    ],
  },
    
  {
    title: 'Godown',
    path: '/godown',
    icon: (
      <SvgIcon fontSize="small">
        <StorefrontIcon />
      </SvgIcon>
    )
  },
  
  
  {
    title: 'Account',
    path: '/account',
    icon: (
      <SvgIcon fontSize="small">
        <MonetizationOnIcon />
      </SvgIcon>
    ),
    children: [
      
      {
        title: 'Cash Payment',
        path: '/account/cashpayment',
      },
      {
        title: 'Bank Payment',
        path: '/account/bankpayment',
      },
    ]
  },
  {
    title: 'Profile Setting',
    path: '/profile_setting',
    icon: (
      <SvgIcon fontSize="small">
        <SettingsIcon />
      </SvgIcon>
    )
  },
  {
    title: 'Users',
    path: '/users',
    icon: (
      <SvgIcon fontSize="small">
        <PeopleIcon />
      </SvgIcon>
    )
  },
  // {
  //   title: 'Settings',
  //   path: '/settings',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <CogIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Login',
  //   path: '/auth/login',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <LockClosedIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Register',
  //   path: '/auth/register',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <UserPlusIcon />
  //     </SvgIcon>
  //   )
  // },
  // {
  //   title: 'Error',
  //   path: '/404',
  //   icon: (
  //     <SvgIcon fontSize="small">
  //       <XCircleIcon />
  //     </SvgIcon>
  //   )
  // }
];
