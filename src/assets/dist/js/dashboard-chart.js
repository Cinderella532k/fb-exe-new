/*Dashboard3 Init*/

"use strict";

/*****E-Charts function start*****/
export var echartsConfig = function(data) {
  console.log(data);
  if ($("#e_chart_1").length > 0) {
    var eChart_1 = echarts.init(document.getElementById("e_chart_1"));
    var i;
    var date = new Array();
    var sales = new Array();
    console.log(data.DaywiseSales)
    for (i = 0; i < data.DaywiseSales.length; i++) {
      console.log(data.DaywiseSales[i],i)
      date[i] = data.DaywiseSales[i].Date.slice(0, 10);
      sales[i] = data.DaywiseSales[i].Sales;
    }
    var option = {
      color: ["#88c241"],
      tooltip: {
        show: true,
        trigger: "axis",
        backgroundColor: "#fff",
        borderRadius: 6,
        padding: 6,
        axisPointer: {
          lineStyle: {
            width: 0
          }
        },
        textStyle: {
          color: "#324148",
          fontFamily: '"Nunito", sans-serif',
          fontSize: 12
        }
      },

      xAxis: [
        {
          type: "category",
          data: date,
          axisLine: {
            show: false
          },
          axisTick: {
            show: false
          },
          axisLabel: {
            textStyle: {
              color: "#5e7d8a"
            }
          }
        }
      ],
      yAxis: {
        type: "value",
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          textStyle: {
            color: "#5e7d8a"
          }
        },
        splitLine: {
          lineStyle: {
            color: "transparent"
          }
        }
      },
      grid: {
        top: "3%",
        left: "3%",
        right: "3%",
        bottom: "3%",
        containLabel: true
      },
      series: [
        {
          data: sales,
          type: "bar",
          barMaxWidth: 30,
          itemStyle: {
            normal: {
              barBorderRadius: [6, 6, 0, 0]
            }
          }
        }
      ]
    };
    eChart_1.setOption(option);
    eChart_1.resize();
  }
  if ($("#e_chart_2").length > 0) {
    var eChart_2 = echarts.init(document.getElementById("e_chart_2"));
    var i;
    var ordPie = new Array();
    var ordName = new Array();
    for (i = 0; i < data.OrderTypeSales.length; i++) {
      ordPie[i] = {
        value: data.OrderTypeSales[i].TotSales,
        name: data.OrderTypeSales[i].Description
      };
      ordName[i] = data.OrderTypeSales[i].Description;
    }

    var option1 = {
      title: {
        text: "",
        subtext: "",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   orient: "vertical",
      //   left: "left",
      //   data: ordName
      // },
      series: [
        {
          name: "Sales",
          type: "pie",
          radius: "75%",
          center: ["50%", "60%"],
          data: ordPie,
           itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
           }
           }
        }
      ]
    };
    eChart_2.setOption(option1);
    eChart_2.resize();
  }
  if ($("#e_chart_3").length > 0) {
    var eChart_3 = echarts.init(document.getElementById("e_chart_3"));
    var i;
    var transPie = new Array();
    var transName = new Array();
    for (i = 0; i < data.TransTypeSales.length; i++) {
      transPie[i] = {
        value: data.TransTypeSales[i].Column1,
        name: data.TransTypeSales[i].Description
      };
      transName[i] = data.TransTypeSales[i].Description;
    }
    var option2 = {
      title: {
        text: "",
        subtext: "",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   orient: "vertical",
      //   left: "right",
      //   data: transName
      // },
      series: [
        {
          name: "Sales",
          type: "pie",
          radius: "75%",
         center: ["50%", "60%"],
          data: transPie,
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
    eChart_3.setOption(option2);
    eChart_3.resize();
  }

  if ($("#e_chart_4").length > 0) {
    var eChart_4 = echarts.init(document.getElementById("e_chart_4"));
    var option3 = {
      title: {
        text: "",
        subtext: "",
        x: "center"
      },
      tooltip: {
        trigger: "item",
        formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      // legend: {
      //   left: "center",
      //   data: ["NewCustomer", "OldCustomer", "UnIdentified"]
      // },
      series: [
        {
          name: "Sales",
          type: "pie",
          radius: "75%",
          center: ["50%", "60%"],
          data: [
            {
              value: data.CustomerwiseSales[0].NewCustomerSales,
              name: "NewCustomer"
            },
            {
              value: data.CustomerwiseSales[0].OldCustomerSales,
              name: "OldCustomer"
            },
            {
              value: data.CustomerwiseSales[0].UnIdentifiedSale,
              name: "UnIdentified"
            }
          ],
          itemStyle: {
            emphasis: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: "rgba(0, 0, 0, 0.5)"
            }
          }
        }
      ]
    };
    eChart_4.setOption(option3);
    eChart_4.resize();
  }
};
/*****E-Charts function end*****/

/*****Resize function start*****/
var echartResize;
$(window)
  .on("resize", function() {
    /*E-Chart Resize*/
    clearTimeout(echartResize);
    echartResize = setTimeout(echartsConfig, 200);
  })
  .resize();
/*****Resize function end*****/

/*****Function Call start*****/

//echartsConfig(data);
/*****Function Call end*****/
