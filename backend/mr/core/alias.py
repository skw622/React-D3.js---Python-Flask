# -*- coding: utf-8 -*-
"""
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

from sqlalchemy.orm import aliased

from . import models as m

GLIS = aliased(m.FactGeneralLedgerIncomeStatement)
GLBS = aliased(m.FactGeneralLedgerBalanceSheet)
DO = aliased(m.DimOrganisation)
DP = aliased(m.DimProject)
DC = aliased(m.DimClient)
DCC = aliased(m.DimCompany)
DED = aliased(m.DimEmployee)
DES = aliased(m.DimEmployee)
DEPM = aliased(m.DimEmployee)
DESU = aliased(m.DimEmployee)
DPT = aliased(m.DimProjectType)
DPST = aliased(m.DimProjectSubType)
DD = aliased(m.DimDate)
FPF = aliased(m.FactProjectFees)
FARI = aliased(m.FactAccountsReceivableInvoice)
FFM = aliased(m.FactFinancialMetric)
COA = aliased(m.DimChartOfAccounts)