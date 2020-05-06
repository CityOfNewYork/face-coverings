import proj4 from 'proj4'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const TODAY = new Date().toISOString().split('T')[0]

const staleFeatures = []

const decorations = {
  extendFeature() {
    const date1 = this.get('date1') || '0000'
    const date2 = this.get('date2') || '0000'
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
      .addClass(this.cssClass())
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
    return this.get('location') || ''
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
  formatDate(col) {
    const iso = this.get(col)
    if (iso) {
      const parts = iso.split('-')
      const date = new Date(parts[0] * 1, parts[1] - 1, parts[2] * 1)
      return `${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`
    } 
  },
  timeHtml() {
    const date1 = this.formatDate('date1')
    const date2 = this.formatDate('date2')
    const times = {
      start_time1: this.get('start_time1'),
      end_time1: this.get('end_time1'),
      start_time2: this.get('start_time2'),
      end_time2: this.get('end_time2')
    }
    Object.keys(times).forEach(key => {
      const time = times[key].split(':')
      if (time[0] * 1 > 12) {
        times[key] = `${time[0] - 12}:${time[1]} PM`
      } else if (time[0] * 1 === 12) {
        times[key] = `${times[key]} PM`
      } else {
        times[key] = `${times[key]} AM`
      }
    })
    const result = $('<div class="when"><strong>Face covering distribution date: </strong></div>')
    if (date1 && date2) {
      result.find('strong').html('Face covering distribution dates: ')
    }
    if (date1) {
      result.append(`<div>${date1}, ${times.start_time1} - ${times.end_time1}</div>`)
    }
    if (date2) {
      result.append(`<div>${date2}, ${times.start_time2} - ${times.end_time2}</div>`)
    }
    return result
  }
}

export default {decorations, staleFeatures}