import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {ToastComponent} from "./components/common/toast/toast.component";
import {ToastService} from "./services/common/toast.service";
import {ConfirmationModalComponent} from "./components/common/confirmation-modal/confirmation-modal.component";
import {ModalService} from "./services/common/modal.service";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, ToastComponent, ConfirmationModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  title = 'challenge';

  toast: { message: string, type: 'success' | 'error' | 'warning' } | null = null;
  showModal = false;
  modalMessage = '';

  constructor(
    private toastService: ToastService,
    private modalService: ModalService
  ) {}

  onModalConfirm() {
    this.modalService.confirm();
    this.showModal = false;
  }

  onModalCancel() {
    this.modalService.cancel();
    this.showModal = false;
  }

  ngOnInit(): void {
    this.toastService.getToast().subscribe(toast => {
      this.toast = toast;
    });
    this.modalService.openModal$.subscribe(message => {
      this.modalMessage = message;
      this.showModal = true;
    });
  }
}
