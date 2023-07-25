import NextLink from 'next/link';
import PropTypes from 'prop-types';
import { Box, ButtonBase } from '@mui/material';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

export const SideNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, children } = props;

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  const router = useRouter();

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Check if the URL path matches any of the child items' paths
    if (children) {
      const isChildHovered = children.some((child) => child.path === router.pathname);
      setIsHovered(isChildHovered);
    }
  }, [router.pathname, children]);

  // Function to handle mouse enter and set isHovered to true
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  // Function to handle mouse leave and set isHovered to false
  const handleMouseLeave = () => {
    if (children) {
      const isChildHovered = children.some((child) => child.path === router.pathname);
      if (isChildHovered && isChildHovered == true){

      }else{
        setIsHovered(false);
      }
    }
  };

  return (
    <li onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'neutral.400',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'common.white'
            }),
            ...(disabled && {
              color: 'neutral.500'
            })
          }}
        >
          {title}
        </Box>
      </ButtonBase>
      {/* Render sub-items */}
      {isHovered && children && children.length > 0 && (
        <ul style={{ listStyle: 'none' }}>
          {children.map((subItem, index) => (
            <ChildNavItem key={index} active={subItem.path === router.pathname} {...subItem} />
          ))}
        </ul>
      )}
    </li>
  );
};

export const ChildNavItem = (props) => {
  const { active = false, disabled, external, icon, path, title, children } = props;

  const linkProps = path
    ? external
      ? {
        component: 'a',
        href: path,
        target: '_blank'
      }
      : {
        component: NextLink,
        href: path
      }
    : {};

  return (
    <li>
      <ButtonBase
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          pl: '16px',
          pr: '16px',
          py: '6px',
          textAlign: 'left',
          width: '100%',
          ...(active && {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }),
          '&:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.04)'
          }
        }}
        {...linkProps}
      >
        {icon && (
          <Box
            component="span"
            sx={{
              alignItems: 'center',
              color: 'neutral.400',
              display: 'inline-flex',
              justifyContent: 'center',
              mr: 2,
              ...(active && {
                color: 'primary.main'
              })
            }}
          >
            {icon}
          </Box>
        )}
        <Box
          component="span"
          sx={{
            color: 'neutral.400',
            flexGrow: 1,
            fontFamily: (theme) => theme.typography.fontFamily,
            fontSize: 14,
            fontWeight: 600,
            lineHeight: '24px',
            whiteSpace: 'nowrap',
            ...(active && {
              color: 'common.white'
            }),
            ...(disabled && {
              color: 'neutral.500'
            })
          }}
        >
          {title}
        </Box>
      </ButtonBase>
      {/* Render sub-items */}
      {children && children.length > 0 && (
        <ul style={{ listStyle: 'none' }}>
          {isHovered && children.map((subItem, index) => (
            <ChildNavItem key={index}  active={subItem.path === router.pathname} {...subItem} />
          ))}
        </ul>
      )}
    </li>
  );
};

SideNavItem.propTypes = {
  active: PropTypes.bool,
  disabled: PropTypes.bool,
  external: PropTypes.bool,
  icon: PropTypes.node,
  path: PropTypes.string,
  title: PropTypes.string.isRequired
};
