import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { SupabaseService } from '../services/supabase.service';

export const authGuard: CanActivateFn = (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  return supabaseService.getCurrentUser().then(user => {
    if (user) {
      return true;
    }

    router.navigate(['/auth/login']);
    return false;
  });
};

export const ownerGuard: CanActivateFn = (route, state) => {
  const supabaseService = inject(SupabaseService);
  const router = inject(Router);

  return supabaseService.getCurrentUser().then(async user => {
    if (!user) {
      router.navigate(['/auth/login']);
      return false;
    }

    const { data } = await supabaseService.query('users', { id: user.id });
    const userRole = data?.[0]?.role;

    if (userRole === 'owner' || userRole === 'professional') {
      return true;
    }

    router.navigate(['/auth/acesso-negado']);
    return false;
  });
};
