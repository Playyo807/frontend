// /Users/adrianbezerra/coding/projetos_teste/SQLite_Node/frontend/google-libphonenumber.d.ts

declare module 'google-libphonenumber' {
  export class PhoneNumberUtil {
    constructor();
    getInstance(): void;
    parse(number: string, region?: string): any;
    format(number: any, format: number): string;
    isValidNumber(number: any): boolean;
    getNumberType(number: any): number;
    getRegionCodeForNumber(number: any): string;
    formatInOriginalFormat(number: any, region?: string): string;
    formatNationalNumber(number: any): string;
    formatNumberForMobileDialing(number: any, region: string): string;
  }

  export const PhoneNumberFormat: {
    E164: number;
    INTERNATIONAL: number;
    NATIONAL: number;
    RFC3966: number;
  };
}