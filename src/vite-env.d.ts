/// <reference types="vite/client" />

declare module "*.jpg?inline" {
  const src: string;
  export default src;
}

declare module "*.png?inline" {
  const src: string;
  export default src;
}

