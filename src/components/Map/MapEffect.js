// Map/MapEffect.tsx
import { useEffect } from 'react'
import { useMap } from 'react-leaflet'

const MapEffect = ({ activeStoreId, storeLocations }) => {
  const map = useMap()

  useEffect(() => {
    if (!activeStoreId || !map) {
      return
    }

    const { location } = storeLocations.find(({ id }) => id === activeStoreId)

    map.setView([location.latitude, location.longitude], 14)
  }, [activeStoreId, storeLocations, map])

  return null
}
export default MapEffect
