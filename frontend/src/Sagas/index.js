import { takeLatest, all } from 'redux-saga/effects';

import { creators as FeesActions } from '../Reducers/Fees';
import { creators as DebtorsActions } from '../Reducers/Debtors';
import { creators as FinancialYTDActions} from '../Reducers/FinancialYTD';
import { creators as BalanceSheetActions} from '../Reducers/BalanceSheet';
import { creators as WorkInHandActions} from '../Reducers/WorkInHand';

import { getFeesSummary, getFeesDetail } from './FeesSaga';
import { getDebtorsSummary, getDebtorsDetail } from './DebtorsSaga';
import { getFinancialYTDSummary , getFinancialYTDDetail} from './FinancialYTDSaga';
import {getBalanceSheetQuerys} from './BalanceSheetSaga';
import {getWorkInHandSummary , getWorkInHandDetail} from './WorkInHandSaga';
export default function * root () {
  yield all([

    takeLatest(FeesActions.feesSummaryRequest, getFeesSummary),

    takeLatest(FeesActions.feesDetailRequest, getFeesDetail),

    takeLatest(DebtorsActions.debtorsSummaryRequest, getDebtorsSummary),

    takeLatest(DebtorsActions.debtorsDetailRequest, getDebtorsDetail),

    takeLatest(FinancialYTDActions.fytdSummaryRequest, getFinancialYTDSummary),

    takeLatest(FinancialYTDActions.fytdDetailRequest, getFinancialYTDDetail),

    takeLatest(BalanceSheetActions.glbsQuerysRequest , getBalanceSheetQuerys),

    takeLatest(WorkInHandActions.workinhandSummaryRequest , getWorkInHandSummary),

    takeLatest(WorkInHandActions.workinhandDetailRequest , getWorkInHandDetail),

  ]);
}
