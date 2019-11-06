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


@api.get('/financialperformanceYTD/summary')
@api.doc("""
Get financial performance summary data.
""")
# @auth.required
def get_financialperformanceYTD_summary():

    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(
            DO.OrgName, DD.DimDateKey , DD.MonthName ,
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.Actual * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.Actual],])).label("Profit"),
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense",GLIS.Forecast * -1],[GLIS.IncomeStatementCategory != "Expense" , GLIS.Forecast],])).label("ForecastProfit"),
            func.sum(case([[GLIS.IncomeStatementCategory == "Income",GLIS.Actual],[GLIS.IncomeStatementCategory != "Income",0],])).label("Income")
         )\
        .outerjoin(DD , GLIS.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO , GLIS.DimOrganisationKey == DO.DimOrganisationKey)
        #.outerapply("").label("FY");

    if 'FYs' in filter_data:
        query = query.filter(DD.FY.in_(filter_data['FYs']))

    summary = query.group_by(DO.OrgId, DO.OrgName, DD.DimDateKey, DD.MonthName).order_by(DD.DimDateKey).all()
 
    resp = []
    for row in summary:
        item = {}
        item['OrgId'] = row[0]
        item['DimDate'] = row[1]
        item['MonthName'] = row[2]
        item['Profit'] = (round)(row[3])
        item['ForecastProfit'] = (round)(row[4])
        item['Income'] = (round)(row[5])
        resp.append(item)

    return resp

@api.get('/financialperformanceYTD/detail')
@api.doc("""
financialperformanceYTD detail data.
""")
# @auth.required
def get_financialperformanceYTD_detail():
  
    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(DO.OrgId, 
            DO.OrgName,
            DD.DimDateKey, 
            GLIS.IncomeStatementCategory, 
            GLIS.IncomeStatementSubCategory, 
            GLIS.Actual, 
            GLIS.Budget,
            GLIS.Forecast, 
            GLIS.ActualVsBudgetVariance, 
            GLIS.ActualVsForecastVariance, 
            GLIS.YTDActual,
            GLIS.YTDBudget, 
            GLIS.YTDForecast, 
            GLIS.YTDActualVsBudgetVariance,
            GLIS.YTDActualVsForecastVariance)\
        .outerjoin(DCC,GLIS.DimCompanyKey == DCC.DimCompanyKey)\
        .outerjoin(DD,GLIS.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO,GLIS.DimOrganisationKey == DO.DimOrganisationKey)

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))

    incomeexpense = query.order_by(GLIS.IncomeStatementCategory, GLIS.IncomeStatementSubCategory).all()
    
    query = g.s\
        .query(DO.OrgId, 
            DO.OrgName,
            DD.DimDateKey, 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.Actual * (-1)],[GLIS.IncomeStatementCategory != "Expense",GLIS.Actual],])).label("ActualProfit"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.Budget * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.Budget],])).label("BudgetProfit"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.Forecast * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.Forecast],])).label("ForecastProfit"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.ActualVsBudgetVariance * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.ActualVsBudgetVariance],])).label("ActualVsBudgetProfitVariance"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.ActualVsForecastVariance * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.ActualVsForecastVariance],])).label("ActualVsForecastProfitVariance"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.YTDActual * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.YTDActual],])).label("YTDActualProfit"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.YTDBudget * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.YTDBudget],])).label("YTDBudgetProfit"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.YTDForecast * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.YTDForecast],])).label("YTDForecastProfit"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.YTDActualVsBudgetVariance * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.YTDActualVsBudgetVariance],])).label("YTDActualVsBudgetProfitVariance"), 
            func.sum(case([[GLIS.IncomeStatementCategory == "Expense", GLIS.YTDActualVsForecastVariance * -1],[GLIS.IncomeStatementCategory != "Expense",GLIS.YTDActualVsForecastVariance],])).label("YTDActualVsForecastProfitVariance")
            )\
        .outerjoin(DD,GLIS.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO,GLIS.DimOrganisationKey == DO.DimOrganisationKey)\
        .outerjoin(DCC,GLIS.DimCompanyKey == DCC.DimCompanyKey)

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))

    profitline = query.group_by(DO.OrgId,DO.OrgName,DD.DimDateKey).all()

    detail = {}
    detail["IncomeExpense"] = []
    detail["Profit"] = []
    resp = []
    for row in incomeexpense:
        item = {}
        item['OrgId'] = row[0]
        item['OrgName'] = row[1]
        item['DimDateKey'] = row[2]
        item['IncomeStatementCategory'] = row[3]
        item['IncomeStatementSubCategory'] = row[4]
        item['Actual'] = round((float)(row[5]))
        item['Budget'] = round((float)(row[6]))
        item['Forecast'] = round((float)(row[7]))
        item['ActualVsBudgetVariance'] = round((float)(row[8]))
        item['ActualVsForecastVariance'] = round((float)(row[9]))
        item['YTDActual'] = round((float)(row[10]))
        item['YTDBudget'] = round((float)(row[11]))
        item['YTDForecast'] = round((float)(row[12]))
        item['YTDActualVsBudgetVariance'] = round((float)(row[13]))
        item['YTDActualVsForecastVariance'] = round((float)(row[14]))
        resp.append(item)
    detail["IncomeExpense"] = resp
    
    resp = []
    for row in profitline:
        item = {}
        item['OrgId'] = row[0]
        item['OrgName'] = row[1]
        item['DimDateKey'] = row[2]
        item['ActualProfit'] = round((float)(row[3]))
        item['BudgetProfit'] = round((float)(row[4]))
        item['ForecastProfit'] = round((float)(row[5]))
        item['ActualVsBudgetProfitVariance'] = round((float)(row[6]))
        item['ActualVsForecastProfitVariance'] = round((float)(row[7]))
        item['YTDActualProfit'] = round((float)(row[8]))
        item['YTDBudgetProfit'] = round((float)(row[9]))
        item['YTDForecastProfit'] = round((float)(row[10]))
        item['YTDActualVsBudgetProfitVariance'] = round((float)(row[11]))
        item['YTDActualVsForecastProfitVariance'] = round((float)(row[12]))
        resp.append(item)
    detail["Profit"] = resp   
    
    return detail