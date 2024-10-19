import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function marginErrorValidator(min: number, max: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value as string;
    if (value.length < min || value.length > max) {
      return { marginError: { minLength: min, maxLength: max, actualLength: value.length } };
    }
    return null;
  };
}

export function getMinDateRevision(dateRelease: string): string {
  if (!dateRelease) return '';
  const releaseDate = new Date(dateRelease);
  const revisionDate = new Date(releaseDate.setFullYear(releaseDate.getFullYear() + 1));
  return revisionDate.toISOString().split('T')[0];
}
