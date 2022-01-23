import { HttpContextToken } from '@angular/common/http';

export const IS_PUBLIC_API = new HttpContextToken<boolean>(() => false);
