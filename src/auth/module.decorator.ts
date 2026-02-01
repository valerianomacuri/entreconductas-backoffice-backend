// auth/module.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const ModulePermission = (moduleName: string) =>
  SetMetadata('module', moduleName);
