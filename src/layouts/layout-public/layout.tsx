import { Stack } from '@jenesei-software/jenesei-kit-react/component-stack';
import { Outlet } from '@tanstack/react-router';

export function LayoutPublic() {
  return (
    <Stack
      sx={{
        flexGrow: 1,
        flexDirection: 'column',
        padding: '20px',
        overflow: 'auto',
      }}
    >
      Public layout
      <Stack
        sx={{
          justifyContent: 'flex-end',
          width: '100%',
        }}
      ></Stack>
      <Stack
        sx={{
          width: '400px',
          flexDirection: 'column',
          gap: '45px',
          alignItems: 'stretch',
          justifyContent: 'center',
          flexGrow: 1,
          maxWidth: '-webkit-fill-available',
          paddingBottom: '38px',
        }}
      >
        <Outlet />
      </Stack>
    </Stack>
  );
}
