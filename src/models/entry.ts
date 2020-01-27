export interface Entry {
  path: string
  body: string
  updatedAt: Date
  createdAt: Date
  root: boolean
}

export interface NewEntry {
  path: string
  body: string
}
