/*Dashboard3 Init*/

"use strict";
$(document).ready(function () {
    /*Toaster Alert*/
    // $.toast({
    //     heading: 'Well done!',
    //     text: '<p>You have successfully completed level 1.</p><button class="btn btn-primary btn-sm mt-10">Play again</button>',
    //     position: 'top-right',
    //     loaderBg: '#88c241',
    //     class: 'jq-toast-primary',
    //     hideAfter: 3500,
    //     stack: 6,
    //     showHideTransition: 'fade'
    // });
    if ($('#area_chart').length > 0) {
        var data = [{
            period: 'Son',
            iphone: 10,
            ipad: 80,
        }, {
            period: 'Mon',
            iphone: 130,
            ipad: 100,
        }, {
            period: 'Tue',
            iphone: 80,
            ipad: 30,
        }, {
            period: 'Wed',
            iphone: 70,
            ipad: 200,
        }, {
            period: 'Thu',
            iphone: 180,
            ipad: 50,
        }, {
            period: 'Fri',
            iphone: 105,
            ipad: 170,
        },
        {
            period: 'Sat',
            iphone: 250,
            ipad: 150,
        }];

        var lineChart = Morris.Area({
            element: 'area_chart',
            data: data,
            xkey: 'period',
            ykeys: ['iphone', 'ipad'],
            labels: ['iphone', 'ipad'],
            pointSize: 0,
            lineWidth: 0,
            fillOpacity: 0.95,
            pointStrokeColors: ['#97ca5a', '#88c241'],
            behaveLikeLine: true,
            grid: false,
            hideHover: 'auto',
            lineColors: ['#97ca5a', '#88c241'],
            resize: true,
            redraw: true,
            smooth: true,
            gridTextColor: '#878787',
            gridTextFamily: "Nunito",
            parseTime: false
        });
    }
    if ($('#m_chart_4').length > 0) {
        // Line Chart
        var data = [{ y: '100', a: 10, b: 20, c: 40 },
        { y: '200', a: 30, b: 50, c: 70 },
        { y: '300', a: 20, b: 40, c: 50 },
        { y: '400', a: 50, b: 70, c: 90 },
        { y: '500', a: 10, b: 40, c: 100 },

        ];
        var lineChart = Morris.Line({
            element: 'm_chart_4',
            data: data,
            xkey: 'y',
            ykeys: ['a', 'b', 'c'],
            labels: ['Total Income', 'Total Outcome', 'Total Expences'],
            gridLineColor: 'transparent',
            resize: true,
            gridTextColor: '#6f7a7f',
            gridTextFamily: "Inherit",
            hideHover: 'auto',
            behaveLikeLine: true,
            smooth: false,
            pointSize: 4,
            lineWidth: 2,
            pointFillColors: ['#fff', '#fff', '#fff'],
            pointStrokeColors: ['#88c241', '#97ca5a', '#aed67e'],
            lineColors: ['#88c241', '#97ca5a', '#aed67e'],
        });
    }


});

/*****E-Charts function start*****/
var biz1ChartConfig = function (data) {
    // console.log(data);
    var bar_x = ['0/0'];
    var bar_y = [0];
    var ordertypesales = [
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 }
    ];
    var transtypesales = [
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 }
    ];
    var customerwisesales = [
        { name: "", value: 0 },
        { name: "", value: 0 },
        { name: "", value: 0 }
    ];
    var color_presets = ['#4dd291', '#2ab4d1', '#065687', '#713670', '#8f1c53', '#cc4968', '#e45642', '#fc892c', '#ffc349']
    var pie1_color = ['#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb'];
    var pie2_color = ['#bbbbbb', '#bbbbbb', '#bbbbbb', '#bbbbbb'];
    var pie3_color = ['#bbbbbb', '#bbbbbb', '#bbbbbb'];
    // #bbbbbb
    if (data.hasOwnProperty('DaywiseSales')) {
        if (data.DaywiseSales.length > 0) {
            bar_x = [];
            bar_y = [];
        }
        data.DaywiseSales.forEach(element => {
            var dat = new Date(element.Date);
            // console.log(dat);
            bar_x.push(dat.getDate() + '/' + (dat.getMonth()+1));
            bar_y.push(+element.Sales.toFixed(0));
        });
    }
    if (data.hasOwnProperty('OrderTypeSales')) {
        if (data.OrderTypeSales.length > 0) {
            ordertypesales = [];
            pie1_color = [];
        }
        data.OrderTypeSales.forEach((element, index) => {
            var obj = { value: element.TotSales, name: element.Description };
            if (element.TotSales > 0)
                pie1_color.push(color_presets[index]);
            else {
                pie1_color.push('#bbbbbb');
                obj.name = '';
            }
            ordertypesales.push(obj);
        });
    }
    if (data.hasOwnProperty('TransTypeSales')) {
        if (data.TransTypeSales.length > 0) {
            transtypesales = [];
            pie2_color = [];
        }
        data.TransTypeSales.forEach((element, index) => {
            var obj = { value: element.Column1, name: element.Description };
            if (element.Column1 > 0)
                pie2_color.push(color_presets[index]);
            else {
                pie2_color.push('#bbbbbb');
                obj.name = '';
            }
            transtypesales.push(obj);
        });
    }
    if (data.hasOwnProperty('CustomerwiseSales')) {
        customerwisesales = [
            { value: data.CustomerwiseSales[0].NewCustomerSales, name: (data.CustomerwiseSales[0].NewCustomerSales > 0) ? 'NewCustomerSales' : '' },
            { value: data.CustomerwiseSales[0].OldCustomerSales, name: (data.CustomerwiseSales[0].OldCustomerSales > 0) ? 'OldCustomerSales' : '' },
            { value: data.CustomerwiseSales[0].UnIdentifiedSale, name: (data.CustomerwiseSales[0].UnIdentifiedSale > 0) ? 'UnIdentifiedSale' : '' }
        ];
        pie3_color[0] = (data.CustomerwiseSales[0].NewCustomerSales > 0) ? color_presets[0] : '#bbbbbb'
        pie3_color[1] = (data.CustomerwiseSales[0].OldCustomerSales > 0) ? color_presets[1] : '#bbbbbb'
        pie3_color[2] = (data.CustomerwiseSales[0].UnIdentifiedSale > 0) ? color_presets[2] : '#bbbbbb'
        data.CustomerwiseSales[0]
    }
    if ($('#biz1_bar').length > 0) {
        var eChart_6 = echarts.init(document.getElementById('biz1_bar'));
        var option5 = {
            color: ['#aed67e'],
            tooltip: {
                show: true,
                trigger: 'axis',
                backgroundColor: '#fff',
                borderRadius: 6,
                padding: 6,
                axisPointer: {
                    lineStyle: {
                        width: 0,
                    }
                },
                textStyle: {
                    color: '#324148',
                    fontFamily: '"Nunito", sans-serif;',
                    fontSize: 12
                }
            },

            grid: {
                top: '3%',
                left: '3%',
                right: '3%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: bar_x,
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#6f7a7f'
                        }
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLine: {
                        show: false
                    },
                    axisTick: {
                        show: false
                    },
                    axisLabel: {
                        textStyle: {
                            color: '#6f7a7f'
                        }
                    },
                    splitLine: {
                        lineStyle: {
                            color: 'transparent',
                        }
                    }
                }
            ],

            series: [
                {
                    data: bar_y,
                    type: 'bar',
                    barMaxWidth: 30,
                    smooth: true,
                    itemStyle: {
                        color: '#88c241',
                    },
                    label: {
                        normal: {
                            show: true,
                            position: 'outside'
                        }
                    }
                },
                // {
                // 	data: [120, 152, 251, 124, 250, 120, 110],
                // 	type: 'bar',
                // 	symbolSize: 6,
                // 	smooth: true,
                // itemStyle: {
                // 	color: '#88c241',
                // },
                // 	lineStyle: {
                // 		color: '#88c241',
                // 		width: 2,
                // 	}
                // }
            ]
        };
        eChart_6.setOption(option5);
        eChart_6.resize();
    }
    if ($('#biz1_pie_1').length > 0) {
        var eChart_1 = echarts.init(document.getElementById('biz1_pie_1'));
        var option = {
            tooltip: {
                show: true,
                backgroundColor: '#fff',
                borderRadius: 6,
                padding: 6,
                axisPointer: {
                    lineStyle: {
                        width: 0,
                    }
                },
                textStyle: {
                    color: '#324148',
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: 12
                }
            },
            series: [
                {
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['80%', '60%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    color: pie1_color,
                    data: ordertypesales
                }
            ]
        };
        eChart_1.setOption(option);
        eChart_1.resize();
    }
    if ($('#biz1_pie_2').length > 0) {
        var eChart_1 = echarts.init(document.getElementById('biz1_pie_2'));
        var option = {
            tooltip: {
                show: true,
                backgroundColor: '#fff',
                borderRadius: 6,
                padding: 6,
                axisPointer: {
                    lineStyle: {
                        width: 0,
                    }
                },
                textStyle: {
                    color: '#324148',
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: 12
                }
            },
            series: [
                {
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['80%', '60%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    color: pie2_color,
                    data: transtypesales
                }
            ]
        };
        eChart_1.setOption(option);
        eChart_1.resize();
    }
    if ($('#biz1_pie_3').length > 0) {
        var eChart_1 = echarts.init(document.getElementById('biz1_pie_3'));
        var option = {
            tooltip: {
                show: true,
                backgroundColor: '#fff',
                borderRadius: 6,
                padding: 6,
                axisPointer: {
                    lineStyle: {
                        width: 0,
                    }
                },
                textStyle: {
                    color: '#324148',
                    fontFamily: '"Roboto", sans-serif',
                    fontSize: 12
                }
            },
            series: [
                {
                    type: 'pie',
                    selectedMode: 'single',
                    radius: ['80%', '60%'],
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    color: pie3_color,
                    data: customerwisesales
                }
            ]
        };
        eChart_1.setOption(option);
        eChart_1.resize();
    }
}
/*****E-Charts function end*****/

var sparklineLogin = function () {
    if ($('#sparkline_1').length > 0) {
        $("#sparkline_1").sparkline([2, 4, 4, 6, 8, 5, 6, 4, 8, 6, 6, 2], {
            type: 'bar',
            width: '100%',
            height: '40',
            barWidth: '5',
            resize: true,
            barSpacing: '5',
            barColor: '#88c241',
            highlightSpotColor: '#88c241'
        });
    }
    if ($('#sparkline_2').length > 0) {
        $("#sparkline_2").sparkline([2, 7, 7, 5, 8, 5, 4, 4, 3, 4, 6, 1], {
            type: 'bar',
            width: '100%',
            height: '40',
            barWidth: '5',
            resize: true,
            barSpacing: '5',
            barColor: '#88c241',
            highlightSpotColor: '#88c241'
        });
    }
    if ($('#sparkline_3').length > 0) {
        $("#sparkline_3").sparkline([9, 3, 3, 2, 8, 6, 4, 3, 3, 2, 6, 1], {
            type: 'bar',
            width: '100%',
            height: '40',
            barWidth: '5',
            resize: true,
            barSpacing: '5',
            barColor: '#88c241',
            highlightSpotColor: '#88c241'
        });
    }
    if ($('#sparkline_4').length > 0) {
        $("#sparkline_4").sparkline([5, 3, 3, 2, 1, 6, 2, 3, 5, 2, 2, 1], {
            type: 'bar',
            width: '100%',
            height: '40',
            barWidth: '5',
            resize: true,
            barSpacing: '5',
            barColor: '#88c241',
            highlightSpotColor: '#88c241'
        });
    }
}
sparklineLogin();

/*****Resize function start*****/
var sparkResize, echartResize;
$(window).on("resize", function () {
    /*Sparkline Resize*/
    clearTimeout(sparkResize);
    sparkResize = setTimeout(sparklineLogin, 200);

    /*E-Chart Resize*/
    clearTimeout(echartResize);
    // echartResize = setTimeout(biz1ChartConfig, 200);
}).resize();
/*****Resize function end*****/

/*****Function Call start*****/
// echartsConfig();
/*****Function Call end*****/