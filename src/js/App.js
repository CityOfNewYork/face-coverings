import urls from './urls'
import style from './style'
import decorations from './decorations'
import CsvPoint from 'nyc-lib/nyc/ol/format/CsvPoint'
import FinderApp from 'nyc-lib/nyc/ol/FinderApp'
import Point from 'ol/geom/Point'
import {extend} from 'ol/extent'
import screenReaderInfo from './screen-reader'

const getSplashOptions = () => {
  const search = document.location.search
  if (search.indexOf('splash=false') === -1) {
    return {message: 'Face coverings are being distributed in parks across NYC. Find the closest location.'}
  }
}

class App extends FinderApp {
  constructor() {
    super({
      title: 'Face Coverings Distribution',
      facilityTabTitle: 'Locations',
      splashOptions: getSplashOptions(),
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

export default App
