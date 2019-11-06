# -*- coding: utf-8 -*-
"""
"""

from __future__ import absolute_import
from __future__ import division
from __future__ import print_function

import json

from flask import g, request
from sqlalchemy import func
from sqlalchemy import case
from mr.api.app import api, auth
from mr.core.alias import *


@api.get('/balancesheet/querys')
@api.doc("""
/balancesheet/queyrs
""")
# @auth.required
def get_balancesheet_querys():

    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(
            DO.OrgId ,
            DO.OrgName, DD.DimDateKey , GLBS.BalanceSheetCategory ,
            COA.AccountType, COA.AccountSubType , COA.AccountNumber, COA.AccountName,
            GLBS.OpeningBalance, GLBS.ClosingBalance
         )\
        .outerjoin(COA , GLBS.DimChartOfAccountsKey == COA.DimChartOfAccountsKey)\
        .outerjoin(DCC , GLBS.DimCompanyKey == DCC.DimCompanyKey)\
        .outerjoin(DD , GLBS.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO , GLBS.DimOrganisationKey == DO.DimOrganisationKey)
        #.outerapply("").label("FY");

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))
    query = query.filter(GLBS.BalanceSheetCategory == 'Asset')
    queryResult = query.all()
    
    resultQuerys ={};
    resultQuerys["Assets"] = {};
    resultQuerys["Liability"] = {};
    resultQuerys["NetWorth"] = {};
    assets = []
    for row in queryResult:
        item = {}
        item['OrgId'] = row[0]
        item['OrgName'] = row[1]
        item['DimDate'] = row[2]
        item['BalanceSheetCategory'] = row[3]
        item['AccountType'] = (row[4])
        item['AccountSubType'] = (row[5])
        item['AccountNumber'] = (row[6])
        item['AccountName'] = (row[7])
        item['OpeningBalance'] = (round)(row[8])
        item['ClosingBalance'] = (round)(row[9])
        assets.append(item)

    resultQuerys["Assets"]  = assets
    
    
    query = g.s\
        .query(
            DO.OrgId ,
            DO.OrgName, DD.DimDateKey , GLBS.BalanceSheetCategory ,
            COA.AccountType, COA.AccountSubType , COA.AccountNumber, COA.AccountName,
            GLBS.OpeningBalance, GLBS.ClosingBalance
         )\
        .outerjoin(COA , GLBS.DimChartOfAccountsKey == COA.DimChartOfAccountsKey)\
        .outerjoin(DCC , GLBS.DimCompanyKey == DCC.DimCompanyKey)\
        .outerjoin(DD , GLBS.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO , GLBS.DimOrganisationKey == DO.DimOrganisationKey)
        #.outerapply("").label("FY");

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))

    query = query.filter(GLBS.BalanceSheetCategory == 'Liability')
    queryResult = query.all()
    liability = []
    for row in queryResult:
        item = {}
        item['OrgId'] = row[0]
        item['OrgName'] = row[1]
        item['DimDate'] = row[2]
        item['BalanceSheetCategory'] = row[3]
        item['AccountType'] = (row[4])
        item['AccountSubType'] = (row[5])
        item['AccountNumber'] = (row[6])
        item['AccountName'] = (row[7])
        item['OpeningBalance'] = (round)(row[8])
        item['ClosingBalance'] = (round)(row[9])
        liability.append(item)
    resultQuerys["Liability"]  = liability;

    query = g.s\
        .query(
            DO.OrgId ,
            DO.OrgName, DD.DimDateKey , GLBS.BalanceSheetCategory ,
            COA.AccountType, COA.AccountSubType , COA.AccountNumber, COA.AccountName,
            GLBS.OpeningBalance, GLBS.ClosingBalance
         )\
        .outerjoin(COA , GLBS.DimChartOfAccountsKey == COA.DimChartOfAccountsKey)\
        .outerjoin(DCC , GLBS.DimCompanyKey == DCC.DimCompanyKey)\
        .outerjoin(DD , GLBS.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO , GLBS.DimOrganisationKey == DO.DimOrganisationKey)
        #.outerapply("").label("FY");

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))

    query = query.filter(GLBS.BalanceSheetCategory == 'Net Worth')
    queryResult = query.all()
    networth = []
    for row in queryResult:
        item = {}
        item['OrgId'] = row[0]
        item['OrgName'] = row[1]
        item['DimDate'] = row[2]
        item['BalanceSheetCategory'] = row[3]
        item['AccountType'] = (row[4])
        item['AccountSubType'] = (row[5])
        item['AccountNumber'] = (row[6])
        item['AccountName'] = (row[7])
        item['OpeningBalance'] = (round)(row[8])
        item['ClosingBalance'] = (round)(row[9])
        networth.append(item)

    resultQuerys["NetWorth"]  = networth;
    
    return resultQuerys
