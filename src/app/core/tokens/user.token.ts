import { InjectionToken } from '@angular/core';
import { User } from '../../interfaces/user.interface';
import { Observable } from 'rxjs';

export const USER_DATA = new InjectionToken<Observable<User | null>>('Current logged in user');
