<script setup>
import { onMounted, reactive, ref } from 'vue'
import SignInButton from './components/SignInButton.vue';
import LeafletMap from './components/LeafletMap.vue';
import Form from './components/Form.vue';
import { postUrbanRenewalList, postUrbanRenewalPolygon } from './service/api';
import {
  getGoogleUser,
  getFacebookUser,
  googleLogin,
  googleLogout,
  facebookLogin,
  facebookLogout,
} from './service/public';
import { all_dist } from './static/district'

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

const isInfoCollapse = ref(false)

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
  placeData.place = item
}

const updateLocation = async function (m) {
  // list
  let listResponse = await postUrbanRenewalList({
    body: { ...m, function: 'xinbei_distance' }
  })
  if (listResponse?.result) {
    listData.list = listResponse.result
  }

  // polygon
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
  <div :class="['information', 'flex v-center', isInfoCollapse && 'collapse']">
    <i class="fas fa-caret-left caret-icon" @click="isInfoCollapse = !isInfoCollapse"/>
    <div v-for="(identity, key) in identities" :key="key">
      <span v-if="identity.user?.id"> hi, {{ identity.user.name }} </span>
      <span v-else> 請登入您的 {{ key }} 帳號 </span>
      <SignInButton :identity="identity" :identityKey="key" @setUser="setUser" @clearUser="clearUser" />
    </div>
  </div>

  <div class="wrapper flex">
    <Form :listData="listData" @emitPlace="emitPlace"/>
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

.information {
  position: absolute;
  top: 0;
  right: 0;
  z-index: 2000;
  background-color: #f4f4f4;
  padding: 0.5rem;
  border-radius: 4px;
  transform: translateX(calc(100% - 2rem));
  cursor: default;
  transition: transform 0.6s;
}

.information.collapse {
  transform: translateX(0px);
}

.information span {
  padding: 0 1rem;
}

.information .caret-icon {
  font-size: 2rem;
  cursor: pointer;
  transition: transform 0.3s;
}
.information.collapse .caret-icon {
  transform: rotate(180deg);
}
</style>