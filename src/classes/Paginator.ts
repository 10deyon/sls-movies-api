import { RowDataPacket } from 'mysql2/promise';
import { PaginationInfo } from '../interfaces/PaginationInterface';
import connection from '../config/db.config';

export class Paginator {
    static async paginatedRecord(tableName: string, pageNumber: string, limit: string) {
        const page: number = pageNumber ? parseInt(pageNumber, 10) : 1;
        const newLimit: number = limit ? parseInt(limit, 10) : 10;

        const totalItems = await Paginator.itemCounter(tableName);

        const pages: number = Math.ceil(totalItems / newLimit);
        const currentPage: number = page;
        const hasNext: boolean = currentPage < pages;
        const hasPrevious: boolean = currentPage > 1;

        const paginationInfo: PaginationInfo<RowDataPacket[]> = {
            currentPage,
            limit: newLimit,
            totalItems,
            pages,
            hasNext,
            hasPrevious,
        };

        return paginationInfo;
    }

    private static async itemCounter(tableName: string) {
        const [totalCountResult] = await (
            await connection
        ).query<RowDataPacket[]>(`SELECT COUNT(*) AS total FROM ${tableName}`);

        const { total } = totalCountResult[0];

        return total;
    }
}
