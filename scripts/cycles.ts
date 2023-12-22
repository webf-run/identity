import madge from 'madge';

async function main() {

  const results = await madge('./src', {
    baseDir: process.cwd(),
    includeNpm: false,
    tsConfig: './tsconfig.json',
    fileExtensions: ['ts', 'js', 'jsx', 'tsx'],
  });

  const deps = results.circular();

  if (deps.length > 0) {
    console.error('Circular dependencies found');
    console.table(deps);
    process.exit(1);
  }
}

main();
