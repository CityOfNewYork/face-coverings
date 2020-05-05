import proj4 from 'proj4'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default [{
  extendFeature() {
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
    return `${this.getBorough()} , NY`
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
    const time1 = this.get('time1')
    const time2 = this.get('time2')
    const result = $('<div class="when"><strong>Face covering distribution date: </strong></div>')
    if (date1) {
      result.append(`<div>${date1}, ${time1}</div>`)
    }
    if (date2) {
      result.find('strong').html('Face covering distribution dates: ')
      result.append(`<div>${date2}, ${time2}</div>`)
    }
    return result
  }
}]