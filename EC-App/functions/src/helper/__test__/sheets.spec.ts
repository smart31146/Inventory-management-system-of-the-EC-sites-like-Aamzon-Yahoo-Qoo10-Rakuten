import { describe, expect, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { convertValuesToJson } from '../sheets/convertValuesToJson';
import { getValuesFromSheets } from '../sheets/getValuesFromSheets';
import { appendValuesToSheets } from '../sheets/appendValuesToSheets';

jest.setTimeout(10000);

initTesting();

describe('helper function', () => {
  it('getValuesFromSheets', async () => {
    /*
    const values = await getValuesFromSheets({
      range: '【採番用】商品マスタ!A3:AW',
      spreadsheetId: '1reWI00hRA0QnVyuNG2HFqX8jMlB4I-sNF4ZvgMpjh_k',
    });
    const json = convertValuesToJson(values);
    console.log(json);
    */
  });

  it('appendValuesToSheets', async () => {
    /**
     * テスト出力用
     * https://docs.google.com/spreadsheets/d/1eMLALJIrIcjoEksk1HtdpKGeX44UDqQESRma732ck5k/edit#gid=0
     */
    // expect(await appendValuesToSheets({
    //   range: '単体テスト',
    //   spreadsheetId: '1eMLALJIrIcjoEksk1HtdpKGeX44UDqQESRma732ck5k',
    //   valueInputOption: 'RAW',
    //   includeValuesInResponse: true,
    //   requestBody: {
    //     values: [['2021/01/01', '楽天', '1', '1', '1']],
    //   },
    // })).toBeUndefined();
  });
});
