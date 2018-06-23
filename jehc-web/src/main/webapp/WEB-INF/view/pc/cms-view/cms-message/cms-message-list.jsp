<%@ page language="java" import="java.util.*" pageEncoding="utf-8"%>
<%@ include file="/deng/include/includeboot.jsp"%>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html>
<head>
<meta charset="UTF-8">
<title>内容发布平台在线留言</title>
</head>
<body>
	<div class="portlet box green" style="margin-bottom: 5px">
		<div class="portlet-title">
			<div class="caption">
				查询区域
			</div>
		</div>
		<div class="portlet-body form">
			<form method="POST" id="searchForm" class="form-inline" style="padding: 5px 0px 5px 0px;">
				<div class="form-group">
					<label>创建时间</label>
					<input type="text" class="form-control" name="ctime" placeholder="请输入创建时间">
				</div>
				<div class="form-group">
					<label>手机号</label>
					<input type="text" class="form-control" name="phone" placeholder="请输入手机号">
				</div>
				<div class="form-group">
					<label>姓名</label>
					<input type="text" class="form-control" name="userName" placeholder="请输入姓名">
				</div>
				<div class="form-group">
					<label>标题</label>
					<div class="input-group">
						<input type="text" class="form_datetime form-control" placeholder="起始时间" name="title_st" />
						<span class="input-group-addon">至</span>
						<input type="text" class="form_datetime form-control" placeholder="结束时间" name="title_et" />
					</div>
				</div>
			</form>
		</div>
	</div>
	<div class="pull-left form-actions" style="margin-right:0px;margin-bottom: 5px">
		&nbsp;
		<button class="btn btn-primary" onclick="search('datatables');">
			 <i class="fi-search"></i>检索
		</button>
		&nbsp;
		<button class="btn btn-default" onclick="resetAll();">
			<i class="icon-trash"></i>重置
		</button>
		<button class="btn btn-default" onclick="delCmsMessage()">
			<span class="glyphicon glyphicon-remove" aria-hidden="true"></span>删除
		</button>
		<button class="btn btn-default" onclick="search('datatables')">
			<span class="glyphicon glyphicon-refresh" aria-hidden="true"></span>刷新
		</button>
	</div>
	<table id="datatables" class="table table-bordered table-striped table-hover" style="white-space: nowrap; width: 99.9%">
		<thead>
			<tr>
				<th><label class="mt-checkbox mt-checkbox-single mt-checkbox-outline"><input type="checkbox" class="checkall" /><span></span></label></th>
				<th>序号</th>
				<th>标题</th>
				<th>姓名</th>
				<th>手机号</th>
				<th>创建时间</th>
				<th>操作</th>
			</tr>
		</thead>
	</table>
</body>
<script type="text/javascript" src="../view/pc/cms-view/cms-message/cms-message-list.js"></script> 
</html>
