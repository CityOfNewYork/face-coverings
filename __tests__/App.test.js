import App from '../src/js/App'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import urls from '../src/js/urls'
import style from '../src/js/style'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import decorations from '../src/js/decorations'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'

jest.mock('nyc-lib/nyc/ol/FinderApp')

beforeEach(() => {
  FinderApp.mockClear()
  decorations.staleFeatures.length = 0
})

describe('constructor', () => {
  const getSplashOptions = App.getSplashOptions
  afterEach(() => {
    App.getSplashOptions = getSplashOptions
  })

  test('constructor w splash', () => {
    expect.assertions(2)
  
    const app = new App()
  
    expect(FinderApp).toHaveBeenCalledTimes(1)
    expect(FinderApp.mock.calls[0][0]).toEqual({
      title: 'Face Coverings Distribution',
      facilityTabTitle: 'Locations',
      splashOptions: {message: 'New York City will continue distributing face coverings in parks, <a href="https://dsny.maps.arcgis.com/apps/webappviewer/index.html?id=35901167a9d84fb0a2e0672d344f176f">DOE Grab & Go</a> meal sites, NYCHA buildings, some Mitchell-Lama buildings, grocery stores, and during social distancing enforcement.<br><br>Additional distribution dates, locations, and times will be coming soon.'},
      geoclientUrl: urls.GEOCLIENT_URL,
      facilityUrl: urls.FACILITY_CSV_URL,
      facilityStyle: style,
      facilitySearch: { displayField: 'search_label', nameField: 'name' },
      facilityFormat: new CsvPoint({
        x: 'x',
        y: 'y',
        dataProjection: 'EPSG:2263'
      }),
      decorations: [decorations.decorations],
      directionsUrl: urls.DIRECTIONS_URL
    })
  })
  
  test('constructor w/o splash', () => {
    expect.assertions(2)

    App.getSplashOptions = () => {}

    const app = new App()
  
    expect(FinderApp).toHaveBeenCalledTimes(1)
    expect(FinderApp.mock.calls[0][0]).toEqual({
      title: 'Face Coverings Distribution',
      facilityTabTitle: 'Locations',
      geoclientUrl: urls.GEOCLIENT_URL,
      facilityUrl: urls.FACILITY_CSV_URL,
      facilityStyle: style,
      facilitySearch: { displayField: 'search_label', nameField: 'name' },
      facilityFormat: new CsvPoint({
        x: 'x',
        y: 'y',
        dataProjection: 'EPSG:2263'
      }),
      decorations: [decorations.decorations],
      directionsUrl: urls.DIRECTIONS_URL
    })
  })
})

test('getSplashOptions', () => {
  expect.assertions(2)

  expect(App.getSplashOptions('')).toEqual({message: 'New York City will continue distributing face coverings in parks, <a href="https://dsny.maps.arcgis.com/apps/webappviewer/index.html?id=35901167a9d84fb0a2e0672d344f176f">DOE Grab & Go</a> meal sites, NYCHA buildings, some Mitchell-Lama buildings, grocery stores, and during social distancing enforcement.<br><br>Additional distribution dates, locations, and times will be coming soon.'})
  expect(App.getSplashOptions('?splash=false')).toBeUndefined()
})

test('located', () => {
  expect.assertions(4)

  const mockLocation = {coordinate: 'mock-coord'}

  const app = new App()
  app.zoomToExtent = jest.fn()
  app.location = mockLocation

  app.located(mockLocation)

  expect(FinderApp.prototype.located).toHaveBeenCalledTimes(1)
  expect(FinderApp.prototype.located.mock.calls[0][0]).toBe(mockLocation)

  expect(app.zoomToExtent).toHaveBeenCalledTimes(1)
  expect(app.zoomToExtent.mock.calls[0][0]).toBe('mock-coord')
})

test('zoomToExtent', () => {
  expect.assertions(6)

  const feature = new Feature({
    geometry: new Point([1, 2])
  })

  const app = new App()
  app.view = {fit: jest.fn()}
  app.map = {
    getSize: jest.fn().mockImplementation(() => {
      return 'mock-size'
    })
  }
  app.source = {
    nearest: jest.fn().mockImplementation(() => {
      return [feature]
    })
  }

  app.zoomToExtent([10, 20])

  expect(app.source.nearest).toHaveBeenCalledTimes(1)
  expect(app.source.nearest.mock.calls[0][0]).toEqual([10, 20])
  expect(app.source.nearest.mock.calls[0][1]).toBe(1)
  expect(app.view.fit).toHaveBeenCalledTimes(1)
  expect(app.view.fit.mock.calls[0][0]).toEqual([-99, -98, 110, 120])
  expect(app.view.fit.mock.calls[0][1]).toEqual({size: 'mock-size', duration: 500})
})

test('ready', () => {
  expect.assertions(5)

  decorations.staleFeatures = ['stale1', 'stale2']

  const app = new App()
  app.source = {
    removeFeature: jest.fn(),
    getFeatures: jest.fn().mockImplementation(() => {
      return 'mock-features'
    })
  }

  app.ready()

  expect(app.source.removeFeature).toHaveBeenCalledTimes(2)
  expect(app.source.removeFeature.mock.calls[0][0]).toBe('stale1')
  expect(app.source.removeFeature.mock.calls[1][0]).toBe('stale2')
  expect(FinderApp.prototype.ready).toHaveBeenCalledTimes(1)
  expect(FinderApp.prototype.ready.mock.calls[0][0]).toBe('mock-features')
})