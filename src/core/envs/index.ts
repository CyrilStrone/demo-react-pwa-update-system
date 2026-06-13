const description = import.meta.env.VITE_DEFAULT_DESCRIPTION;
const version = import.meta.env.VITE_APP_VERSION;
const name = import.meta.env.VITE_DEFAULT_NAME;
const nameShort = import.meta.env.VITE_DEFAULT_NAME_SHORT;
const themeColor = import.meta.env.VITE_DEFAULT_THEME_COLOR;
const mode = import.meta.env.VITE_NODE_ENV;
const basePath = import.meta.env.BASE_URL;

export const env = {
  description,
  version,
  name,
  nameShort,
  themeColor,
  mode,
  basePath,
};
