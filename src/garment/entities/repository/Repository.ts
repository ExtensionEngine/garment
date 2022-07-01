import bytes from 'bytes'
import sizeof from 'object-sizeof'
import { Type, plainToClass } from 'class-transformer'

import { GarmentEnv } from '../../enums'
import { Activity, ContentContainer } from '../'

export class Repository {
  static api: any
  envPath: string
  isLoaded = false

  id: number
  uid: string
  schema: string
  name: string
  description: string
  version: string

  @Type(() => Activity)
  structure: Activity[]

  @Type(() => Date)
  publishedAt: Date

  get fileKey() {
    return this.id.toString()
  }

  get path(): string {
    return Repository.api.getRepositoryPath(this.fileKey, this.envPath)
  }

  get size(): string {
    return bytes(sizeof(this))
  }

  async load() {
    const withContainers = this.structure.filter(it => it.contentContainers?.length)
    await Promise.all(withContainers.map(activity => activity.load()))
    this.isLoaded = true
  }

  clone(dstPath: string) {
    return Repository.api.clone(this.path, dstPath)
  }

  snapshot(version = new Date().getTime().toString()) {
    const directory = `${this.fileKey}/${version}`
    return Repository.api.cloneToEnv(this.path, GarmentEnv.Snapshot, directory)
  }

  async getContainer(id: string): Promise<ContentContainer> {
    const data = await Repository.api.getContainer(id, this.fileKey)
    return plainToClass(ContentContainer, data)
  }
}
