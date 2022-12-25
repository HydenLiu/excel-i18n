import { saveAs } from 'file-saver'
import JsZip from 'jszip'
import type { IMap, IMapObj } from '../types'

/**
 * 导出多个文件到zip压缩包
 */
export async function downloadFilesToZip(params: IMapObj) {
  const zip = new JsZip()
  const promises = Object.keys(params).map(async (key: string) => await downLoadJSON(params[key], zip, key))
  await Promise.all(promises)
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, `excel-i18n-${Date.now()}.zip`)
  })
}

export function downLoadJSON(data: IMap, zip: JsZip, fileName: string) {
  const jsr = JSON.stringify(data, null, 2)
  const blob = new Blob([jsr], { type: 'application/json' })
  // if (fileName)
  //   zip.folder(fileName)?.file(`${fileName}.json`, blob)
  // else
  // 写入 zip 中一个文件
  zip.file(`${fileName}.json`, blob)
}
