# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Unicode, DateTime, ForeignKey, Date
from datetime import datetime
from sqlalchemy.dialects.postgresql import BIT
from .base import Base


class FactGeneralLedgerIncomeStatement(Base):

    """Docstring for FactGeneralLedgerIncomeStatement. """

    __tablename__ = 'FactGeneralLedgerIncomeStatement'

    FactGeneralLedgerIncomeStatementKey  = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer, ForeignKey('DimCompany.DimCompanyKey'))
    DimOrganisationKey = Column(Integer, ForeignKey('DimOrganisation.DimOrganisationKey'))
    DimDateKey = Column(Integer, ForeignKey('DimDate.DimDateKey'))
    IncomeStatementCategory = Column(Unicode(50) , nullable=False)
    IncomeStatementSubCategory = Column(Unicode(100) , nullable=False)
    Actual = Column(Integer, nullable=False , default=0)
    Budget = Column(Integer, nullable=False , default=0)
    Forecast = Column(Integer, nullable=False , default=0)
    ActualVsBudgetVariance = Column(Integer, nullable=False , default=0)
    ActualVsForecastVariance = Column(Integer, nullable=False , default=0)
    YTDActual = Column(Integer, nullable=False , default=0)
    YTDBudget = Column(Integer, nullable=False , default=0)
    YTDForecast = Column(Integer, nullable=False , default=0)
    YTDActualVsBudgetVariance = Column(Integer, nullable=False , default=0)
    YTDActualVsForecastVariance = Column(Integer, nullable=False , default=0)
    IsActive = Column(Integer, nullable=False , default=0)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)
    
    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'FactGeneralLedgerIncomeStatement({})'.format(self.FactGeneralLedgerIncomeStatementKey)
