export interface Log {
  messages: string[];
  errors: string[];
  createdAt: number;
  updatedAt: number;
}

//-------------------------------------------------------------------------------
/**
 * ログ関連のクラス
 */
//-------------------------------------------------------------------------------
export class CalculationLog implements Log {
  public messages: string[] = [];
  public errors: string[] = [];
  public createdAt: number = Date.now();
  public updatedAt: number = Date.now();

  //-------------------------------------------------------------------------------
  /**
   * コンストラクタ
   * @param inventoryId 在庫ID
   * @param orderId 注文ID
   */
  //-------------------------------------------------------------------------------
  constructor(private inventoryId: string, private orderId: string) {}

  //-------------------------------------------------------------------------------
  /**
   * メッセージログのストック
   * @param message 
   */
  //-------------------------------------------------------------------------------
  public message(message: string): void {
    this.messages.push(message);
    this.updatedAt = Date.now();
  }

  //-------------------------------------------------------------------------------
  /**
   * エラーログのストック
   * @param error エラー内容となるメッセージ
   */
  //-------------------------------------------------------------------------------
  public error(error: string): void {
    this.errors.push(error);
    this.updatedAt = Date.now();
  }

  //-------------------------------------------------------------------------------
  /**
   * ストックしたエラーログの件数を返却
   * @returns エラー件数
   */
  //-------------------------------------------------------------------------------
  public errorCount(): number {
    return this.errors.length;
  }
}
