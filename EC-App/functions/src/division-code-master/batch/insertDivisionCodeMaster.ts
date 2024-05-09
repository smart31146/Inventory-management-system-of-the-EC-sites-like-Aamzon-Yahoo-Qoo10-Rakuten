import { IDivisionCodeMaster } from '../models/schema';
import { DivisionCodeMasterRepository } from '../models/repository';

//-------------------------------------------------------------------------------
/**
 * repositoryのバッチにデータを登録
 * @param products データ
 */
//-------------------------------------------------------------------------------
export const insertDivisionCodeMaster = async (data: IDivisionCodeMaster[]) => {
    // repositoryを取得
    // バッチ作成を行う
    const repo = new DivisionCodeMasterRepository();
    await repo.batchCreate(data);
};