import proj4 from 'proj4'

export default [{
  extendFeature: function() {
    this.set(
      'search_label',
      '<b><span class="srch-lbl-lg">' + this.getName() + 
      '</span></b><br><span class="srch-lbl-sm">' + this.getAddress1() + '</span>'
    )
  },
  html: function() {
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
  getFullAddress: function() {
    const coord = proj4('EPSG:2263', 'EPSG:4326', [this.get('X'), this.get('Y')])
    return coord[1] + ',' + coord[0]
  },
  getName: function() {
    return this.get('Park')
  },
  getAddress1: function() {
    return this.get('Site') || ''
  },
  getBorough: function() {
    return {
      MN: 'Manhattan',
      BX: 'Bronx',
      QNS: 'Queens',
      BK: 'Brooklyn',
      SI: 'Staten Island'
    }[this.get('Boro')]
  },
  getCityStateZip: function() {
    return this.getBorough() + ', NY'
  },
  getTip: function() {
    return this.get('search_label')
  },
  timeHtml: function() {
    const date1 = this.get('Date1')
    const date2 = this.get('Date2 ')
    const time1 = this.get('Time1')
    const time2 = this.get('Time2')
    const result = $('<div class="when"><strong>Face covering distribution date: </strong></div>')
    if (date1) {
      result.append(`<div>${date1}, ${time1}</div>`)
    }
    if (date2) {
      result.append(`<div>${date2}, ${time2}</div>`)
    }
    return result
  }
}]