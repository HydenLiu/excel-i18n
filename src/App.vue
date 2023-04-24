<script lang="ts" setup>
import XLSX from 'xlsx'
import { ref } from 'vue'
import _ from 'lodash-es'
import { downloadFilesToZip } from './utils'
import type { IMap, IMapObj, TMapList } from './types'

let wb: XLSX.WorkBook // 读取完成的数据
const rABS = ref(false) // 是否将文件读取为二进制字符串
const sheetName = ref('工作表1') // 默认读取的sheet名
const fileRef = ref() // 上传的文件
const defaultLangMap: IMapObj = {
  tw: {},
  en: {},
  es: {},
  ko: {},
  ru: {},
  id: {},
  th: {},
  pt: {}
}
const langMap = ref<IMapObj>(_.cloneDeep(defaultLangMap))
let allLangMap = _.cloneDeep(defaultLangMap)
// SheetNames
const sheetNames = ref<string []>([])
const selectItems = ref<string []>([])

function importFile(e: Event) {
  const target = e.target as HTMLInputElement
  // 导入
  if (!target.files)
    return

  const reader = new FileReader()
  reader.onload = function (e: any) {
    const data = e.target.result
    if (rABS.value)
      wb = XLSX.read(btoa(fixdata(data)), { type: 'base64' })
    else
      wb = XLSX.read(data, { type: 'binary' })

    sheetNames.value = wb.SheetNames
    selectItems.value = wb.SheetNames

    selectItems.value.forEach((sheet) => {
      const list: TMapList = XLSX.utils.sheet_to_json(wb.Sheets[sheet])
      console.log('list', list)
      list.forEach((item: IMap, index) => {
        const ex = /[\u4E00-\u9FA5|\u3002|\uFF1F|\uFF01|\uFF0C|\u3001|\uFF1B|\uFF1A|\u201C|\u201D|\u2018|\u2019|\uFF08|\uFF09|\u300A|\u300B|\u3008|\u3009|\u3010|\u3011|\u300E|\u300F|\u300C|\u300D|\uFE43|\uFE44|\u3014|\u3015|\u2026|\u2014|\uFF5E|\uFE4F|\uFFE5|\.|\*|\?|!|\(|\)|\{|\}\[|\]]/img
        let key = item.key ?? item?.en.split(' ').slice(0, 5).join('_').replace(ex, '').toLocaleLowerCase()
        if (langMap.value.en[key])
          key = `${key}_${index}`

        Object.keys(langMap.value).forEach((lang) => {
          if (!langMap.value[lang][sheet]) langMap.value[lang][sheet] = {}
          langMap.value[lang][sheet][key] = item[lang] || ''
        })
      })
    })

    allLangMap = _.cloneDeep(langMap.value)
  }
  const f = target.files[0]
  if (rABS.value)
    reader.readAsArrayBuffer(f)
  else
    reader.readAsBinaryString(f)
}

function onChangeSelect() {
  langMap.value = _.cloneDeep(defaultLangMap)
  selectItems.value.forEach((item) => {
    Object.keys(allLangMap).forEach((lang) => {
      langMap.value[lang][item] = allLangMap[lang][item]
    })
  })
}

function fixdata(data: any) {
  // 文件流转BinaryString
  let o = ''
  let l = 0
  const w = 10240
  for (; l < data.byteLength / w; ++l) {
    o += String.fromCharCode.apply(
      null,
      new Uint8Array(data.slice(l * w, l * w + w)) as any
    )
  }
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)) as any)
  return o
}
</script>

<template>
  <section class="">
    <div class="max-w-max mx-auto py-5">
      <label for="pet-select">选择Sheet:</label>
      <select id="select" v-model="selectItems" name="pets" multiple="true" @change="onChangeSelect">
        <option v-for="item in sheetNames" :key="item" :value="item">{{ item }}</option>
      </select>
      <!-- <input
        id="input"
        v-model="sheetName"
        placeholder="Please enter the sheet name"
        aria-label="Please enter the sheet name"
        type="text"
        autocomplete="false"
        class="mr-2 w-100 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
      > -->
      <input
        :ref="fileRef"
        class="mr-2 w-200 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        type="file"
        @change.prevent="importFile"
      >
      <button class="btn" @click="downloadFilesToZip(langMap)">download</button>
    </div>
    <div class="flex w-full">
      <div v-for="item in Object.keys(langMap)" :key="item" class="flex-1">
        {{ item }}:
        <pre class="w-full whitespace-pre-wrap">{{ JSON.stringify(langMap[item], null, 2) }}</pre>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
