// FIX: Commented out the reference to 'vite/client' to resolve the "Cannot find type definition file" error. This is a safe workaround as the application does not rely on `import.meta.env` types.
// /// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_KEY: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}