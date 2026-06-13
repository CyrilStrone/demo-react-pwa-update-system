import { ProviderPWA } from '@local/contexts/context-pwa';
import { LayoutErrorBoundary } from '@local/layouts/layout-error';
import { LayoutRouter } from '@local/layouts/layout-router';

import { ProviderDialog } from '@jenesei-software/jenesei-kit-react/context-dialog';
import { ProviderGeolocation } from '@jenesei-software/jenesei-kit-react/context-geolocation';
import { ProviderPermission } from '@jenesei-software/jenesei-kit-react/context-permission';
import { ProviderScreenWidth } from '@jenesei-software/jenesei-kit-react/context-screen-width';

function App() {
  return (
    <ProviderScreenWidth>
      <LayoutErrorBoundary>
        <ProviderPermission>
          <ProviderGeolocation>
            <ProviderDialog zIndex={1000}>
              <ProviderPWA>
                <LayoutRouter />
              </ProviderPWA>
            </ProviderDialog>
          </ProviderGeolocation>
        </ProviderPermission>
      </LayoutErrorBoundary>
    </ProviderScreenWidth>
  );
}

export default App;
