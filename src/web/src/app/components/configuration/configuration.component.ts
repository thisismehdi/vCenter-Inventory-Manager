import { Component } from '@angular/core';

@Component({
  selector: 'app-configuration',
  templateUrl: './configuration.component.html',
  styleUrls: ['./configuration.component.css']
})
export class ConfigurationComponent {
//----------------calander-------------
  showDatePicker = false;
  selectedDate: string | null = null;

  toggleDatePicker() {
    this.showDatePicker = !this.showDatePicker;
  }

  onDateChange(event: Event) {
    const input = event.target as HTMLInputElement;
    this.selectedDate = input.value;
    console.log(this.selectedDate); // Handle the selected date here
    this.showDatePicker = false; // Close date picker after selection
  }

  //-------------------------------------
}
