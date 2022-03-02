<script setup>
import { onMounted, reactive } from 'vue'
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

const emitAddress = function (address) {
  console.log({ address })
}

const updateLocation = async function (m) {
  console.log({ m })

  let listResponse = await postUrbanRenewalList({
    body: { ...m, function: 'xinbei_distance' }
  })
  console.log({ body: { ...m, function: 'xinbei_distance' }, listResponse })

  // polygon
  let polygonRes = await postUrbanRenewalPolygon({
    body: { directory: "tucheng.json", function: 'xinbei_json' }
  })
  console.log({ body: { directory: "tucheng.json", function: 'xinbei_json' }, polygonRes })
  // if (polygonRes) {
  //   polygonData.map = polygonRes.result.features
  // }
}

const getApi = async function () {
  let body = {
    lat: 25.0111482,
    lng: 121.5182451,
    function: 'xinbei_distance'
  }
  let response = await postApi({ body })
  console.log({ response })
}

</script>

<template>
  <div class="information">
    <div v-for="(identity, key) in identities" :key="key">
      <span v-if="identity.user?.id"> hi, {{ identity.user.name }} </span>
      <span v-else> 請登入您的 {{ key }} 帳號 </span>
      <SignInButton :identity="identity" :identityKey="key" @setUser="setUser" @clearUser="clearUser" />
    </div>
  </div>

  <LeafletMap :identities="identities" :polygonData="polygonData" @updateLocation="updateLocation" />
  <Form @emitAddress="emitAddress"/>

</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin: 0;
}

.information {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.information div {
  margin-bottom: 0.5rem;
}
</style>
