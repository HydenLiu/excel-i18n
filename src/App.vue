<script setup lang="ts">
import XLSX from 'xlsx'
import { copyToClipBoard } from './utils'

let wb // 读取完成的数据
const rABS = false // 是否将文件读取为二进制字符串
const sheetName = 'Sheet1' // 默认读取的sheet名
const langMap = {
  en: {},
  es: {},
  ko: {},
  ru: {},
  id: {},
  tw: {},
  th: {}
}

function importf(obj: any) {
  // 导入
  if (!obj.files)
    return

  const f = obj.files[0]
  const reader = new FileReader()
  reader.onload = function (e: any) {
    const data = e.target.result
    if (rABS)
      wb = XLSX.read(btoa(fixdata(data)), { type: 'base64' })

    else
      wb = XLSX.read(data, { type: 'binary' })

    const list = XLSX.utils.sheet_to_json(wb.Sheets[sheetName])

    // list.forEach((item: any) => {
    //   Object.keys(langMap).forEach((lang) => {
    //     langMap[lang][item["key"]] = item[lang] || "";
    //   });
    // });

    // Object.keys(langMap).forEach((lang) => {
    //   document.getElementById(lang).innerHTML = JSON.stringify(
    //     langMap[lang]
    //   );
    // });
  }
  if (rABS)
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
    <input type="text" placeholder="Please enter the sheet name">
    <input type="file" onchange="importf(this)">
    <div class="flex">
      <button onclick="downLoadFun()">download</button>
      <div>
        en: <button onclick="copyToClipBoard('en')">copy</button>
        <textarea id="en" />
      </div>

      <div>
        es: <button onclick="copyToClipBoard('es')">copy</button>
        <textarea id="es" />
      </div>

      <div>
        ko: <button onclick="copyToClipBoard('ko')">copy</button>
        <textarea id="ko" />
      </div>

      <div>
        ru: <button onclick="copyToClipBoard('ru')">copy</button>
        <textarea id="ru" />
      </div>

      <div>
        id: <button onclick="copyToClipBoard('id')">copy</button>
        <textarea id="id" />
      </div>

      <div>
        th: <button onclick="copyToClipBoard('th')">copy</button>
        <textarea id="th" />
      </div>

      <div>
        tw: <button onclick="copyToClipBoard('tw')">copy</button>
        <textarea id="tw" />
      </div>
    </div>
  </section>
</template>

<style scoped>

</style>
