var dataArray=[];
var page = 1;
var size = 10;
var total = 1;
function init(){
	location.hash = 'student-list';
	bindEvent();
	getData();
}
init();
function bindEvent(){
	var list = $('header .drop-list');
	$('header .btn').click(function(){
		list.slideToggle();
	});

	$(window).on('hashchange',function(){
		var hash = location.hash;

		$('.show-list').removeClass('show-list');
		$(hash).addClass('show-list');

		$('.list-item.active').removeClass('active');
		$('.'+hash.slice(1)).addClass('active');
	});

	$('.list-item').click(function(){
		$('header .drop-list').slideUp();
		var id = $(this).attr('data-id');
		location.hash=id;
	});

	// 编辑按钮
	$('#stundents-table > tbody').on('click','.edit',function(){
		var index = $(this).parents('tr').index();
		renderEditForm(dataArray[index]);
		$('.modal').slideDown();
	}).on('click','.del',function(){
		index = $(this).parents('tr').index();
		$('.del-modal').slideDown();
	});
	// 点击背景区域，使表单隐藏
	$('.modal').click(function(e){
		if(e.target === this){
			$('.modal').slideUp();
		}
	});
	// 获取表单的value值，以字符串格式返回
	// $('#edit-form').serialize();
	// 获取表单的value值，以对象格式返回
	$('#edit-form .submit').click(function(e){
		// 阻止默认事件
		e.preventDefault();
		var data = getFormData($('#edit-form'));
		if(data.status === 'success'){
			networkRequest('/updateStudent',data.data);
			$('.modal').slideUp();
		}else{
			alert(data.msg)
		}
	});
	// 删除确认层
	$('.del-modal').on('click','.sure-btn',function(){

		networkRequest('/delBySno',{
			sNo:dataArray[index].sNo
		});
		$('.del-modal').slideUp();
		getData();
			
	}).on('click','.reset-btn',function(){
		$('.del-modal').slideUp();
	});
	// 删除按钮方案2
	// $('#stundents-table > tbody').on('click','.del',function(e){
	// 	// var index = $(this).parents('tr').index();
	// 	var  isDel = confirm('确认删除学号为' + dataArray[$(this).parents('tr').index()].sNo + '的学生信息吗？');
	// 	if(isDel){
	// 		networkRequest('/delBySno');
	// 		alert('删除成功');
	// 	}
	// });
	// 新增页面的提交按钮
	$('#student-add-form .submit').click(function(e){
		e.preventDefault();
		var data = getFormData($('#student-add-form'));
		if(data.status === 'success'){
			networkRequest('/addStudent',data.data);
			location.hash= '#student-list';
			$('#reset').trigger('click');
		}else{
			alert(data.msg)
		}
	});
	// 搜索
	$('#search-btn').click(function(){
		getData();
	});
	// 回车
	$('#search-inp').keydown(function(e){
		if(e.keyCode == 13){
			getData();
		}
	})
}
// 渲染表格数据
function randerData(data){
	var str='';
	data.forEach(function(item,index){
		str +=`<tr>
					<td>${item.sNo}</td>
					<td>${item.name}</td>
					<td>${item.sex == 1?'女':'男'}</td>
					<td>${item.email}</td>
					<td>${new Date().getFullYear() - item.birth}</td>
					<td>${item.phone}</td>
					<td>${item.address}</td>
					<td>
					<button class="btn edit">编辑</button>
					<button class="btn del">删除</button>
					</td>
				</tr>`
	});
	$('#table-body').html(str);
	$('#page').page({
		total:total,
		current:page,
		chagePage : function(nowpage){
			page = nowpage;
			getData();
		}
	})
}
// 获取表格数据
function getData(val){
	var val = $('#search-inp').val();
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
				dataArray = res.data.result;
				total = Math.ceil(res.data.total/size);
				randerData(dataArray);
				pie.init();
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
				sex : sex
			},
			dataType:'json',
			success:function(res){
				if(res.status === 'success'){
					dataArray = res.data.result;
					total = Math.ceil(res.data.total/size);
					randerData(dataArray);
					pie.init();
				}else{
					alert('数据请求失败');
				}
				
			}
		});
	}
}
// 表单回填
function renderEditForm(data){
	var form = $('#edit-form')[0];
	for(var prop in data){
		if(form[prop]){
			form[prop].value = data[prop];
		}
	}
}
// 获取表单数据
function getFormData(form){
	var arr = form.serializeArray();
	var result = {
		status:'success',
		msg:'',
		data:{},
	};
	for(var i = 0; i < arr.length; i++){
		if(arr[i].value){
			result.data[arr[i].name] = arr[i].value;
		}else{
			result.status = 'fail';
			result.msg = '信息填写不完全，请检验后提交';
			return result;
		}
	}
	var regEmail = new RegExp('[@,com,con]');
	if(!regEmail.test(result.data.email)){
		console.log('1')
		result.status = 'fail';
		result.msg = '必须携带@'
	}
	var regBirth = new RegExp('^(1[89]|[2-8][0-9]|50)$');
	if(!regBirth.test(new Date().getFullYear() - result.data.birth)){
		result.status = 'fail';
		var fristDate = new Date().getFullYear() - 50;
		var lastDate = new Date().getFullYear() - 18;
		result.msg = '出生年必须在' + fristDate +'-' + lastDate +'之间';
	}
	var regPhone = new RegExp('(^[1][3-9]|[0-9]){11}');
	if(!regPhone.test(result.data.phone)){
		result.status = 'fail';
		result.msg = '请输入正确的手机号'
	}
	return result;
}
// ajax 新增与删除
function networkRequest(url,data){
	$.ajax({
		url:url,
		type:'get',
		data: data,
		dataType:'json',
		success:function(res){
			if(res.status === 'success'){
				setTimeout(function(){
					getData();
					alert(res.msg);
				},400);
			}else{
				setTimeout(function(){
				
					alert(res.msg);
				},400);
			}
		}
	});
}