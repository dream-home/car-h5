// App
export * from './app.component';
// export * from './app.service';
export * from './app.routes';
export * from './common';
export * from './components';
export * from './services';


import { MissionService, DialogService, CanDeactivateGuard, AuthGuard, ThzsUtil } from './services';


// Application wide providers
export const APP_PROVIDERS = [
  MissionService,
  DialogService,
  CanDeactivateGuard,
  AuthGuard,
  ThzsUtil
];
