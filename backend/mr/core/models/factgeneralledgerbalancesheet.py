# -*- coding: utf-8 -*-
"""
"""

from __future__ import division
from __future__ import absolute_import
from __future__ import print_function

from sqlalchemy import Column, Integer, Unicode, DateTime, Date, Numeric, ForeignKey
from datetime import datetime
from sqlalchemy.dialects.postgresql import BIT
from sqlalchemy.orm import relationship

from .base import Base


class FactGeneralLedgerBalanceSheet(Base):

    """Docstring for FactGeneralLedgerBalanceSheet. """

    __tablename__ = 'FactGeneralLedgerBalanceSheet'

    FactGeneralLedgerBalanceSheetKey  = Column(Integer, primary_key=True, autoincrement=True)
    DimCompanyKey = Column(Integer, ForeignKey('DimCompany.DimCompanyKey'))
    DimOrganisationKey = Column(Integer, ForeignKey('DimOrganisation.DimOrganisationKey'))
    DimDateKey = Column(Integer, ForeignKey('DimDate.DimDateKey'))
    DimChartOfAccountsKey = Column(Integer, nullable=False , default=0)
    BalanceSheetCategory = Column(Unicode(50))
    OpeningBalance = Column(Numeric(precision=19, scale=2))
    ClosingBalance = Column(Numeric(precision=19, scale=2))
    IsActive = Column(BIT)
    CreateDate = Column(DateTime, default=datetime.utcnow)
    ModDate = Column(DateTime, onupdate=datetime.utcnow, default=datetime.utcnow)
    

    def __repr__(self):
        """TODO: Docstring for __repr__.
        :returns: TODO

        """
        return 'FactGeneralLedgerBalanceSheet({})'.format(self.FactGeneralLedgerBalanceSheetKey)
