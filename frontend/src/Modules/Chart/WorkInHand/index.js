import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import { creators as WorkInHandActions } from '../../../Reducers/WorkInHand';
import { styles } from './style';
import { connect } from 'react-redux';

import TopChart from "./TopChart";
import BottomChart from "./BottomChart";

class WorkInHand extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false
    };

    this.handleFilter = this.handleFilter.bind(this);

  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    window.addEventListener('resize', this.onResize.bind(this));

    const { dimDate } = this.props;
    this.props.getWorkInHandSummary(dimDate);
    this.props.getWorkInHandDetail(dimDate);
  }

  componentWillUnmount() {

  }

  handleFilter = (event) => {
    this.props.updateFilter(event);
  };


  render() {
    const { classes, dir 
      ,summaryData, detailData, dimDate , filterName , selectedTopItems , 
    } = this.props;

    return (
      <div className={classes.root} dir={dir}>
       <TopChart
          summaryData={summaryData}
          filterName={filterName}
          selectedTopItems={selectedTopItems}
          handleFilter={this.handleFilter}
        />
        <BottomChart
          detailData={detailData}
          filterName={filterName}
          selectedTopItems={selectedTopItems}
          handleFilter={this.handleFilter}
        />
      </div>
    );
  }

}


WorkInHand.propTypes = {
  classes: PropTypes.object.isRequired,
  dir: PropTypes.string.isRequired,
  summaryData: PropTypes.array.isRequired,
  detailData: PropTypes.array.isRequired,
  dimDate: PropTypes.string.isRequired , 
  filterName: PropTypes.string.isRequired,
  selectedTopItems: PropTypes.array.isRequired,
};

const mapStateToProps = state => {
  return {
    dimDate: state.WorkInHand.dimDate,
    selectedTopItems: state.WorkInHand.selectedTopItems,
    filterName: state.WorkInHand.filterName,
    summaryData: state.WorkInHand.summaryData,
    detailData: state.WorkInHand.detailData,
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    updateFilter: (filter) => dispatch(WorkInHandActions.workinhandUpdateFilter(filter)),
    getWorkInHandSummary: (dimDate) => dispatch(WorkInHandActions.workinhandSummaryRequest(dimDate)),
    getWorkInHandDetail: (dimDate) => dispatch(WorkInHandActions.workinhandDetailRequest(dimDate)),
  }
};

export default withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(WorkInHand));

