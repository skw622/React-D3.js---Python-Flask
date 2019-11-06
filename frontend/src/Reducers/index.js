import { combineReducers } from 'redux';

import auth from './Auth';
import fees from './Fees';
import debtors from './Debtors';
import financialYTD from './FinancialYTD';
import BalanceSheet from './BalanceSheet';
import WorkInHand from './WorkInHand';
export default combineReducers({
  auth,
  fees,
  debtors,
  financialYTD,
  BalanceSheet,
  WorkInHand,
});
