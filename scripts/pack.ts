import { exec } from 'node:child_process';
import fs from 'node:fs/promises';
import path from 'node:path';

import { glob } from 'glob';

const processCWD = process.cwd();

function execute(command: string, cwd: string) {
  return new Promise<void>((resolve, reject) => {
    exec(command, { cwd }, (error) => {
      if (error) {
        console.error(`exec error: ${error}`);
        reject(error);
        return;
      }
      resolve();
    });
  });
}

async function build(packagePath: string) {
  const cwd = path.join(processCWD, packagePath);

  return execute(`npm run build`, cwd);
}

async function bundle(packagePath: string) {
  const command = `npm pack --pack-destination ${processCWD}`;
  const cwd = path.join(processCWD, packagePath);

  return execute(command, cwd);
}

async function copy(bundle: string, destination: string) {
  const source = path.join(processCWD, bundle);
  const destinationPath = path.join(destination, bundle);

  await fs.copyFile(source, destinationPath);
}

async function install(bundles: string[], destination: string) {
  const bundlesStr = bundles.join(' ');
  const command = `npm install ${bundlesStr}`;

  return execute(command, destination);
}

async function main() {
  // Destination folder to install the packages
  const destination = '../crm';

  const auth = './packages/auth';
  const base = './packages/base';

  console.log('Build packages');
  await build(auth);
  await build(base);

  console.log('Bundle packages');
  await bundle(auth);
  await bundle(base);

  const bundles = await glob('*.tgz', { cwd: processCWD });
  const destinationAbs = path.join(processCWD, destination);

  console.log('Copy packages', bundles);
  await Promise.all(bundles.map((bundle) => copy(bundle, destinationAbs)));

  console.log('Install packages', bundles);
  await install(bundles, destinationAbs);
}

main();
