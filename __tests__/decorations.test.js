import $ from 'jquery'
import proj4 from 'proj4'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

const NOW_TODAY = new Date()
const NOW_YESTERDAY = new Date(NOW_TODAY.getTime() - 8.64e+7)
const NOW_TOMORROW = new Date(NOW_TODAY.getTime() + 8.64e+7)

const today_yyyy = NOW_TODAY.getFullYear().toString()
const today_mm = (NOW_TODAY.getMonth() + 1).toString().padStart(2, '0')
const today_dd = NOW_TODAY.getDate().toString().padStart(2, '0')
const TODAY = `${today_yyyy}-${today_mm}-${today_dd}`

const yesterday_yyyy = NOW_YESTERDAY.getFullYear().toString()
const yesterday_mm = (NOW_YESTERDAY.getMonth() + 1).toString().padStart(2, '0')
const yesterday_dd = NOW_YESTERDAY.getDate().toString().padStart(2, '0')
const YESTERDAY = `${yesterday_yyyy}-${yesterday_mm}-${yesterday_dd}`

const tomorrow_yyyy = NOW_TOMORROW.getFullYear().toString()
const tomorrow_mm = (NOW_TOMORROW.getMonth() + 1 ).toString().padStart(2, '0')
const tomorrow_dd = NOW_TOMORROW.getDate().toString().padStart(2, '0')
const TOMORROW = `${tomorrow_yyyy}-${tomorrow_mm}-${tomorrow_dd}`

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

let superFreshFeature1, superFreshFeature2, mostlyFreshFeature, staleFeature

const resetFeatures = () => {
  superFreshFeature1 = new Feature({
    x: '1017986',
    y: '237820',
    name: 'SUPER FRESH 1',
    location: 'SUPER FRESH 1 location',
    boro: '2',
    date1: TOMORROW,
    start_time1: '10:00',
    end_time1: '12:00',
    date2: TODAY,
    start_time2: '14:00',
    end_time2: '16:00'
  })
  superFreshFeature2 = new Feature({
    x: '1053807',
    y: '162110',
    name: 'SUPER FRESH 2',
    location: 'SUPER FRESH 2 location',
    boro: '1',
    date1: TODAY,
    start_time1: '10:00',
    end_time1: '12:00',
    date2: TODAY,
    start_time2: '10:00',
    end_time2: '15:00'
  })  
  mostlyFreshFeature = new Feature({
    x: '1053807',
    y: '162110',
    name: 'MOSTLY FRESH',
    location: 'MOSTLY FRESH location',
    boro: '1',
    date1: YESTERDAY,
    start_time1: '10:00',
    end_time1: '12:00',
    date2: TODAY,
    start_time2: '14:00',
    end_time2: '16:00'
  })
  staleFeature = new Feature({
    x: '5',
    y: '6',
    name: 'STALE',
    location: 'STALE location',
    boro: '5',
    date1: '',
    start_time1: '',
    end_time1: '',
    date2: YESTERDAY,
    start_time2: '14:00',
    end_time2: '16:00'
  })
}


beforeEach(() => {
  resetFeatures()
  decorations.staleFeatures.length = 0
  decorations.decorations.distanceHtml = jest.fn()
  decorations.decorations.nameHtml = jest.fn()
  decorations.decorations.addressHtml = jest.fn()
  decorations.decorations.mapButton = jest.fn()
  decorations.decorations.directionsButton = jest.fn()
  decorations.decorations.handleOver = jest.fn()
  decorations.decorations.handleOut = jest.fn()
  decorations.decorations.handleOver = jest.fn()
  Object.assign(superFreshFeature1, decorations.decorations)
  Object.assign(mostlyFreshFeature, decorations.decorations)
  Object.assign(superFreshFeature2, decorations.decorations)
  Object.assign(staleFeature, decorations.decorations)
})

test('extendFeature', () => {
  expect.assertions(5)

  superFreshFeature1.extendFeature()
  expect(decorations.staleFeatures.length).toBe(0)
  expect(superFreshFeature1.get('search_label')).toBe(
    '<b><span class="srch-lbl-lg">' + superFreshFeature1.getName() + 
    '</span></b><br><span class="srch-lbl-sm">' + superFreshFeature1.getAddress1() + '</span>'
  )

  mostlyFreshFeature.extendFeature()
  expect(decorations.staleFeatures.length).toBe(0)
  expect(mostlyFreshFeature.get('search_label')).toBe(
    '<b><span class="srch-lbl-lg">' + mostlyFreshFeature.getName() + 
    '</span></b><br><span class="srch-lbl-sm">' + mostlyFreshFeature.getAddress1() + '</span>'
  )

  staleFeature.extendFeature()
  expect(decorations.staleFeatures.length).toBe(1)
})

test('getFullAddress', () => {
  expect.assertions(1)
  
  const coord = proj4('EPSG:2263', 'EPSG:4326', [superFreshFeature1.get('x') * 1, superFreshFeature1.get('y') * 1])

  expect(superFreshFeature1.getFullAddress()).toBe(coord[1] + ',' + coord[0])
})

test('getName', () => {
  expect.assertions(2)

  expect(superFreshFeature1.getName()).toBe('SUPER FRESH 1')
  expect(mostlyFreshFeature.getName()).toBe('MOSTLY FRESH')
})

test('getAddress1', () => {
  expect.assertions(2)

  expect(superFreshFeature1.getAddress1()).toBe('SUPER FRESH 1 location')
  expect(mostlyFreshFeature.getAddress1()).toBe('MOSTLY FRESH location')
})

test('getBorough', () => {
  expect.assertions(5)

  expect(mostlyFreshFeature.getBorough()).toBe('Manhattan')
  expect(superFreshFeature1.getBorough()).toBe('Bronx')
  expect(Object.assign(new Feature({boro: '3'}), decorations.decorations).getBorough()).toBe('Brooklyn')
  expect(Object.assign(new Feature({boro: '4'}), decorations.decorations).getBorough()).toBe('Queens')
  expect(staleFeature.getBorough()).toBe('Staten Island')
})

test('getCityStateZip', () => {
  expect.assertions(1)

  expect(mostlyFreshFeature.getCityStateZip()).toBe('Manhattan, NY')
})

test('getTip', () => {
  expect.assertions(1)

  expect(mostlyFreshFeature.getTip()).toBe(mostlyFreshFeature.get('search_label'))
})

test('formatDate', () => {
  expect.assertions(2)

  const iso = '2020-05-10'
  const parts = iso.split('-')
  const date = new Date(parts[0] * 1, parts[1] - 1, parts[2] * 1)

  expect(superFreshFeature1.formatDate(iso)).toBe(`${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`)
  expect(superFreshFeature1.formatDate()).toBeUndefined()
})

test('formatTime', () => {
  expect.assertions(4)

  expect(superFreshFeature1.formatTime('09:30')).toBe('9:30 AM')
  expect(superFreshFeature1.formatTime('12:00')).toBe('12:00 PM')
  expect(superFreshFeature1.formatTime('13:00')).toBe('1:00 PM')
  expect(superFreshFeature1.formatTime('')).toBeUndefined()
})

test('timeHtml', () => {
  expect.assertions(3)

  const div = $('<div></div>')

  div.html(superFreshFeature1.timeHtml())
  expect(div.html()).toBe(
    '<div class="when"><strong>Face covering distribution dates: </strong><div>' + 
    DAYS[NOW_TODAY.getDay()] + ', ' + 
    MONTHS[NOW_TODAY.getMonth()] + ' ' + 
    NOW_TODAY.getDate() + ', ' + 
    NOW_TODAY.getFullYear() + 
    ', 2:00 PM - 4:00 PM</div><div>' + 
    DAYS[NOW_TOMORROW.getDay()] + ', ' + 
    MONTHS[NOW_TOMORROW.getMonth()] + ' ' + 
    NOW_TOMORROW.getDate() + ', ' + 
    NOW_TOMORROW.getFullYear() + 
    ', 10:00 AM - 12:00 PM</div></div>'
  )
  div.html(mostlyFreshFeature.timeHtml())
  expect(div.html()).toBe(
    '<div class="when"><strong>Face covering distribution date: </strong><div>' +
    DAYS[NOW_TODAY.getDay()] + ', ' +
    MONTHS[NOW_TODAY.getMonth()] + ' ' +
    NOW_TODAY.getDate() + ', ' +
    NOW_TODAY.getFullYear() +
    ', 2:00 PM - 4:00 PM</div></div>'
  )

  div.html(superFreshFeature2.timeHtml())
  expect(div.html()).toBe(
    '<div class="when"><strong>Face covering distribution dates: </strong><div>' +
    DAYS[NOW_TODAY.getDay()] + ', ' +
    MONTHS[NOW_TODAY.getMonth()] + ' ' +
    NOW_TODAY.getDate() + ', ' +
    NOW_TODAY.getFullYear() +
    ', 10:00 AM - 12:00 PM</div><div>' +
    DAYS[NOW_TODAY.getDay()] + ', ' +
    MONTHS[NOW_TODAY.getMonth()] + ' ' +
    NOW_TODAY.getDate() + ', ' +
    NOW_TODAY.getFullYear() +
    ', 10:00 AM - 3:00 PM</div></div>'
  )
})

test('html', () => {
  expect.assertions(6)

  const html = superFreshFeature1.html()

  expect(html.data('feature')).toBe(superFreshFeature1)

  expect(decorations.decorations.handleOver).toHaveBeenCalledTimes(0)
  html.trigger('mouseover')
  expect(decorations.decorations.handleOver).toHaveBeenCalledTimes(1)

  expect(decorations.decorations.handleOut).toHaveBeenCalledTimes(0)
  html.trigger('mouseout')
  expect(decorations.decorations.handleOut).toHaveBeenCalledTimes(1)

  expect($('<div></div>').html(html).html()).toBe(
    '<div class="facility"><div class="when"><strong>Face covering distribution dates: </strong><div>' +
    DAYS[NOW_TODAY.getDay()] + ', ' +
    MONTHS[NOW_TODAY.getMonth()] + ' ' +
    NOW_TODAY.getDate() + ', '
    + NOW_TODAY.getFullYear() +
    ', 2:00 PM - 4:00 PM</div><div>' +
    DAYS[NOW_TOMORROW.getDay()] + ', ' +
    MONTHS[NOW_TOMORROW.getMonth()] + ' ' +
    NOW_TOMORROW.getDate() + ', ' +
    NOW_TOMORROW.getFullYear() +
    ', 10:00 AM - 12:00 PM</div></div></div>'
  )
})