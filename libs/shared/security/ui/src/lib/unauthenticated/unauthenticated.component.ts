import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'security-unauthenticated',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './unauthenticated.component.html',
  styleUrls: ['./unauthenticated.component.scss']
})
export class UnauthenticatedComponent {

}
