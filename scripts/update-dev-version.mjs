import { writeFile } from 'node:fs/promises';
import { getPackages } from '@manypkg/get-packages';

import { sh } from './common.mjs';

async function getHighestDevTag(pkgs) {
  const promises = pkgs.map(async ({ packageJson }) => {
    const { name } = packageJson;
    const { stdout } = await sh(`npm view ${name} dist-tags.dev`);
    const current = stdout.replace(/\n$/, '');
    const number = current.split('.').at(-1) || '0';
    return Number(number);
  });

  const allVersions = await Promise.all(promises);
  return Math.max(...allVersions);
}

async function main() {
  const cwd = process.cwd();
  const { packages } = await getPackages(cwd);
  const pkgs = packages.filter((p) => !p.packageJson.private);

  const highestCurrent = await getHighestDevTag(pkgs);
  const nextVersionNumber = highestCurrent + 1;

  console.log(`highestCurrent = ${highestCurrent}`);
  console.log(`newVersion = ${nextVersionNumber}`);

  for (const pkg of pkgs) {
    const { packageJson } = pkg;
    const { name } = packageJson;

    const { stdout } = await sh(`npm view ${name} dist-tags.dev`);

    const current = stdout.replace(/\n$/, '');
    const newVersion = current.replace(/\.\d+$/, `.${nextVersionNumber}`);

    packageJson.version = newVersion;
    pkgs.forEach(({ packageJson }) => {
      if (packageJson.dependencies && packageJson.dependencies[name]) {
        packageJson.dependencies[name] = newVersion;
      }
    });
  }
  console.log(pkgs);

  //   await Promise.all(
  //     pkgs.map(async (pkg, index) =>
  //       writeFile(files[index], JSON.stringify(pkg, null, 2)),
  //     ),
  //   );
}

main()
  .then(() => console.log('done'))
  .catch(console.error)
  .finally(() => process.exit(0));
