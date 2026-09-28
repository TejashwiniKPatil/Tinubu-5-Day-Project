import { PASSWORD, USERNAME } from './constants';

export const loginTestData = {
  validUsername: USERNAME,
  validPassword: PASSWORD,
  invalidUsername: 'InvalidUser123',
  longUsername: 'InvalidUser1234567890123456789012345678900000000000000000000000000000000000000000',
  invalidPassword: 'WrongPassword@123',
  longPassword: 'WrongPassword12345678901234567890123456789099999999999999999999999999999999999999',
  blank: '',
} as const;
