import bytes from 'bytes'
import sizeof from 'object-sizeof'
import { Type } from 'class-transformer'

import { ContentElement } from '../content-element'

export class ContentContainer {
  static api: any
  isLoaded = false

  id: number
  uid: string
  parentId: number
  type: string
  position: number

  @Type(() => ContentElement)
  elements: ContentElement[]

  @Type(() => Date)
  createdAt: Date

  @Type(() => Date)
  updatedAt: Date

  get fileKey() {
    return this.id.toString()
  }

  get size(): string {
    return bytes(sizeof(this))
  }
}
