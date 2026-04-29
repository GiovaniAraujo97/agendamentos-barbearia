import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { routes } from './app.routes';
import { SupabaseService } from './core/services/supabase.service';
import { AuthService } from './core/services/auth.service';
import { AgendaService } from './features/agenda-publica/services/agenda.service';
import { PainelService } from './features/painel-salao/services/painel.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    SupabaseService,
    AuthService,
    AgendaService,
    PainelService
  ]
};
