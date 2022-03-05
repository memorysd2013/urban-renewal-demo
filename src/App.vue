<script setup>
import { onMounted, reactive, ref } from 'vue'
import SignInButton from './components/SignInButton.vue';
import LeafletMap from './components/LeafletMap.vue';
import Form from './components/Form.vue';
import InformationBar from './components/InformationBar.vue';
import { postUrbanRenewalList, postUrbanRenewalPolygon } from './service/api';
import {
  getGoogleUser,
  getFacebookUser,
  googleLogin,
  googleLogout,
  facebookLogin,
  facebookLogout,
} from './service/public';

const identities = reactive({
  google: {
    user: null,
    icon: 'fab fa-google',
    login: googleLogin,
    logout: googleLogout,
    getUser: getGoogleUser,
  },
  facebook: {
    user: null,
    icon: 'fab fa-facebook-f',
    login: facebookLogin,
    logout: facebookLogout,
    getUser: getFacebookUser,
  }
})

const polygonData = reactive({
  map: [],
})

const listData = reactive({
  list: [],
})

const placeData = reactive({
  place: {},
})

const isInfoCollapse = ref(true)

onMounted(async () => {
  // google sdk init 速度很慢，為避免重複 google 登入，只能等 sdk 完全初始化後再取得 user
  setTimeout(() => {
    setUser('google');
    setUser('facebook');
  }, 1500)
})

const setUser = function (key) {
  identities[key].getUser()
    .then(res => identities[key].user = res)
    .catch(err => identities[key].user = null);
}

const clearUser = function (key) {
  identities[key].user = null;
}

const emitPlace = function (item) {
  if (!identities.google.user || !identities.google.user) {
    alert('請先登入 Google 與 Facebook 帳號')
    return
  }
  placeData.place = item
}

const updateLocation = async function (m) {
  if (!identities.google.user || !identities.google.user) {
    alert('請先登入 Google 與 Facebook 帳號')
    return
  }
  // list
  let listResponse = await postUrbanRenewalList({
    body: { ...m, function: 'xinbei_distance' }
  })
  if (listResponse?.result) {
    listData.list = listResponse.result
  }

  // polygon: 因為只有一個地點 所以只會執行一次
  if (!polygonData.map.length) {
    let polygonRes = await postUrbanRenewalPolygon({
      body: { directory: "tucheng.json", function: 'xinbei_json' }
    })
    if (polygonRes) {
      polygonData.map = polygonRes.result.features
    }
  }
}

</script>

<template>
  <div class="infoWrapper">
    <InformationBar :identities="identities" v-slot:default="slotProps">
      <SignInButton :identity="slotProps.identity" :identityKey="slotProps.identityKey" @setUser="setUser" @clearUser="clearUser" />
    </InformationBar>
  </div>

  <div class="wrapper flex">
    <Form :listData="listData" @emitPlace="emitPlace" />
    <LeafletMap :identities="identities" :polygonData="polygonData" :placeData="placeData" @updateLocation="updateLocation" />
  </div>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
  position: relative;
  width: 100vw;
}

.infoWrapper {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2000;
}
</style>