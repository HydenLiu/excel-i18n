import { saveAs } from 'file-saver'
import JsZip from 'jszip'

/**
 * 导出多个文件到zip压缩包
 */
export async function downloadFilesToZip(params: any) {
  const zip = new JsZip()
  const promises = params?.files?.map(async (param: any) => await downLoadJSON(param, zip, ''))
  await Promise.all(promises)
  zip.generateAsync({ type: 'blob' }).then((blob) => {
    saveAs(blob, `${params.zipName}.zip`)
  })
}

export function downLoadJSON(data: any, zip: JsZip, fileName: string) {
  const jsr = JSON.stringify(data)
  const blob = new Blob([jsr], { type: 'application/json' })
  if (fileName) {
    zip.folder(fileName)?.file(`${fileName}.json`, blob)
  }
  else {
    // 写入 zip 中一个文件
    zip.file(`${fileName}.json`, blob)
  }
}

// copy
export function copyToClipBoard(id: string) {
  const content = document.getElementById(id) as HTMLInputElement
  content.select()
  document.execCommand('copy')
}
