//返回r
function goback(){
	tlocation("../cmsMessageController/loadCmsMessage");
}
$('#defaultForm').bootstrapValidator({
	message:'此值不是有效的'
});
//保存
function addCmsMessage(){
	submitBForm('defaultForm','../cmsMessageController/addCmsMessage','../cmsMessageController/loadCmsMessage');
}
//初始化日期选择器
$(document).ready(function(){
	datetimeInit();
});

