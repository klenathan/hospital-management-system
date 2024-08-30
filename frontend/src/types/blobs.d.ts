export interface BlobMetadata {
  fileName: string
  domain: string
  parent: string
}

export interface Blob {
  _id: string
  length: number
  chunkSize: number
  uploadDate: string
  filename: string
  metadata: BlobMetadata
}

export interface GetBlobResponse {
  count: number
  data: Blob[]
}

export interface UseFetchBlobsParams {
  domain?: string
  fileName?: string
  parent?: string
}
