import $ from 'jquery'
import proj4 from 'proj4'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'

const TODAY = new Date().toISOString().split('T')[0]
const YESTERDAY = new Date(new Date(TODAY).getTime() - 8.64e+7).toISOString().split('T')[0]
const TOMORROW = new Date(new Date(TODAY).getTime() + 8.64e+7).toISOString().split('T')[0]

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const superFreshFeature = new Feature({
  x: '1017986',
  y: '237820',
  name: 'SUPER FRESH',
  location: 'SUPER FRESH location',
  boro: '2',
  date1: TOMORROW,
  start_time1: '10:00',
  end_time1: '12:00',
  date2: TODAY,
  start_time2: '14:00',
  end_time2: '16:00'
})

const mostlyFreshFeature = new Feature({
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

const staleFeature = new Feature({
  x: '5',
  y: '6',
  name: 'STALE',
  location: 'STALE location',
  boro: '5',
  date1: YESTERDAY,
  start_time1: '10:00',
  end_time1: '12:00',
  date2: YESTERDAY,
  start_time2: '14:00',
  end_time2: '16:00'
})

Object.assign(superFreshFeature, decorations.decorations)
Object.assign(mostlyFreshFeature, decorations.decorations)
Object.assign(staleFeature, decorations.decorations)

beforeEach(() => {
  decorations.staleFeatures.length = 0
})

test('extendFeature', () => {
  expect.assertions(5)

  superFreshFeature.extendFeature()
  expect(decorations.staleFeatures.length).toBe(0)
  expect(superFreshFeature.get('search_label')).toBe(
    '<b><span class="srch-lbl-lg">' + superFreshFeature.getName() + 
    '</span></b><br><span class="srch-lbl-sm">' + superFreshFeature.getAddress1() + '</span>'
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
  
  const coord = proj4('EPSG:2263', 'EPSG:4326', [superFreshFeature.get('x') * 1, superFreshFeature.get('y') * 1])

  expect(superFreshFeature.getFullAddress()).toBe(coord[1] + ',' + coord[0])
})

test('getName', () => {
  expect.assertions(2)

  expect(superFreshFeature.getName()).toBe('SUPER FRESH')
  expect(mostlyFreshFeature.getName()).toBe('MOSTLY FRESH')
})

test('getAddress1', () => {
  expect.assertions(2)

  expect(superFreshFeature.getAddress1()).toBe('SUPER FRESH location')
  expect(mostlyFreshFeature.getAddress1()).toBe('MOSTLY FRESH location')
})

test('getBorough', () => {
  expect.assertions(5)

  expect(mostlyFreshFeature.getBorough()).toBe('Manhattan')
  expect(superFreshFeature.getBorough()).toBe('Bronx')
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
  expect.assertions(1)

  const iso = '2020-05-10'
  const parts = iso.split('-')
  const date = new Date(parts[0] * 1, parts[1] - 1, parts[2] * 1)

  expect(superFreshFeature.formatDate(iso)).toBe(`${DAYS[date.getDay()]}, ${MONTHS[date.getMonth()]} ${date.getDate()}, ${date.getFullYear()}`)
})

test('formatTime', () => {
  expect.assertions(3)

  expect(superFreshFeature.formatTime('09:30')).toBe('9:30 AM')
  expect(superFreshFeature.formatTime('12:00')).toBe('12:00 PM')
  expect(superFreshFeature.formatTime('13:00')).toBe('1:00 PM')
})

test('timeHtml', () => {
  expect.assertions(2)

  const div = $('<div></div>')

  div.html(superFreshFeature.timeHtml())
  expect(div.html()).toBe('<div class="when"><strong>Face covering distribution dates: </strong><div>Monday, May 11, 2020, 2:00 PM - 4:00 PM</div><div>Tuesday, May 12, 2020, 10:00 AM - 12:00 PM</div></div>')

  div.html(mostlyFreshFeature.timeHtml())
  expect(div.html()).toBe('<div class="when"><strong>Face covering distribution date: </strong><div>Monday, May 11, 2020, 2:00 PM - 4:00 PM</div></div>')
})

