import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IProductMaster3Document extends DocumentData
{
    //  - SKU
    //  - 販売手数料
    //  - 配送代行手数料
    sku: string;
    commission: string;
    shippingPrice: string;
    createdAt: number; // UnixTime
    updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタ情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IProductMaster3
{
    //  - SKU
    //  - 販売手数料
    //  - 配送代行手数料
    sku: string;
    commission: string;
    shippingPrice: string;
    createdAt: number; // UnixTime
    updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IProductMaster3Csv
{
    // ここで定義するのはスプレッドシートに書かれた列名である
    //  - SKU
    //  - 販売手数料
    //  - 配送代行手数料
    SKU: string;
    販売手数料: string;
    配送代行手数料: string;
}