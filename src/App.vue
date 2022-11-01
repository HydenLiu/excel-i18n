<script lang="ts" setup>
import XLSX from 'xlsx'
import { ref } from 'vue'
import { downloadFilesToZip } from './utils'
import type { IMap, IMapObj, TMapList } from './types'

let wb // 读取完成的数据
const rABS = ref(false) // 是否将文件读取为二进制字符串
const sheetName = ref('工作表1') // 默认读取的sheet名
const fileRef = ref() // 上传的文件
const langMap = ref<IMapObj>({
  en: {},
  es: {},
  ko: {},
  ru: {},
  id: {},
  tw: {},
  th: {}
})

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

    const list: TMapList = XLSX.utils.sheet_to_json(wb.Sheets[sheetName.value])
    // console.log('list', list)

    list.forEach((item: IMap) => {
      Object.keys(langMap.value).forEach((lang) => {
        langMap.value[lang][item.key] = item[lang] || ''
      })
    })
  }
  const f = target.files[0]
  if (rABS.value)
    reader.readAsArrayBuffer(f)
  else
    reader.readAsBinaryString(f)
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
  <section>
    <input v-model="sheetName" type="text" placeholder="Please enter the sheet name">
    <input :ref="fileRef" type="file" @change.prevent="importFile">
    <div class="flex">
      <button @click="downloadFilesToZip(langMap)">download</button>
      <div v-for="item in Object.keys(langMap)" :key="item">
        {{ item }}:
        <div>{{ langMap[item] }}</div>
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
