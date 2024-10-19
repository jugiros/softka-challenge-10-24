import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  private toastSubject = new BehaviorSubject<{ message: string, type: 'success' | 'error' | 'warning' } | null>(null);

  getToast(): Observable<{ message: string, type: 'success' | 'error' | 'warning' } | null> {
    return this.toastSubject.asObservable();
  }

  showToast(message: string, type: 'success' | 'error' | 'warning' = 'success'): void {
    this.toastSubject.next({ message, type });
    setTimeout(() => this.toastSubject.next(null), 10000);
  }
}
