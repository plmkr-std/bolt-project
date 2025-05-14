import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.authState$.pipe(
    take(1),
    map(authState => {
      // if (authState.isAuthenticated) {
      //   return true;
      // }
      // else {
      //   router.navigate(['/auth/login']);
      //   return false;
      // }
      return true;
    })
  );
};