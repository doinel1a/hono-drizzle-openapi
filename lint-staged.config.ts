import path from 'node:path';

const tsc = () => 'tsc --noEmit';

const eslint = (fileNames: string[]) =>
  `eslint --fix ${fileNames.map((fileName) => path.relative(process.cwd(), fileName)).join(' ')}`;

const prettier = (fileNames: string[]) =>
  `prettier --write ${fileNames.map((fileName) => path.relative(process.cwd(), fileName)).join(' ')} --cache`;

const config = {
  '*.{ts,mts,cts}': [tsc],
  '*.{js,mjs,cjs,ts,mts,cts}': [eslint, prettier]
};

export default config;
