import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";
import ts from "typescript";
import {
  NgtscProgram,
  createCompilerHost,
  readConfiguration,
} from "@angular/compiler-cli";

const root = fileURLToPath(new URL("../../", import.meta.url));
assert(
  existsSync(resolve(root, "dist/ngx-colors/package.json")),
  "Run npm run build:lib before npm run test:api.",
);

const removedInputs = [
  "colorsAnimation",
  "format",
  "formats",
  "hideTextInput",
  "hideColorPicker",
  "attachTo",
  "overlayClassName",
  "acceptLabel",
  "cancelLabel",
  "colorPickerControls",
];
const removedExports = [
  "NgxColorsColor",
  "validColorValidator",
  "LegacyTriggerInputs",
  "legacyInputsToConfiguration",
  "translateLegacyPalette",
];
const fixtures = new Map(
  Object.entries({
    modern: String.raw`
    import { Component, NgModule } from '@angular/core';
    import { FormsModule } from '@angular/forms';
    import { NgxColorsComponent, NgxColorsTriggerDirective, NgxColorsModule, colorValidator } from 'ngx-colors';
    @Component({
      imports: [NgxColorsComponent, NgxColorsTriggerDirective, FormsModule],
      template: '<ngx-colors ngxColorsTrigger [(color)]="color" outputModel="HEXA" [allowedModels]="[\'RGBA\']" (userChange)="pick($event)" (sliderChange)="preview($event?.value)"></ngx-colors>'
    })
    export class StandaloneHost {
      color: string | null | undefined = '#ff0000';
      pick(value: string | null | undefined) {}
      preview(value: string | null | undefined) {}
    }
    @Component({ standalone: false, template: '<ngx-colors ngxColorsTrigger [(ngModel)]="color"></ngx-colors>' })
    export class ModuleHost { color = '#ff0000'; validator = colorValidator(); }
    @NgModule({ imports: [FormsModule, NgxColorsModule], declarations: [ModuleHost] })
    export class HostModule {}
  `,
    inputs: `
    import { Component } from '@angular/core';
    import { NgxColorsTriggerDirective } from 'ngx-colors';
    @Component({ imports: [NgxColorsTriggerDirective], template: '${removedInputs.map((name) => `<button ngxColorsTrigger [${name}]="value">Pick</button>`).join("")}' })
    export class RemovedInputsHost { value = ''; }
  `,
    exports: `import { ${removedExports.join(", ")} } from 'ngx-colors';`,
    outputs: `
    import { NgxColorsTriggerDirective } from 'ngx-colors';
    declare const picker: NgxColorsTriggerDirective;
    picker.change; picker.input; picker.slider;
  `,
    palette: `
    import { ColorOption } from 'ngx-colors';
    const palette: ColorOption[] = [{ preview: '#ff0000', variants: ['#00ff00'] }];
  `,
  }).map(([name, source]) => [resolve(root, `.api-check-${name}.ts`), source]),
);

const { options, errors } = readConfiguration(resolve(root, "tsconfig.json"));
assert.equal(errors.length, 0);
options.noEmit = true;
options.types = [];
const host = createCompilerHost({ options });
const originalGetSourceFile = host.getSourceFile.bind(host);
host.getSourceFile = (fileName, languageVersion, ...rest) =>
  fixtures.has(fileName)
    ? ts.createSourceFile(
        fileName,
        fixtures.get(fileName),
        languageVersion,
        true,
      )
    : originalGetSourceFile(fileName, languageVersion, ...rest);
const originalFileExists = host.fileExists.bind(host);
host.fileExists = (fileName) =>
  fixtures.has(fileName) || originalFileExists(fileName);
const originalReadFile = host.readFile.bind(host);
host.readFile = (fileName) =>
  fixtures.get(fileName) ?? originalReadFile(fileName);

const program = new NgtscProgram([...fixtures.keys()], options, host);
const diagnostics = [
  ...program.getTsOptionDiagnostics(),
  ...program.getNgOptionDiagnostics(),
  ...program.getTsSyntacticDiagnostics(),
  ...program.getTsSemanticDiagnostics(),
  ...program.getNgSemanticDiagnostics(),
].filter((diagnostic) => diagnostic.category === ts.DiagnosticCategory.Error);

const expected = {
  modern: [0, []],
  inputs: [removedInputs.length, [-998002]],
  exports: [removedExports.length, [2305, 2724]],
  outputs: [3, [2339, 2551]],
  palette: [1, [2353]],
};
for (const [name, [count, codes]] of Object.entries(expected)) {
  const found = diagnostics.filter(
    (diagnostic) =>
      diagnostic.file?.fileName === resolve(root, `.api-check-${name}.ts`),
  );
  const messages = found
    .map((diagnostic) =>
      ts.flattenDiagnosticMessageText(diagnostic.messageText, "\n"),
    )
    .join("\n");
  assert.equal(
    found.length,
    count,
    `${name}: unexpected diagnostics\n${messages}`,
  );
  assert(
    found.every((diagnostic) => codes.includes(diagnostic.code)),
    `${name}: unexpected error codes\n${messages}`,
  );
}
assert.equal(
  diagnostics.length,
  Object.values(expected).reduce((sum, [count]) => sum + count, 0),
);
console.log(
  "Public API checks passed: standalone and NgModule consumers compile; removed inputs, exports, outputs, and palette types fail compilation.",
);
