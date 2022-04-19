import iconMarker2x from 'leaflet/dist/images/marker-icon-2x.png'
import iconMarker from 'leaflet/dist/images/marker-icon.png'
import iconMarkerShadow from 'leaflet/dist/images/marker-shadow.png'
import 'leaflet/dist/leaflet.css'
import { useEffect, useRef } from 'react'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet'
import styles from './Map.module.scss'

const position = [51.505, -0.09]

const Map = ({ className, children, ...rest }) => {
  const mapRef = useRef(null)

  let mapClassName = styles.map

  if (className) {
    mapClassName += ` ${className}`
  }

  useEffect(() => {
    delete L.Icon.Default.prototype._getIconUrl
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: iconMarker2x.src,
      iconUrl: iconMarker.src,
      shadowUrl: iconMarkerShadow.src,
    })
  }, [])

  return (
    <MapContainer className={mapClassName} ref={mapRef} {...rest}>
      {children({ Marker, Popup, TileLayer }, mapRef.current)}
    </MapContainer>
  )
}

export default Map
