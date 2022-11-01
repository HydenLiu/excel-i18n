export interface IMap {
  [v: string]: string
}

export type TMapList = IMap []

export interface IMapObj {
  [v: string]: IMap
}
