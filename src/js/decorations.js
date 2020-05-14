import $ from 'jquery'
import proj4 from 'proj4'
import nyc from 'nyc-lib/nyc'


const NOW_TODAY = new Date()

const today_yyyy = NOW_TODAY.getFullYear().toString()
const today_mm = (NOW_TODAY.getMonth() + 1).toString().padStart(2, '0')
const today_dd = NOW_TODAY.getDate().toString().padStart(2, '0')

const TODAY = `${today_yyyy}-${today_mm}-${today_dd}`

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const staleFeatures = []

const decorations = {
  extendFeature() {
    const date1 = this.get('date1')
    const date2 = this.get('date2')
    const fresh = date1 >= TODAY || date2 >= TODAY
    if (!fresh) {
      console.warn('Stale Location:', this.getProperties())
      staleFeatures.push(this)
    }
    this.set(
      'search_label',
      '<b><span class="srch-lbl-lg">' + this.getName() + 
      '</span></b><br><span class="srch-lbl-sm">' + this.getAddress1() + '</span>'
    )
  },
  html() {
    return $('<div class="facility"></div>')
      .append(this.distanceHtml())
      .append(this.nameHtml())
      .append(this.distanceHtml(true))
      .append(this.addressHtml())
      .append(this.timeHtml())
      .append(this.mapButton())
      .append(this.directionsButton())
      .data('feature', this)
      .mouseover($.proxy(this.handleOver, this))
      .mouseout($.proxy(this.handleOut, this))
  },
  getFullAddress() {
    const coord = proj4('EPSG:2263', 'EPSG:4326', [this.get('x') * 1, this.get('y') * 1])
    return `${coord[1]},${coord[0]}`
  },
  getName() {
    return this.get('name')
  },
  getAddress1() {
    return this.get('location')
  },
  getBorough() {
    return {
      '1': 'Manhattan',
      '2': 'Bronx',
      '3': 'Brooklyn',
      '4': 'Queens',
      '5': 'Staten Island'
    }[this.get('boro')]
  },
  getCityStateZip() {
    return `${this.getBorough()}, NY`
  },
  getTip() {
    return this.get('search_label')
  },
  formatDate(iso) {
    if (iso) {
      const parts = iso.split('-')
      const date = new Date(parts[0] * 1, parts[1] - 1, parts[2] * 1)
      return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    } 
  },
  formatTime(hh24) {
    if (hh24) {
      const time = hh24.split(':')
      if (time[0] * 1 > 12) {
        return `${time[0] - 12}:${time[1]} PM`
      } else if (time[0] * 1 === 12) {
        return `${hh24} PM`
      } else {
        return `${time[0] * 1}:${time[1]} AM`
      }
    } 
  },
  timeHtml() {
    const date1 = this.get('date1')
    const date2 = this.get('date2')
    const text = date1 >= TODAY && date2 >= TODAY ? 'dates' : 'date'
    const result = $(`<div class="when"><strong>Face covering distribution ${text}: </strong></div>`)
    const dates = [
      {date: date1, start: this.get('start_time1'), end: this.get('end_time1')}, 
      {date: date2, start: this.get('start_time2'), end: this.get('end_time2')}
    ]
    dates.sort((a, b) => {
      if (`${a.date} ${a.start}` > `${b.date} ${b.start}`) return 1
      if (`${a.date} ${a.start}` < `${b.date} ${b.start}`) return -1
      return 0
    })
    dates.forEach(date => {
      if (date.date >= TODAY) {
        result.append(`<div>${this.formatDate(date.date)}, ${this.formatTime(date.start)} - ${this.formatTime(date.end)}</div>`)
      }
    })
    return result
  }
}

export default {decorations, staleFeatures}