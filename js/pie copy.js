(function(list){
	return pie={
		myChart : null,
		myChart1 : null,
		init(){
			this.getData();
			this.option={
				title:{
					text: '',
                    subtext: '纯属虚构',
                    left: 'center',
				},
				  legend: {
                    data: [],
                    orient: 'vertical',
                    left: 'left',
                },
				series:{
					name:'',
					type: 'pie',
					data:[],
					radius:'55%',
					center:['55%','60%'],
					itemStyle:{
						emphasis:{
							shadowBlur:10,
							shadowColor:'rgba(0,0,0,.5)'
						}
					}
				}
			}
		},
		 getData(){
            var val = $('#search-inp').val();
            var This = this;
            if(val){
                var sex = null;
                var search = val.trim();
                if(val.indexOf('男')!= -1){
                    sex = 0;
                    search = val.replace('男','').trim();
                }
                if(val.indexOf('女')!= -1){
                    sex = 1;
                    search = val.replace('女','').trim();
                }
                $.ajax({
                url:'/student-echarts',
                type:'get',
                data:{
                    // 拿去第几页
                    page:page,
                    // 每一页拿去多少条数据
                    size:size,
                    search : search ? search : null,
                    sex : sex
                },
                dataType:'json',
                success:function(res){
                    if(res.status === 'success'){
                        console.log(res.data.result)
                      This.areaChart(res.data.result);
                      This.sexChart(res.data.result);
                    }else{
                        alert('数据请求失败');
                    }
                }
                });
            }else{
                $.ajax({
                    url:'/student-echarts',
                    type:'get',
                    data:{
                        // 拿去第几页
                        page:page,
                        // 每一页拿去多少条数据
                        size:size,
                        search : search ? search : null,
                        sex : sex
                    },
                    dataType:'json',
                    success:function(res){
                        if(res.status === 'success'){
                            This.areaChart(res.data.result);
                            This.sexChart(res.data.result);
                        }else{
                            alert('数据请求失败');
                        }
                        
                    }
                });
            }   
        },
		areaChart(data){
			if(!this.myChart){
				// myChart.dispose();
				this.myChart = echarts.init($('.areaChart')[0]);
			}else{
				this.myChart.dispose();
				this.myChart = echarts.init($('.areaChart')[0]);
			}
			var legendData = [];
			var serisesData = [];
			var newData = {};

			data.forEach(function(item){
				if(!newData[item.address]){
					newData[item.address]=1;
					legendData.push(item.address);
				}else{
					newData[item.address]++;
				}
			});
			for(var prop in newData){
				serisesData.push({
					name:prop,
					value:newData[prop]
				});
			}
			this.option.title.text = '渡一教育学生地区分布统计';
			this.option.legend.data = legendData;
			this.option.series.name = '地区分布';
			this.option.series.data = serisesData;
			this.myChart.setOption(this.option);
		},
		sexChart(data){
			if(!this.myChart1){
				this.myChart1 = echarts.init($('.sexChart')[0]);
			}else{
				this.myChart1.dispose();
				this.myChart1 = echarts.init($('.sexChart')[0]);
			}
			
			var legendData = ['男','女'];
			var newData = {};

			data.forEach(function(item){
				if(!newData[item.sex]){
					newData[item.sex]=1;
				}else{
					newData[item.sex]++;
				}
			});
			var serisesData = [
				{name:'男', value:newData[0]},
				{name:'女', value:newData[1]},
			];

			this.option.title.text = '渡一教育学生性别分布统计';
			this.option.legend.data = legendData;
			this.option.series.text = '性别分布';
			this.option.series.data = serisesData;

			this.myChart1.setOption(this.option);
		},
	}
})();