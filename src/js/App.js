import urls from './urls'
import style from './style'
import decorations from './decorations'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import Point from 'ol/geom/Point'
import {extend} from 'ol/extent'
import screenReaderInfo from './screen-reader'

class App extends FinderApp {
  constructor() {
    super({
      title: 'Face Coverings Distribution',
      facilityTabTitle: 'Locations',
      splashOptions: App.getSplashOptions(document.location.search),
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
  }
  located (location) {
    super.located(location)
    this.zoomToExtent(this.location.coordinate)
  }
  zoomToExtent(coord) {
    let extent = new Point(coord).getExtent()
    const features = this.source.nearest(coord, 1)
    extent = extend(extent, features[0].getGeometry().getExtent())
    extent = [extent[0] - 100, extent[1] - 100, extent[2] + 100, extent[3] + 100]
    this.view.fit(extent, {size: this.map.getSize(), duration: 500})
  }
  ready(features) {
    decorations.staleFeatures.forEach(feature => {
      this.source.removeFeature(feature)
    })
    super.ready(this.source.getFeatures())
  }
}

App.getSplashOptions = search => {
  if (search.indexOf('splash=false') === -1) {
    return {message: 'New York City will continue distributing face coverings in parks, <a href="https://dsny.maps.arcgis.com/apps/webappviewer/index.html?id=35901167a9d84fb0a2e0672d344f176f">DOE Grab & Go</a> meal sites, NYCHA buildings, some Mitchell-Lama buildings, grocery stores, and during social distancing enforcement.<br><br>Additional distribution dates, locations, and times will be coming soon.'}
  }
}

export default App
