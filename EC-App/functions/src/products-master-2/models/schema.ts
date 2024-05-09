import { DocumentData } from 'firebase-admin/firestore';

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタドキュメントのインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IProductMaster2Document extends DocumentData
{
    //  - 商品コード
    //  - 対応在庫ID
    //  - 税率区分
    //  - 通常価格（税込）
    //  - ブランド
    //  - 製品名
    inventoryId: string;
    leoId: string;
    taxRatio: string;
    sellingPrice: string;
    salesChannel: string;
    brandName: string;
    productName: string;
    createdAt: number; // UnixTime
    updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタ情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IProductMaster2
{
    //  - 商品コード
    //  - 対応在庫ID
    //  - 税率区分
    //  - 通常価格（税込）
    //  - ブランド
    //  - 製品名
    inventoryId: string;
    leoId: string;
    taxRatio: string;
    sellingPrice: string;
    brandName: string;
    salesChannel: string;
    productName: string;
    createdAt: number; // UnixTime
    updatedAt: number; // UnixTime
}

//-------------------------------------------------------------------------------
/**
 * 商品コードマスタCSV情報のインターフェイス
 */
//-------------------------------------------------------------------------------
export interface IProductMaster2Csv
{
    // ここで定義するのはスプレッドシートに書かれた列名である
    //  - 商品コード
    //  - 対応在庫ID
    //  - 税率区分
    //  - 通常価格（税込）
    //  - ブランド
    "商品コード": string;
    "対応在庫ID": string;
    "税率区分": string;
    "通常価格（税込）": string;
    "ブランド": string;
    "製品名": string;
    "販売先": string;
}

export const SalesChannelMap:{
    [key: string]: string

} = {
    "自社" : "自社カート",
    "Amazon" : "Amazon",
    "楽天" : "楽天市場",
    "Yahoo!" : "Yahoo!",
    "Qoo10" : "Qoo10"
}