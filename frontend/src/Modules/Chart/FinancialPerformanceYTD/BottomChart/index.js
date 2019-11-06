import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { scaleBand, scaleLinear } from '@vx/scale';
import {
  Bar
} from '@vx/shape';
import {Group} from "@vx/group";
import {AxisBottom} from "@vx/axis";
import { withTooltip, Tooltip } from "@vx/tooltip";
import {max} from "d3-array";

import { withStyles } from '@material-ui/core/styles';
import {
  Grid ,Select,
  MenuItem,
  ListItemText
} from '@material-ui/core';

import {  
  getParams,
  getMonth,
  isEqualList,
  isEqualObjList,
  thousandFormat,
  thousandFormat2
} from "../../../../Utils/Functions";
import {
  positiveActiveColor,
  positiveDisableColor,
  negativeActiveColor,
  negativeDisableColor,
  barHeight,
  ship,
  axis,
  tooltip,
  item,
  empty, barThinHeight, thinItem , adjWF,subtitle_inv
} from "../../../../Assets/js/constant";
// import detailData from '../../../../MockData/Fees/detail';

import { styles } from './style';

// accessors
const x = d => d.ActualFees;
const xF = d => d.ForecastFees;
const y = d => d.ProjectId;


class BottomChart extends Component {

  constructor(props) {
    super(props);

    this.state = {
      resize: false,

      data: [],
      hoverBar: null,
      selectedIdRects: [],
      selectedOption: "Forecast"
    };

    this.prepareData = this.prepareData.bind(this);
    this.handleElement = this.handleElement.bind(this);
    this.deSelectAll = this.deSelectAll.bind(this);
  }

  onResize() {
    this.setState({resize: !this.state.resize});
  }

  componentDidMount() {
    this.prepareData();
    window.addEventListener('resize', this.onResize.bind(this));
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  componentDidUpdate(prevProps, prevState){
    /*if (
      prevProps.detailData.length !== this.props.detailData.length
      || !isEqualList(prevProps.selectedYears, this.props.selectedYears)
      || !isEqualList(prevProps.selectedMonths, this.props.selectedMonths)
      || !isEqualObjList(prevProps.selectedTopItems, this.props.selectedTopItems)
      || !isEqualList(prevProps.selectedMiddleItems, this.props.selectedMiddleItems)
      || prevProps.filterName !== this.props.filterName
    ) {*/
      if(prevProps.detailData !== this.props.detailData)
        this.prepareData();
     // this.deSelectAll();
    //}
  }

  prepareData = () => {
    const { detailData,  selectedYears } = this.props;

    let dictData = {};
    let data = [];

    /*let _selectedMonths = selectedMonths.slice();
    selectedTopItems.forEach(topItem => {
      _selectedMonths.push(topItem['month']);
    });*/

    var index = 1;
    let TotalIncome = [];
    TotalIncome["Income"] = [];
    TotalIncome["Expense"] = [];
    TotalIncome["Income"]["Actual"] = 0;
    TotalIncome["Income"]["Budget"] = 0;
    TotalIncome["Income"]["Forecast"] = 0;
    TotalIncome["Income"]["ActualVsBudgetVariance"] = 0;
    TotalIncome["Income"]["ActualVsForecastVariance"] = 0;
    TotalIncome["Income"]["YTDActual"] = 0;
    TotalIncome["Income"]["YTDBudget"] = 0;
    TotalIncome["Income"]["YTDForecast"] = 0;
    TotalIncome["Income"]["YTDActualVsBudgetVariance"] = 0;
    TotalIncome["Income"]["YTDActualVsForecastVariance"] = 0;

    TotalIncome["Expense"]["Actual"] = 0;
    TotalIncome["Expense"]["Budget"] = 0;
    TotalIncome["Expense"]["Forecast"] = 0;
    TotalIncome["Expense"]["ActualVsBudgetVariance"] = 0;
    TotalIncome["Expense"]["ActualVsForecastVariance"] = 0;
    TotalIncome["Expense"]["YTDActual"] = 0;
    TotalIncome["Expense"]["YTDBudget"] = 0;
    TotalIncome["Expense"]["YTDForecast"] = 0;
    TotalIncome["Expense"]["YTDActualVsBudgetVariance"] = 0;
    TotalIncome["Expense"]["YTDActualVsForecastVariance"] = 0;


    Object.keys(detailData).map(key => {
      if(key == "IncomeExpense")
      {
        if(detailData[key]){
        detailData[key].forEach(item => {
            index++;
            dictData[index] = {};
            dictData[index]["IncomeStatementCategory"] = item["IncomeStatementCategory"];
            dictData[index]["Actual"] = item["Actual"];
            dictData[index]["Budget"] = item["Budget"];
            dictData[index]["Forecast"] = item["Forecast"];
            dictData[index]["ActualVsBudgetVariance"] = item["ActualVsBudgetVariance"];
            dictData[index]["ActualVsForecastVariance"] = item["ActualVsForecastVariance"];
            dictData[index]["YTDActual"] = item["YTDActual"];
            dictData[index]["YTDBudget"] = item["YTDBudget"];
            dictData[index]["YTDForecast"] = item["YTDForecast"];
            dictData[index]["YTDActualVsBudgetVariance"] = item["YTDActualVsBudgetVariance"];
            dictData[index]["YTDActualVsForecastVariance"] = item["YTDActualVsForecastVariance"];
            dictData[index]["IncomeStatementSubCategory"] = item["IncomeStatementSubCategory"];
            if(item["IncomeStatementCategory"] == "Income" || item["IncomeStatementCategory"] == "Expense")
            {
              if(item["IncomeStatementSubCategory"] != "Extra Ordinary" && 
                item["IncomeStatementSubCategory"] != "Other Income")
              { 
                TotalIncome[item["IncomeStatementCategory"]]["Actual"] += item["Actual"];
                TotalIncome[item["IncomeStatementCategory"]]["Budget"] += item["Budget"];
                TotalIncome[item["IncomeStatementCategory"]]["Forecast"] += item["Forecast"];
                TotalIncome[item["IncomeStatementCategory"]]["ActualVsBudgetVariance"] += item["ActualVsBudgetVariance"];
                TotalIncome[item["IncomeStatementCategory"]]["ActualVsForecastVariance"] += item["ActualVsForecastVariance"];
                TotalIncome[item["IncomeStatementCategory"]]["YTDActual"] += item["YTDActual"];
                TotalIncome[item["IncomeStatementCategory"]]["YTDBudget"] += item["YTDBudget"];
                TotalIncome[item["IncomeStatementCategory"]]["YTDForecast"] += item["YTDForecast"];
                TotalIncome[item["IncomeStatementCategory"]]["YTDActualVsBudgetVariance"] += item["YTDActualVsBudgetVariance"];
                TotalIncome[item["IncomeStatementCategory"]]["YTDActualVsForecastVariance"] += item["YTDActualVsForecastVariance"];
              }
            } 
        });
            
          if(index > 1)
          {
            index++;
            dictData[index ] = {};
            dictData[index ]["Total"]  = TotalIncome;
            dictData[index ]["PProfit"]  = {};

            dictData[index ]["PProfit"]["Actual"] = (
              ((TotalIncome["Income"]["Actual"] - TotalIncome["Expense"]["Actual"]) / TotalIncome["Income"]["Actual"]) * 100);

            dictData[index ]["PProfit"]["Budget"] = (
              ((TotalIncome["Income"]["Budget"] - TotalIncome["Expense"]["Budget"]) / TotalIncome["Income"]["Budget"]) * 100);

            dictData[index ]["PProfit"]["Forecast"] = (
              ((TotalIncome["Income"]["Forecast"] - TotalIncome["Expense"]["Forecast"]) / TotalIncome["Income"]["Forecast"]) * 100);

            dictData[index ]["PProfit"]["ActualVsBudgetVariance"] = dictData[index ]["PProfit"]["Actual"] - dictData[index ]["PProfit"]["Budget"];
            /*thousandFormat(
              ((TotalIncome["Income"]["ActualVsBudgetVariance"] - TotalIncome["Expense"]["ActualVsBudgetVariance"]) / TotalIncome["Income"]["ActualVsBudgetVariance"]) * 100);*/

            dictData[index ]["PProfit"]["ActualVsForecastVariance"] = dictData[index ]["PProfit"]["Actual"] - dictData[index ]["PProfit"]["Forecast"];
            /*thousandFormat(
              ((TotalIncome["Income"]["ActualVsForecastVariance"] - TotalIncome["Expense"]["ActualVsForecastVariance"]) / TotalIncome["Income"]["ActualVsForecastVariance"]) * 100);*/

            dictData[index ]["PProfit"]["YTDActual"] = (
              ((TotalIncome["Income"]["YTDActual"] - TotalIncome["Expense"]["YTDActual"])/TotalIncome["Income"]["YTDActual"]) * 100);

            dictData[index ]["PProfit"]["YTDBudget"] =  (
              ((TotalIncome["Income"]["YTDBudget"] - TotalIncome["Expense"]["YTDBudget"]) / TotalIncome["Income"]["YTDBudget"]) * 100);

              dictData[index ]["PProfit"]["YTDForecast"] = (
              ((TotalIncome["Income"]["YTDForecast"] - TotalIncome["Expense"]["YTDForecast"]) / TotalIncome["Income"]["YTDForecast"]) * 100);

            dictData[index ]["PProfit"]["YTDActualVsBudgetVariance"] = dictData[index ]["PProfit"]["YTDActual"] - dictData[index ]["PProfit"]["YTDBudget"] ;
            /*thousandFormat(
              ((TotalIncome["Income"]["YTDActualVsBudgetVariance"] - TotalIncome["Expense"]["YTDActualVsBudgetVariance"]) / TotalIncome["Income"]["YTDActualVsBudgetVariance"]) * 100);*/

            dictData[index ]["PProfit"]["YTDActualVsForecastVariance"] = dictData[index ]["PProfit"]["YTDActual"] - dictData[index ]["PProfit"]["YTDForecast"];
            /*thousandFormat(
              ((TotalIncome["Income"]["YTDActualVsForecastVariance"] - TotalIncome["Expense"]["YTDActualVsForecastVariance"]) / TotalIncome["Income"]["YTDActualVsForecastVariance"]) * 100);*/

          }
        }

      }
      
      /*else if(key == "Profit")
      {
        detailData[key].forEach(item => {
            dictData[1] = {};

            dictData[1]["Actual"] = item["ActualProfit"];
            dictData[1]["Budget"] = item["BudgetProfit"];
            dictData[1]["Forecast"] = item["ForecastProfit"];
            dictData[1]["ActualVsBudgetVariance"]   = item["ActualVsBudgetProfitVariance"];
            dictData[1]["ActualVsForecastVariance"] = item["ActualVsForecastProfitVariance"];
            dictData[1]["YTDActual"]    = item["YTDActualProfit"];
            dictData[1]["YTDBudget"]    = item["YTDBudgetProfit"];
            dictData[1]["YTDForecast"]  = item["YTDForecastProfit"];
            dictData[1]["YTDActualVsBudgetVariance"]    = item["YTDActualVsBudgetProfitVariance"];
            dictData[1]["YTDActualVsForecastVariance"]  = item["YTDActualVsForecastProfitVariance"];
        });
      }*/

    });
    
    if(dictData)
    {
      dictData[1] = {};
      dictData[1]["Actual"] = (
              (TotalIncome["Income"]["Actual"] - TotalIncome["Expense"]["Actual"]));
      dictData[1]["Budget"] = (
              (TotalIncome["Income"]["Budget"] - TotalIncome["Expense"]["Budget"]));
      dictData[1]["Forecast"] = (
              (TotalIncome["Income"]["Forecast"] - TotalIncome["Expense"]["Forecast"]));
      dictData[1]["ActualVsBudgetVariance"] = (
              (TotalIncome["Income"]["ActualVsBudgetVariance"] + TotalIncome["Expense"]["ActualVsBudgetVariance"]));
      dictData[1]["ActualVsForecastVariance"] = (
              (TotalIncome["Income"]["ActualVsForecastVariance"] + TotalIncome["Expense"]["ActualVsForecastVariance"]));
      dictData[1]["YTDActual"] = (
              (TotalIncome["Income"]["YTDActual"] - TotalIncome["Expense"]["YTDActual"]));
      dictData[1]["YTDBudget"] = (
              (TotalIncome["Income"]["YTDBudget"] - TotalIncome["Expense"]["YTDBudget"]) );
      dictData[1]["YTDForecast"] = (
              (TotalIncome["Income"]["YTDForecast"] - TotalIncome["Expense"]["YTDForecast"]));
      dictData[1]["YTDActualVsBudgetVariance"] = (
              (TotalIncome["Income"]["YTDActualVsBudgetVariance"] + TotalIncome["Expense"]["YTDActualVsBudgetVariance"]) );
      dictData[1]["YTDActualVsForecastVariance"] = (
              (TotalIncome["Income"]["YTDActualVsForecastVariance"] - TotalIncome["Expense"]["YTDActualVsForecastVariance"]));
    }
    Object.keys(dictData).map(key => {
      data.push(dictData[key]);
      
    });

    this.setState({data});
    this.deSelectAll();
  };



  handleElement = (event, element, data) => {
    const {  selectedIdRects} = this.state;
    let  _selectedIdRects = []
    let exist = false, index = NaN;

    switch (element) {
      

      case 'table':
        if (event.shiftKey) {

          _selectedIdRects = selectedIdRects.slice();

          for (let i = 0; i < selectedIdRects.length; i++) {
            if (selectedIdRects[i] === event.target) {
              index = i;
              break;
            }
          }

          if (isNaN(index)) {
            event.target.classList.add('bkgActive');
            _selectedIdRects.push(event.target);
           
          } else {
            event.target.classList.remove('bkgActive');
            _selectedIdRects.splice(index, 1);
        
          }

        } else {

          selectedIdRects.forEach(rect => {
            rect.classList.remove('bkgActive');
            if (rect === event.target) exist = true;
          });

          if (exist && selectedIdRects.length === 1) {

            _selectedIdRects = [];
 
          } else {
            event.target.classList.add('bkgActive');

            _selectedIdRects = [event.target];
  
          }
        }
        break;

      default:
        break;
    }

    this.setState({

      selectedIdRects: _selectedIdRects

    });
  };

  deSelectAll = () => {
    const { selectedIdRects} = this.state;


    selectedIdRects.forEach(rect => {
      rect.classList.remove('bkgActive');
    });


    this.setState({

      selectedIdRects: []
    });
  };

  showTooltip = (event, data, table  , op = "") => {
    const { showTooltip } = this.props;
    const { selectedOption } = this.props;

    let tooltipData, top, left;

    top = event.clientY  - 500;
    left = event.clientX;
    if(data)
      if(op == "imax")
      {
          tooltipData = data["Total"]["Income"];
          tooltipData['char'] = "$";
      } 
      else if(op == "emax")
      {
          tooltipData = data["Total"]["Expense"]
          tooltipData['char'] = "$";
      }
      else if(op == "probit")
      {
          tooltipData = data["Profit"];
          tooltipData['char'] = "$";
      }
      else if(op == "pprofit")
      {
          tooltipData = data["PProfit"];
          tooltipData['char'] = "%";
      }else{
          tooltipData = data;
          tooltipData['char'] = "$";
      }
    

    tooltipData['option'] = table;

    if (table) {
      const { hoverBar } = this.state;
      if (hoverBar) hoverBar.classList.remove('barHover');
      event.target.classList.add('barHover');
      this.setState({hoverBar: event.target});
    }

    showTooltip({
      tooltipData: tooltipData,
      tooltipTop: top,
      tooltipLeft: left
    });
  };

  hideTooltip = () => {
    const { hideTooltip } = this.props;
    const { hoverBar } = this.state;

    if (hoverBar) hoverBar.classList.remove('barHover');
    this.setState({hoverBar: null});

    hideTooltip();
  };

  render() {
    const {
      classes,
      tooltipOpen, tooltipLeft, tooltipTop, tooltipData , selectedOption
    } = this.props;

    const { data } = this.state;
    const count = data.length;

    const cellwidth = window.innerWidth / 7 - 5;

    const width = (window.innerWidth - 15) * 3 / 4;
    const height = count * barThinHeight;
    const margin = {
      top: 0,
      right: 0,
      bottom: 0,
      left: 0
    };

    const { pageYOffset, xMax, yMax } = getParams(window, width, height, margin);

    const handleChange = name => event => {
      const { selectedOption } = this.state;
      this.setState({selectedOption : event.target.value});
  };

    let tooltipTimeout;

    return (
      <div className={classes.root}>
        <div>
          <div >Profit / Loss vs &nbsp; &nbsp; &nbsp;
            <Select native onChange={handleChange("Forecast")}>
            <option value={"Forecast"}>Forecast</option>
            <option value={"Budget"}>Budget</option>

            </Select>
          </div>
          
        </div>
        {count > 0 ?
          <div className="well">
            <div >
              <Grid container>
                <Grid item md={"auto"} sm={5} xs={5}>

                    <div  className="flex" align="center">
                      <p style={adjWF(cellwidth/2 , 14, 0 )} className={` subtitle`}>
                      </p>
                      <p style={adjWF(cellwidth/2 , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      </p>
                      <p style={adjWF(cellwidth , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      MTD Actual
                      </p>
                      <p style={adjWF(cellwidth , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      MTD Budget/FC
                      </p>
                      <p style={adjWF(cellwidth , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      MTD Variable
                      </p>
                      <p style={adjWF(cellwidth , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      YTD Actual
                      </p>
                      <p style={adjWF(cellwidth , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      YTD Budget/FC
                      </p>
                      <p style={adjWF(cellwidth , 14, 0 )} className={`${classes.leftItem} subtitle`}>
                      YTD Variable
                      </p>
                    </div>

                 </Grid>

              </Grid>

              { /************** Income Data *******************/ }
              <Grid container>
                <Grid item md={"auto"} sm={8} xs={8}>
                     {data.map((d, i) => {
                            let index ;
                             const { selectedOption } = this.state;
                            if(d["IncomeStatementCategory"] == "Income")
                            {
                              return (                              
                                  <div  className={i%2==1?`flex tableColor1`:`flex`} key = {i} >
                                    <p style={adjWF(cellwidth* 1/3 , 12)} className={`${classes.leftItem} grayHover tableColor2`}>
                                      {d["IncomeStatementSubCategory"]=="Income"?d["IncomeStatementSubCategory"]:""}
                                    </p>
                                    <p style={adjWF(cellwidth* 2/3 , 12)} className={`${classes.leftItem} grayHover`}>
                                      {d["IncomeStatementSubCategory"]}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["Actual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["Forecast"]):thousandFormat2(d["Budget"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["ActualVsForecastVariance"]):thousandFormat2(d["ActualVsBudgetVariance"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["YTDActual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["YTDForecast"]):thousandFormat2(d["YTDBudget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["YTDActualVsForecastVariance"]):thousandFormat2(d["YTDActualVsBudgetVariance"])}
                                    </p>
                                  </div>
                                 
                                )
                            }
                        })}
                        {/************** Income Total Data *******************/ }
                        {data.map((d, i) => {
                            let index ;
                             const { selectedOption } = this.state;
                            if(d["Total"])
                            {

                              return (                              
                                  <div  className={i%2==1?`flex tableColor1`:`flex`} key = {i} >
                                    <p style={adjWF(cellwidth* 1/3 , 12)} className={`${classes.leftItem} grayHover tableColor2`}>
                                      
                                    </p>
                                    <p style={adjWF(cellwidth* 2/3 , 12)} className={`${classes.leftItem} grayHover`}>
                                      Total
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["Total"]["Income"]["Actual"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >

                                      {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Income"]["Forecast"]):thousandFormat2(d["Total"]["Income"]["Budget"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Income"]["ActualVsForecastVariance"]):thousandFormat2(d["Total"]["Income"]["ActualVsBudgetVariance"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >

                                      {thousandFormat2(d["Total"]["Income"]["YTDActual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                    {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Income"]["YTDForecast"]):thousandFormat2(d["Total"]["Income"]["YTDBudget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "imax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                    {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Income"]["YTDActualVsForecastVariance"]):thousandFormat2(d["Total"]["Income"]["YTDActualVsBudgetVariance"])}

                                    </p>
                                  </div>
                                 
                                )
                            }
                        })}

                        {/************** Expense Data *******************/ }
                        {data.map((d, i) => {
                            const { selectedOption } = this.state;
                            if(d["IncomeStatementCategory"] == "Expense")
                            {
                              return (                              
                                  <div  className={i%2==1?`flex tableColor1`:`flex`} key = {i} >
                                    <p style={adjWF(cellwidth* 1/3 , 12)} className={`${classes.leftItem} grayHover tableColor2` }
                                    >
                                      {d["IncomeStatementSubCategory"]=="Administration"?"Expense":""}
                                    </p>
                                    <p style={adjWF(cellwidth* 2/3 , 12)} className={`${classes.leftItem} grayHover`}
                                    >
                                      {d["IncomeStatementSubCategory"]}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["Actual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["Forecast"]):thousandFormat2(d["Budget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["ActualVsForecastVariance"]):thousandFormat2(d["ActualVsBudgetVariance"])}
                                      
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["YTDActual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover ` } align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["YTDForecast"]):thousandFormat2(d["YTDBudget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption);
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["YTDActualVsForecastVariance"]):thousandFormat2(d["YTDActualVsBudgetVariance"])}
                                      
                                    </p>
                                  </div>
                                 
                                )
                            }
                        })}

                        {/************** Expose Total Data *******************/ }
                        {data.map((d, i) => {
                            let index ;
                             const { selectedOption } = this.state;
                            if(d["Total"])
                            {

                              return (                              
                                  <div  className={i%2==1?`flex tableColor1`:`flex`} key = {i} >
                                    <p style={adjWF(cellwidth* 1/3 , 12)} className={`${classes.leftItem} grayHover tableColor2`}>
                                      
                                    </p>
                                    <p style={adjWF(cellwidth* 2/3 , 12)} className={`${classes.leftItem} grayHover`}>
                                      Total
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption , "emax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["Total"]["Expense"]["Actual"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >

                                      {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Expense"]["Forecast"]):thousandFormat2(d["Total"]["Income"]["Budget"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Expense"]["ActualVsForecastVariance"]):thousandFormat2(d["Total"]["Income"]["ActualVsBudgetVariance"])}

                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >

                                      {thousandFormat2(d["Total"]["Expense"]["YTDActual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                    {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Expense"]["YTDForecast"]):thousandFormat2(d["Total"]["Income"]["YTDBudget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "emax");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                    {selectedOption=="Forecast"?thousandFormat2(d["Total"]["Expense"]["YTDActualVsForecastVariance"]):thousandFormat2(d["Total"]["Income"]["YTDActualVsBudgetVariance"])}

                                    </p>
                                  </div>
                                 
                                )
                            }
                        })}

                        {/************** Profit Data *******************/ }
                        {data.map((d, i) => {
                            const { selectedOption } = this.state;
                            if(i == 0)
                            {
                              return (                              
                                  <div  className={i%2==1?`flex tableColor1`:`flex`} key = {i} >
                                    <p style={adjWF(cellwidth* 2/3 , 12)} className={`${classes.leftItem} grayHover tableColor2` }
                                    >
                                      Profit / Loss
                                    </p>
                                    <p style={adjWF(cellwidth* 1/3 , 12)} className={`${classes.leftItem} grayHover`}
                                    >
                                      &nbsp;
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["Actual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["Forecast"]):thousandFormat2(d["Budget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["ActualVsForecastVariance"]):thousandFormat2(d["ActualVsBudgetVariance"])}
                                      
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat2(d["YTDActual"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover ` } align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["YTDForecast"]):thousandFormat2(d["YTDBudget"])}
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "profit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat2(d["YTDActualVsForecastVariance"]):thousandFormat2(d["YTDActualVsBudgetVariance"])}
                                      
                                    </p>
                                  </div>
                                 
                                )
                            }
                        })}

                        {/************** Profit % Data *******************/ }
                        {data.map((d, i) => {
                            const { selectedOption } = this.state;
                            if(d["PProfit"])
                            {
                              return (                              
                                  <div  className={i%2==1?`flex tableColor1`:`flex`} key = {i} >
                                    <p style={adjWF(cellwidth* 1/3 , 12)} className={`${classes.leftItem} grayHover tableColor2` }
                                    >
                                      % Profit 
                                    </p>
                                    <p style={adjWF(cellwidth* 2/3 , 12)} className={`${classes.leftItem} grayHover`}
                                    >
                                      &nbsp;
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat(d["PProfit"]["Actual"])}%
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat(d["PProfit"]["Forecast"]):thousandFormat(d["PProfit"]["Budget"])}%
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat(d["PProfit"]["ActualVsForecastVariance"]):thousandFormat(d["PProfit"]["ActualVsBudgetVariance"])}%
                                      
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {thousandFormat(d["PProfit"]["YTDActual"])}%
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover ` } align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat(d["PProfit"]["YTDForecast"]):thousandFormat(d["PProfit"]["YTDBudget"])}%
                                    </p>
                                    <p style={adjWF(cellwidth , 12)} className={`${classes.leftItem} grayHover`} align = "center"
                                      onClick={event => {
                                        this.handleElement(event, 'table', d);
                                      }}
                                      onMouseMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption, "pprofit");
                                      }}
                                      onMouseLeave={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                      onTouchMove={event => {
                                        if (tooltipTimeout) clearTimeout(tooltipTimeout);
                                        this.showTooltip(event, d , selectedOption , "pprofit");
                                      }}
                                      onTouchEnd={event => {
                                        tooltipTimeout = setTimeout(() => {
                                          this.hideTooltip();
                                        }, 300);
                                      }}
                                    >
                                      {selectedOption=="Forecast"?thousandFormat(d["PProfit"]["YTDActualVsForecastVariance"]):thousandFormat(d["PProfit"]["YTDActualVsBudgetVariance"])}%
                                      
                                    </p>
                                  </div>
                                 
                                )
                            }
                        })}
                        <Grid container>
                          <Grid item md={"auto"} sm={8} xs={8}>
                          <div>
                          <p>&nbsp;</p>
                          </div>
                          <div>
                          <p>&nbsp;</p>
                          </div>
                          <div>
                          <p>&nbsp;</p>
                          </div>
                          </Grid>
                        </Grid>
                        {tooltipOpen && (
                              <Tooltip
                                top={tooltipTop + pageYOffset}
                                left={tooltipLeft}
                                style={tooltip}
                              >
                                {tooltipData.option ?
                                  <div>
                                    <div className="ft-12">GL Sub Type: <strong>{(tooltipData["IncomeStatementSubCategory"])}</strong></div>
                                    <div className="ft-12">Income Statement Category: <strong>{tooltipData["IncomeStatementCategory"]}</strong></div>
                                    <div className="ft-12">YTD Compare: 
                                        <strong>

                                        {thousandFormat2(tooltipData.option=="Forecast"?tooltipData["YTDForecast"]:tooltipData["YTDBudget"],(tooltipData.char == "$"?"$":""))}
                                        {tooltipData.char == "%"?"%":""}
                                        </strong>
                                    </div>
                                    <div className="ft-12">MTD Compare Variable: 
                                        <strong>

                                        {thousandFormat2(tooltipData.option=="Forecast"?tooltipData["ActualVsForecastVariance"]:tooltipData["ActualVsBudgetVariance"],(tooltipData.char == "$"?"$":""))}
                                        {tooltipData.char == "%"?"%":""}
                                        </strong>
                                    </div>
                                    <div className="ft-12">MTD Compare: 
                                        <strong>
         
                                        {thousandFormat2(tooltipData.option=="Forecast"?tooltipData["Forecast"]:tooltipData["Budget"],(tooltipData.char == "$"?"$":""))}
                                        {tooltipData.char == "%"?"%":""}
                                        </strong>
                                    </div>
                                    <div className="ft-12"></div>
                                    <div className="ft-12">YTD Compare Variable: 
                                        <strong>
                                        {thousandFormat2(tooltipData.option=="Forecast"?tooltipData["YTDActualVsForecastVariance"]:tooltipData["YTDActualVsBudgetVariance"] , (tooltipData.char == "$"?"$":""))}
                                        {tooltipData.char == "%"?"%":""}
                                        </strong>
                                    </div>
                                    <div className="ft-12">MTD Actual: 
                                        <strong>

                                        {thousandFormat2(tooltipData["Actual"],(tooltipData.char == "$"?"$":""))}
                                        {tooltipData.char == "%"?"%":""}
                                        </strong>
                                    </div>
                                    <div className="ft-12">YTD Actual: 
                                        <strong>
                                        {thousandFormat2(tooltipData["YTDActual"] , (tooltipData.char == "$"?"$":""))}
                                        {tooltipData.char == "%"?"%":""}
                                        </strong>
                                    </div>
                                   
                                  </div>
                                  :
                                  <div>
                                    No data
                                  </div>
                                }
                              </Tooltip>
                        )}

               </Grid>
              </Grid>
            </div>

            
          </div>
          :
          <div style={empty(200)} className="well">No data</div>
        }

      </div>
    );
  }

}


BottomChart.propTypes = {
  classes: PropTypes.object.isRequired,

  detailData: PropTypes.object.isRequired,

  selectedYears: PropTypes.array.isRequired,

};

export default withStyles(styles)(withTooltip(BottomChart));
