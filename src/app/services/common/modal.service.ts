import {Injectable} from "@angular/core";
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})

export class ModalService {
  private openModalSubject = new Subject<string>();
  openModal$ = this.openModalSubject.asObservable();

  private confirmSubject = new Subject<void>();
  private cancelSubject = new Subject<void>();

  confirm$ = this.confirmSubject.asObservable();
  cancel$ = this.cancelSubject.asObservable();

  private confirmationPromise?: (result: boolean) => void;

  open(message: string): Promise<boolean> {
    this.openModalSubject.next(message);
    return new Promise<boolean>((resolve) => {
      this.confirmationPromise = resolve;
    });
  }

  confirm() {
    if (this.confirmationPromise) {
      this.confirmationPromise(true);
      this.confirmationPromise = undefined;
    }
  }

  cancel() {
    if (this.confirmationPromise) {
      this.confirmationPromise(false);
      this.confirmationPromise = undefined;
    }
  }
}
