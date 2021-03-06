<script setup>
import { onMounted, computed, reactive, watch } from 'vue'
import { getGeolocation } from '../service/api'
import { adjustPolygonParams } from '../service/public';
const emit = defineEmits(['updateLocation'])

let map = {}
let marker = {}

const props = defineProps({
  identities: Object,
  polygonData: Object,
  placeData: Object,
})

// 點擊到的位置經緯度 [lat, lng]
const latLng = reactive({ m: [25.013, 121.515] })

const avatars = computed(() => {
  return Object.keys(props.identities).map(idt => props.identities[idt]?.user?.image).filter(f => f)
})

// 登入身份更新時 更新 marker 內容
watch(props.identities, () => {
  let els = avatars.value.map(url => `<img src="${url}" class="tl-img">`).join('')
  setTimeout(() => marker.bindTooltip('Here you are <br/>' + els), 0)  
})

watch(props.polygonData, () => {
  let polygonMap = props.polygonData.map.map(f => {
    return f.geometry.coordinates.map(c => c.map(a => adjustPolygonParams(a)))
  })

  generatePolygon(polygonMap)
})

watch(props.placeData, () => {
  let { latitude, longitude, stop_name, distance } = props.placeData.place

  L.popup()
    .setLatLng([latitude, longitude])
    .setContent(`地點：${stop_name} (${distance}m)`)
    .openOn(map);
})

onMounted(async () => {
  // 如果能取得使用者經緯度就覆蓋預設值
  let m = await getGeolocation()
  if (m) {
    latLng.m = m
  }

  mapInit()
})

// 地圖生成
const mapInit = () => {
  // init map
  map = L.map('mapid', { center: latLng.m, zoom: 15 });
  map.on('click', onMapClick);

  // 加入底圖
  L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }).addTo(map);

  // init marker
  marker = L.marker(latLng.m, { draggable: true, autoPan: true })
    .bindTooltip('please login google & facebook first')
    .openTooltip()
    .addTo(map);
  marker.on('moveend', markerMoveEnd);

  // 
  function markerMoveEnd(e) {
    if (e.target._latlng) {
      emit('updateLocation', e.target._latlng)
    }
  }

  function onMapClick(e) {
    marker.setLatLng(e.latlng)
    emit('updateLocation', e.latlng)
  }
}

const generatePolygon = (polygonMap) => {
  var polygonIns = L.polygon(polygonMap, { color: 'red' }).addTo(map);

  // zoom the map to the polygon
  // map.fitBounds(polygonIns.getBounds());
}

</script>

<template>
  <div id="mapid"></div>
</template>

<style>
#mapid {
  width: 100%;
  height: 100vh;
}

.tl-img {
  width: 60px;
  height: 60px;
}
</style>