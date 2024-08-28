export interface GetRequestResult {
  queryResult: {
    count: number;
  };
  data: RowDataPacket;
}

export interface GetPaginatedRequestResult {
  queryResult: {
    pageNumber: number;
    pageSize: number;
    count: number;
    totalCount: number;
  };
  data: RowDataPacket;
}
