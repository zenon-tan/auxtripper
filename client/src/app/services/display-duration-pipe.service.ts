import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { FormatTimeService } from './format-time.service';

@Injectable({
  providedIn: 'root'
})

@Pipe({ name: 'displayDuration' })
export class DisplayDurationPipeService implements PipeTransform {

  constructor(private formatTimeService: FormatTimeService) {}

  transform(duration: number) {
    return this.formatTimeService.formatToDisplayDurationDashboard(duration)
  }
}
