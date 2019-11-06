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


@api.get('/workinhand/summary')
@api.doc("""
/workinhand/queyrs
""")
# @auth.required
def get_workinhand_summary():

    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(
             DO.OrgId 
            ,DO.OrgName
            ,DPT.ProjectTypeDescription
            ,DPST.ProjectSubTypeDescription
            ,DED.EmployeeName.label("Director")
            ,func.SUM(FPF.AmountYetToInvoice).label("AmountYetToInvoice")
         )\
        .outerjoin(DD , FPF.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO , FPF.DimOrganisationKey == DO.DimOrganisationKey)\
        .outerjoin(DED , FPF.DimEmployeeDirectorKey == DED.DimEmployeeKey)\
        .outerjoin(DPT , FPF.DimProjectTypeKey == DPT.DimProjectTypeKey)\
        .outerjoin(DPST , FPF.DimProjectSubTypeKey == DPST.DimProjectSubTypeKey)

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))

    queryResult = query.group_by(DO.OrgId,DO.OrgName,DPT.ProjectTypeDescription,
        DPST.ProjectSubTypeDescription , DED.EmployeeName ).all()
    
   
    summarys = []
    for row in queryResult:
        item = {}
        item["OrgId"] = row[0];
        item["OrgName"] = row[1];
        item["Project Type"] = row[2];
        item["Project Sub Type"] = row[3];
        item["Director"] = row[4];
        item["AmountYetToInvoice"] = row[5];
        summarys.append(item)
    
    return summarys

@api.get('/workinhand/detail')
@api.doc("""
/workinhand/detail
""")
# @auth.required
def get_workinhand_detail():

    filter_data = {}
    if 'filter' in request.args:
        filter_data = json.loads(request.args.get('filter'))

    query = g.s\
        .query(
             DO.OrgId 
            ,DO.OrgName
            ,DD.FirstDayOfMonth.label("date")
            ,DP.ProjectId
            ,DP.ProjectName
            ,DC.ClientName
            ,DED.EmployeeName.label("ProjectDirector")
            ,DEPM.EmployeeName.label("ProjectManager")
            ,DES.EmployeeName.label("ProjectSupervisor")
            ,DPT.ProjectTypeDescription
            ,DPST.ProjectSubTypeDescription
            ,FPF.TotalProjectValue
            ,FPF.InvoicedToDate
            ,FPF.AmountYetToInvoice
            ,FPF.InvoiceForecast12Months
            ,FPF.InvoiceForecastGreaterThan12Months
            ,DD.FY
         )\
        .outerjoin(DD , FPF.DimDateKey == DD.DimDateKey)\
        .outerjoin(DO , FPF.DimOrganisationKey == DO.DimOrganisationKey)\
        .outerjoin(DP , FPF.DimProjectKey == DP.DimProjectKey)\
        .outerjoin(DC , FPF.DimClientKey == DC.DimClientKey)\
        .outerjoin(DED , FPF.DimEmployeeDirectorKey == DED.DimEmployeeKey)\
        .outerjoin(DEPM , FPF.DimEmployeeProjectManagerKey == DEPM.DimEmployeeKey)\
        .outerjoin(DES , FPF.DimEmployeeSupervisorKey == DES.DimEmployeeKey)\
        .outerjoin(DPT , FPF.DimProjectTypeKey == DPT.DimProjectTypeKey)\
        .outerjoin(DPST , FPF.DimProjectSubTypeKey == DPST.DimProjectSubTypeKey)

    if 'DimDateKey' in filter_data:
        query = query.filter(DD.DK.in_(filter_data['DimDateKey']))

    queryResult = query.all()
    
   
    details = []
    for row in queryResult:
        item = {}
        item["OrgId"] = row[0];
        item["OrgName"] = row[1];
        item["Date"] = row[2];
        item["ProjectId"] = row[3];
        item["ProjectName"] = row[4];
        item["ClientName"] = row[5];
        item["PDirector"] = row[6];
        item["PManager"] = row[7];
        item["Project Supervisor"] = row[8];
        item["Project Type"] = row[9];
        item["Project Sub Type"] = row[10];
        item["TotalProjectValue"] = row[11];
        item["InvoicedToDate"] = row[12];
        item["AmountYetToInvoice"] = row[13];
        item["IF12Months"] = row[14];
        item["IFGT12Months"] = row[15];
        item["FY"] = row[16];
        details.append(item)
    
    return details
