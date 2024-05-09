import { describe, it, jest } from '@jest/globals';
import { initTesting } from '../../helper/test-util';
import { rakutenCalculationTask } from '../calc/tasks/rakutenCalculationTask';
import { amazonCalculationTask } from '../calc/tasks/amazonCalculationTask';
import { yahooCalculationTask } from '../calc/tasks/yahooCalculationTask';
import { qoo10CalculationTask } from '../calc/tasks/qoo10CalculationTask';
import { Message } from 'firebase-functions/v1/pubsub';
import { CalculationTaskRunner } from '../calc/CalculationTaskRunner';
import { calcFinalizedSalesByProduct } from '../../finalized-sales-by-product/calc';
import { outputFinalizedSalesToSheet } from '../../finalized-sales-by-product/output';
import { outputFinalizedSalesBrandOfProductToSheet }from '../../finalized-sales-by-brand/output';

jest.setTimeout(200000);

const { wrap } = initTesting();

describe('batch of finalized shipping', () => {
  it('E2E: runCalculation', async () => {
    // const runCalculation = wrap(_runCalculation);
    // await runCalculation({} as Message, {});
  });

  //--------------------------------------------------------------------------------------------
  it('Unit Test: rakutenCalculationTask', async () => {
    /*
    // 指定日
    const finalizedAt = new Date('2024-01-05');
    
    // const runner = new CalculationTaskRunner([rakutenCalculationTask]);
    // const { fulfilledResult, rejectedResult } = await runner.run(
    //   new Date('2023-12-12UTC+9')
    // );
    // console.log(fulfilledResult);
    // console.log(rejectedResult);

    /*
    // 指定日
    const finalizedAt = new Date('2024-01-30UTC+9');

    // 演算処理
    const runner = new CalculationTaskRunner([rakutenCalculationTask]);
    const { fulfilledResult, rejectedResult } = await runner.run(
      finalizedAt
    );
    //console.log(fulfilledResult);
    //console.log(rejectedResult);

    console.log("fulfilledResult");
    console.log(fulfilledResult);

    // 集計処理
    const result2 = await calcFinalizedSalesByProduct(fulfilledResult);
    //console.log(result2);

    // 指定日を日本時間に設定
    let date = new Date(finalizedAt.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))

    //console.log("result2");
    //console.log(result2);

    // スプレッドシートへの出力
    await outputFinalizedSalesToSheet({
      fs: result2,
      finalizedAt: date,
      _sheetId: process.env.SHEET_ID ||  '1eMLALJIrIcjoEksk1HtdpKGeX44UDqQESRma732ck5k',
      // => pls remove 1eMLALJIrIcjoEksk1HtdpKGeX44UDqQESRma732ck5k after release
    });

    // ブランド別集計処理
    await outputFinalizedSalesBrandOfProductToSheet({
      fs: result2,
      finalizedAt: date,
      _sheetId: process.env.SHEET_ID ||  '12SvLbx0EndxsEQEFDDg2l_8RPe_KXVh52J23VsSMDIg',
    });
    */
  });

  //--------------------------------------------------------------------------------------------
  it('Unit Test: amazonCalculationTask', async () => {

    // 指定日
    const finalizedAt = new Date('2024-01-19UTC+9');

    // 演算処理
    const runner = new CalculationTaskRunner([amazonCalculationTask]);
    const { fulfilledResult, rejectedResult } = await runner.run(
      finalizedAt
    );
    //console.log(fulfilledResult);
    //console.log(rejectedResult);

    // 集計処理
    const result2 = await calcFinalizedSalesByProduct(fulfilledResult);
    //console.log(result2);

    // 指定日を日本時間に設定
    let date = new Date(finalizedAt.toLocaleString('en-US', { timeZone: 'Asia/Tokyo' }))

    // スプレッドシートへの出力
    await outputFinalizedSalesToSheet({
      fs: result2,
      finalizedAt: date,
    });

    // ブランド別集計処理
    await outputFinalizedSalesBrandOfProductToSheet({
      fs: result2,
      finalizedAt: date,
    });
    
  });

  //--------------------------------------------------------------------------------------------
  it('Unit Test: yahooCalculationTask', async () => {
    /*
    const runner = new CalculationTaskRunner([yahooCalculationTask]);
    const { fulfilledResult, rejectedResult } = await runner.run(
      new Date('2023-12-04UTC+9')
    );
    console.log(fulfilledResult);
    //console.log(rejectedResult);
    */
  });

  //--------------------------------------------------------------------------------------------
  it('Unit Test: qoo10CalculationTask', async () => {
    /*
    const runner = new CalculationTaskRunner([qoo10CalculationTask]);
    const { fulfilledResult, rejectedResult } = await runner.run(
      new Date('2023-12-04UTC+9')
    );
    console.log("[ fulfilledResult ]");
    console.log(fulfilledResult);
    console.log(rejectedResult);
    */
  });
});
