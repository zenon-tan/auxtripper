import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class FormatTimeService {

  constructor() { }

  formatToDisplayTime(localeTimeString: string) {
    let hour = Number.parseInt(localeTimeString.slice(0, 2))
    const minutes = localeTimeString.slice(3, 5)
    let AMPM = 'AM'
    if (hour > 12) {
      hour -= 12
      AMPM = 'PM'
    }
    return hour + ':' + minutes + AMPM
  }

  formatToTravelDate(time: string) {
    const result = time.slice(4, 15)
    return result
  }

  formatToFormTime(formTime: string) {
    return new Date(formTime.substring(0, 20) +
      '0:00 ' + formTime.substring(25))
  }

  calculateArrivalTime(date: Date, duration: number) {
    return new Date(date.getTime() + (duration * 1000)).toLocaleTimeString()
  }

  calculateDepartureTime(date: Date, duration: number) {
    return new Date(date.getTime() - (duration * 1000)).toLocaleTimeString()
  }

  formatToDisplayDuration(seconds: number) {
    const totalMinutes = (seconds - (seconds % 60)) / 60
    if (seconds / 60 > 60) {
      const minutes = totalMinutes % 60
      const hours = (totalMinutes - minutes) / 60
      return hours + 'h ' + minutes + 'm'
    }
    return totalMinutes + 'm'
  }

  formatToDisplayDurationDashboard(seconds: number) {
    const totalMinutes = (seconds - (seconds % 60)) / 60
    if (seconds / 60 > 60) {
      const minutes = totalMinutes % 60
      const hours = (totalMinutes - minutes) / 60
      return hours + ' hour ' + minutes + ' minutes'
    }
    return totalMinutes + ' minutes'
  }

  formatToDateTimePicker(time: string) {
    const hourNow = new Date().getHours()
    const timeString = time.toString()
    var hourString = ''
    if (hourNow < 10) {
      hourString = '0' + hourNow
    } else {
      hourString = hourNow.toString()
    }
    const result = timeString.slice(0, 16) + hourString + timeString.slice(18)
    return result
  }

  formatTimeForEmail(dateTime: Date) {

    let dateTimeToSend = new Date()
    let dateTimeToSendString = ''

    // if trip is in 24 hours, send email now
    if (dateTime.getTime() - new Date().getTime() > 0 &&
      dateTime.getTime() - new Date().getTime() <= 24 * 60 * 60 * 1000) {
      dateTimeToSend = new Date(new Date().getTime() + (60 * 1000))
    }
    //if trip is between 1 and 3 days, send tomorrow
    else if (24 * 60 * 60 * 1000 < dateTime.getTime() - new Date().getTime() &&
      dateTime.getTime() - new Date().getTime() <= 72 * 60 * 60 * 1000) {


      dateTimeToSend = new Date(new Date().getTime() + (24 * 60 * 60 * 1000))
    }

    // if trip is more than 3 days, send 2 days before
    else {
      dateTimeToSend = new Date(new Date().getTime() + (48 * 60 * 60 * 1000))
    }

    let dateArr = dateTimeToSend.toLocaleDateString().split('/')
    let localeTime = dateTimeToSend.toLocaleTimeString()

    dateTimeToSendString = dateArr[2] + '-' + dateArr[1] + '-' + dateArr[0] + 'T' + localeTime
    return dateTimeToSendString
  }

}
