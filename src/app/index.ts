// App
export * from './app.component';
export * from './app.service';
export * from './app.routes';
export * from './common';
export * from './components';
export * from './services';
console.log('login-min component.....')
import { MissionService,DialogService,CanDeactivateGuard } from './services';

// Application wide providers
export const APP_PROVIDERS = [
  MissionService,
  DialogService,
  CanDeactivateGuard
];
