import fs from 'node:fs';
import path from 'node:path';

const tsc = () => 'tsc --noEmit';

const eslint = (fileNames: string[]) =>
  `eslint --fix ${fileNames.map((fileName) => path.relative(process.cwd(), fileName)).join(' ')}`;

const prettier = (fileNames: string[]) =>
  `prettier --write ${fileNames.map((fileName) => path.relative(process.cwd(), fileName)).join(' ')} --cache`;

const vitest = (fileNames: string[]) => {
  const testFiles = fileNames
    .flatMap((fileName) => {
      const relative = path.relative(process.cwd(), fileName);
      const withoutSource = relative.replace(/^src[\\/]/, '');
      const withoutExtension = withoutSource.replace(/\.ts$/, '');

      return [
        path.join('tests', 'unit', `${withoutExtension}.test.ts`),
        path.join('tests', 'integration', `${withoutExtension}.test.ts`)
      ];
    })
    .filter((testFile) => fs.existsSync(testFile));

  if (testFiles.length === 0) {
    return [];
  }

  return [`vitest run ${testFiles.map((f) => path.normalize(f)).join(' ')}`];
};

const config = {
  '*.{ts,mts,cts}': [tsc],
  '*.{js,mjs,cjs,ts,mts,cts}': [eslint, prettier],
  'src/**/*.ts': [vitest]
};

export default config;
