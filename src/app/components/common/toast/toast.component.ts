import {Component, Input} from '@angular/core';
import {NgClass, NgIf} from "@angular/common";

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [
    NgClass,
    NgIf
  ],
  templateUrl: './toast.component.html',
  styleUrl: './toast.component.css'
})
export class ToastComponent {

  @Input() message!: string;
  @Input() type: 'success' | 'error' | 'warning' = 'success';
  show: boolean = true;

  ngOnInit(): void {
    setTimeout(() => this.hideToast(), 100000000);
  }

  hideToast(): void {
    this.show = false;
  }

}
