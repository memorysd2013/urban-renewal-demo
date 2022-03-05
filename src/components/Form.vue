<script setup>
import { computed, reactive, ref, watch } from 'vue'
const emit = defineEmits(['emitPlace'])
const props = defineProps({
  listData: Object,
})

const address = ref('')

const filterList = reactive({
  list: [],
})

const prompt = computed(() => {
  return filterList.list.length
    ? `共有${filterList.list.length}筆地點`
    : '無搜尋結果'
})

watch(props.listData, () => {
  filterList.list = props.listData.list
})

/**
 * 先檢查是否登入 google and facebook
 * 確實登入後才能使用功能
 */
const emitPlace = function (item) {
  emit('emitPlace', item)
}

const filterAddress = function () {
  filterList.list = address.value
    ? props.listData.list.filter(f => f.stop_name.includes(address.value))
    : props.listData.list
}

</script>

<template>
  <div id="form" class="flex between column">
    <div class="input-area">
      <div class="flex v-center">
        <input v-model="address" placeholder="請輸入您要查詢的地址" @input="filterAddress"/>
        <i class="icon fas fa-search" @click="filterAddress"></i>
      </div>
      <div class="prompt">{{ prompt }}</div>
    </div>
    <div class="list">
      <div v-for="(item, i) of filterList.list" :key="i" class="option flex between" @click="emitPlace(item)">
        <span class="stop-name"> {{ item.stop_name }} </span>
        <span class="distance"> {{ item.distance }}m </span>
      </div>
    </div>
  </div>
</template>

<style scope>
input {
  padding: 0.375rem;
  font-size: 1.125rem;
}

#form {
  background-color: #f4f4f4;
  height: 100vh;
  min-width: 300px;
}

.icon {
  font-size: 1.125rem;
  margin-left: 0.5rem;
  cursor: pointer;
}

.prompt {
  margin-top: 0.5rem;
}

.input-area {
  padding: 0.5rem;
}

.list {
  height: 100%;
  overflow: auto;
  padding: 0.5rem;
}

.option {
  border: 1px solid #ccc;
  padding: 0.5rem;
  cursor: pointer;
  font-size: 1.125rem;
  transition: all 0.2s;
}

.option:hover {
  box-shadow: 4px 4px 0 0 #ccc;
  border: 1px solid #000;
}

.option + .option {
  margin-top: 0.5rem;
}

.option .stop-name {
  display: inline-block;
  text-overflow: ellipsis;
  padding-right: 1rem;
  overflow: hidden;
  white-space: nowrap;
}

.option .distance {
  flex: 0 0 auto;
}
</style>