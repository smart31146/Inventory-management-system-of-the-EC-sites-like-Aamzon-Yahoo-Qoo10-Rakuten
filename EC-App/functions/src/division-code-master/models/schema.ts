import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * ブランド変換マスタドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IDivisionCodeMasterDocument extends DocumentData 
{
  companyCode: string;
  companyName: string;
  divisionCode: string;
  divisionName: string;
  brandName: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * ブランド変換マスタ情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IDivisionCodeMaster 
{
  companyCode: string;
  companyName: string;
  divisionCode: string;
  divisionName: string;
  brandName: string;
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * ブランド変換マスタのレコード情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IDivisionCodeMasterSheetRow 
{
  企業コード: string;
  企業名: string;
  部門コード: string;
  ブランド名: string; // 経理マスタ上のブランド名
  ブランド: string; // 商品マスタ上のブランド名
  createdAt: number;
  updatedAt: number;
}
