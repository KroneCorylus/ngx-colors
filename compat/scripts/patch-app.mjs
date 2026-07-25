import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { basename, join } from 'node:path';

const cwd = process.cwd();
const appDir = join(cwd, 'src', 'app');

const rootTs = ['app.ts', 'app.component.ts']
  .map((f) => join(appDir, f))
  .find(existsSync);

if (!rootTs) {
  console.error(
    `patch-app: no root component found in ${appDir} (contains: ${readdirSync(appDir).join(', ')})`,
  );
  process.exit(1);
}

const source = readFileSync(rootTs, 'utf8');
const className = source.match(/export class (\w+)/)?.[1];
if (!className) {
  console.error(`patch-app: could not read the class name from ${rootTs}`);
  process.exit(1);
}

const rootHtml = rootTs.replace(/\.ts$/, '.html');
const templateUrl = `./${basename(rootHtml)}`;

writeFileSync(rootHtml, readFileSync('/app/app.html', 'utf8'));
writeFileSync(
  rootTs,
  readFileSync('/app/app.ts.tpl', 'utf8')
    .replaceAll('__CLASS__', className)
    .replaceAll('__TEMPLATE_URL__', templateUrl),
);

const angularJsonPath = join(cwd, 'angular.json');
const angularJson = JSON.parse(readFileSync(angularJsonPath, 'utf8'));

for (const project of Object.values(angularJson.projects ?? {})) {
  const build = project.architect?.build ?? project.targets?.build;
  if (!build) continue;
  if (build.options) build.options.outputPath = 'dist/app';
  for (const config of Object.values(build.configurations ?? {})) {
    delete config.budgets;
  }
}

writeFileSync(angularJsonPath, `${JSON.stringify(angularJson, null, 2)}\n`);

console.log(
  `patch-app: rewrote ${basename(rootTs)} (class ${className}) and ${basename(rootHtml)}`,
);
