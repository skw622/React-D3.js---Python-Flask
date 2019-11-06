import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import YearSelector from "../../../Common/Selectors/YearSelectorSingle";
import { withStyles } from '@material-ui/core/styles';
import TopChart from "./TopChart";
import BottomChart from "./BottomChart";
import { styles } from './style';

import { creators as FinancialYTDActions } from '../../../Reducers/FinancialYTD';

class FinancialPerformanceYTD extends Component {

  constructor(props) {
    super(props);

    this.state = {

    };

    this.handleYear = this.handleYear.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    console.log('Financial Performance YTD');
    window.addEventListener('resize', this.onResize.bind(this));
    var today = new Date();
    var month = today.getMonth() + 1;
    const { selectedYears } = this.props;
    selectedYears[0] = today.getFullYear()
    var { selectedYearMonth } = this.props;
    selectedYearMonth = today.getFullYear() + (month>9?month:("0" + month)) + "01";
 
    this.props.getFinancialYTDSummary(selectedYears);
    this.props.getFinancialYTDDetail(selectedYearMonth);
  }

  componentWillUnmount() {

  }

  handleYear = (event) => {
    this.handleFilter(event);

    event.selectedYearMonth = event.selectedYears[0] + "0101";
    this.props.getFinancialYTDSummary(event.selectedYears);
    this.props.getFinancialYTDDetail(event.selectedYearMonth);
    
  };

  handleFilter = (event) => {
    this.props.updateFilter(event);
    if(event.selectedYearMonth){
      this.props.getFinancialYTDDetail(event.selectedYearMonth);
    }
  };

  render() {
    const { classes, dir 
      , selectedYears , label , selectedMonths , selectedTopItems,
      summaryData, detailData , selectedYearMonth
    }  = this.props;

    return (
      <div className={classes.root} dir={dir}>
        <div className="wrapper">
           <YearSelector
              selectedYears={selectedYears}
              label={label}
              onChange={this.handleYear}
            />
        </div>
        <TopChart
          summaryData={summaryData}
          selectedYears={selectedYears}
          selectedMonths={selectedMonths}
          selectedTopItems={selectedTopItems}
          handleFilter={this.handleFilter}
        />
        <BottomChart
          detailData={detailData}
          selectedYears={selectedYears}
         
        />
      </div>
    );
  }

}

FinancialPerformanceYTD.propTypes = {
  classes: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,
  selectedYears: PropTypes.array.isRequired,
  label: PropTypes.string.isRequired,
  summaryData: PropTypes.array.isRequired,
  detailData: PropTypes.object.isRequired,
  selectedMonths: PropTypes.array.isRequired,
  selectedTopItems: PropTypes.array.isRequired,
  selectedYearMonth: PropTypes.string.isRequired,
};

const mapStateToProps = state => {
  return {
    selectedYears: state.financialYTD.selectedYears,
    selectedMonths: state.financialYTD.selectedMonths,
    label: state.financialYTD.label,
    summaryData: state.financialYTD.summaryData,
    detailData: state.financialYTD.detailData,
    selectedTopItems: state.financialYTD.selectedTopItems,
    selectedYearMonth: state.financialYTD.selectedYearMonth,
  }
}; 

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilter: (filter) => dispatch(FinancialYTDActions.fytdUpdateFilter(filter)),
    getFinancialYTDSummary: (selectedYears) => dispatch(FinancialYTDActions.fytdSummaryRequest(selectedYears)),
    getFinancialYTDDetail: (selectedYearMonth) => dispatch(FinancialYTDActions.fytdDetailRequest(selectedYearMonth)),
  }
};


export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(FinancialPerformanceYTD));
