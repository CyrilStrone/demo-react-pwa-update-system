import { CSS_VARS } from '@jenesei-software/jenesei-kit-react';
import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { useScreenWidth } from '@jenesei-software/jenesei-kit-react/context-screen-width';
import { Outlet } from '@tanstack/react-router';

export function LayoutPrivate() {
  const { breakpoint } = useScreenWidth(['breakpoint']);
  return (
    <Stack
      sx={{
        flexGrow: 1,
        padding: '26px',
        borderStyle: 'solid',
        borderColor: CSS_VARS.palette.fillDark,
        overflowY: 'auto',
        overflowX: 'hidden',
        height: 'fit-content',
        minHeight: '-webkit-fill-available',
        borderWidth: breakpoint !== 'mobile' ? '2px 0px 0px 2px' : '2px 0px 0px 0px',
      }}
    >
      Private layout
      <div>
        <Outlet />
      </div>
    </Stack>
  );
}
