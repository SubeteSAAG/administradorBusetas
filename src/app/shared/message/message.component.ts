import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-message',
  standalone: true,
  imports: [],
  templateUrl: './message.component.html',
  styleUrl: './message.component.scss'
})
export class MessageComponent {

  @Input() title: string = '';
  @Input() colorTitle: string = '';
  @Input() description: string = '';
  @Input() icon: string = '';
  @Input() colorIcon: string = '';
  @Input() visible: boolean = false;
  @Output() closed: EventEmitter<void> = new EventEmitter<void>();


  closeMessage() {
    this.visible = false;
    this.closed.emit();
  }

}
