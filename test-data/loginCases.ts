import { loginTestData } from './loginData';

export type LoginValue = 'valid' | 'invalid' | 'blank' | 'long' | 'spaced';

export type LoginCase = {
  id: string;
  name: string;
  kind: 'valid' | 'rejected' | 'form';
  username: LoginValue;
  password: LoginValue;
  tags: string[];
};

export function resolveLoginValue(value: LoginValue, field: 'username' | 'password'): string {
  if (value === 'valid') return field === 'username' ? loginTestData.validUsername : loginTestData.validPassword;
  if (value === 'invalid') return field === 'username' ? loginTestData.invalidUsername : loginTestData.invalidPassword;
  if (value === 'long') return field === 'username' ? loginTestData.longUsername : loginTestData.longPassword;
  if (value === 'spaced') return field === 'username' ? `   ${loginTestData.validUsername}   ` : loginTestData.validPassword;
  return loginTestData.blank;
}
