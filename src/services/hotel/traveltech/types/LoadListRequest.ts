export type LoadListRequest = {
        lang:"ru"|"en",
        createdFrom:Date,
        createdTo:Date,
        pageSize:number,
        pageNumber: number
}