var data = Mock.mock({
	'result|100':[{
		"id":"@id",
		"name":"@cname(2,4)",
		"birth":"@date('yyyy')",
		"sex|1":[0,1],
		"sNo|+1":10001,
		"email":"@email",
		"phone":"@integer(13000000000,19000000000)",
		"address":"@city()",
		"appkey":"@word(16)",
		"ctime":"@now()",
		"utime":"@now()"
	}],
	"status":"success",
	"msg":"查詢成功"
});
Mock.mock(RegExp('student-echarts?[\w\W]*'),'get',function(options){
	var queryObj = getObj(options);
	var result = {};
	var list = {};
	data.result.sort();
	if(queryObj.sex || queryObj.search){
		if(queryObj.sex){
			result = data.result.filter(function(peve,index){
				return data.result[index].sex == Number(queryObj.sex);
			});
		}else{
			result = data.result.filter(function(item,index){
				return data.result[index].sNo == Number(queryObj.search);
			});
		};
		list = result.filter(function(peve,index){
			return (index >= queryObj.size * (queryObj.page -1) && index < queryObj.size * queryObj.page)
		});
	}else{
		result = data.result.filter(function(peve,index){
			return (index >= queryObj.size * (queryObj.page -1) && index < queryObj.size * queryObj.page)
		});
		list = result;
	}
	return {	
		"data":{
			total:(queryObj.sex || queryObj.search) ? result.length : data.result.length,
			result:list
		},
		"status":"success",
		"msg":"查詢成功"
	}
});


Mock.mock(RegExp('updateStudent?[\w\W]*'),'get',function(options){
	var queryObj = getObj(options);
	data.result.forEach(function(peve,index,item){
		if(data.result[index].sNo == queryObj.sNo){
			for(var prop in data.result[index]){
				if(queryObj[prop]){
					data.result[index][prop] = queryObj[prop];
					data.result = item;
				}
			}
		}
	});
	return {
	'result':'',
	"status":"success",
	"msg":"修改成功"
	}
});

Mock.mock(RegExp('delBySno?[\w\W]*'),'get',function(options){
	var Num = parseInt(options.url.slice(options.url.indexOf('=') + 1));
	data.result = data.result.filter(function(peve,index){
		return data.result[index].sNo != Num;
	});
	return {
		'data':'',
		"status":"success",
		"msg":"删除成功"
	}
});
Mock.mock(RegExp('addStudent?[\w\W]*'),'get',function(options){
	var queryObj = getObj(options);
	for(var i = 0; i < data.result.length; i++){
		if(data.result[i].sNo == queryObj.sNo){
			// alert('添加失败，学号重复');
			return {
				'data':'',
				"status":"fail",
				"msg":'添加失败，学号重复'
				}
		}
		if(i == data.result.length - 1){
			data.result.push(queryObj);
			data.result.sort(function(a,b){
				return a.sNo - b.sNo;
			});
			console.log(data.result);
			return {
			'data':'',
			"status":"success",
			"msg":'添加成功'
			}
		}		
	}
	}
);
function getObj(options){
	var queryStr = options.url.slice(options.url.indexOf('?') + 1);
	var body = decodeURIComponent(queryStr);
	var queryArr = body.split('&');
	var queryObj = {};
	for(var i = 0; i < queryArr.length; i++){
		var key = queryArr[i].split('=')[0];
		var value = queryArr[i].split('=')[1];
		queryObj[key]= value;
	};
	return queryObj;
}