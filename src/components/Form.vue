<script setup>
import { ref } from 'vue'
const emit = defineEmits(['emitAddress'])

const address = ref('')


/**
 * 先檢查是否登入 google and facebook
 * 確實登入後才能使用功能
 */
const emitAddress = function () {
  emit('emitAddress', address.value)
}

</script>

<template>
  <div id="form">
    <input v-model="address" placeholder="請輸入您要查詢的地址" @keyup.enter="emitAddress"/>
    <i class="icon fas fa-search" @click="emitAddress"></i>
  </div>
</template>

<style scope>
input {
  padding: 0.375rem;
  font-size: 1.125rem;
}

#form {
  padding: 1rem;
  background-color: #f4f4f4;
}

.icon {
  font-size: 1.125rem;
  margin-left: 0.5rem;
  cursor: pointer;
}
</style>