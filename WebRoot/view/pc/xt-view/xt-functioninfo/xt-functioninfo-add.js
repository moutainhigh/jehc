var xtFunctioninfoWinAdd;
var xtFunctioninfoFormAdd;
function addXtFunctioninfo(){
	initXtFunctioninfoFormAdd();
	reGetWidthAndHeight();
	xtFunctioninfoWinAdd = Ext.create('Ext.Window',{
		layout:'fit',
		width:clientWidth*0.8,
		height:clientHeight,
		maximizable:true,
		minimizable:true,
		animateTarget:document.body,
		plain:true,
		modal:true,
		title:'添加信息',
		listeners:{
			minimize:function(win,opts){
				if(!win.collapse()){
					win.collapse();
				}else{
					win.expand();
				}
			}
		},
		items:xtFunctioninfoFormAdd,
		buttons:[{
			text:'保存',
			itemId:'save',
			handler:function(button){
				submitForm(xtFunctioninfoFormAdd,'../xtFunctioninfoController/addXtFunctioninfo',grid,xtFunctioninfoWinAdd,false,true);
			}
		},{
			text:'关闭',
			itemId:'close',
			handler:function(button){
				button.up('window').close();
			}
		}]
	});
	xtFunctioninfoWinAdd.show();
}
function initXtFunctioninfoFormAdd(){
	xtFunctioninfoFormAdd = Ext.create('Ext.FormPanel',{
		xtype:'form',
		waitMsgTarget:true,
		defaultType:'textfield',
		autoScroll:true,
		fieldDefaults:{
			labelWidth:70,
			labelAlign:'left',
			margin:'1 5 4 5'
		},
		/**新方法使用开始**/  
        scrollable:true,  
        scrollable:'x',
        scrollable:'y',
        /**新方法使用结束**/ 
		items:[
		{
			fieldLabel:'功能名称',
			xtype:'textfield',
			name:'xt_functioninfoName',
			allowBlank:false,
			maxLength:50,
			anchor:'40%'
		},
		{
			fieldLabel:'功能标题',
			xtype:'textfield',
			name:'xt_functioninfoTitle',
			maxLength:200,
			anchor:'40%'
		},
		{
			fieldLabel:'功能URL',
			xtype:'textfield',
			name:'xt_functioninfoURL',
			maxLength:200,
			anchor:'80%'
		},
		{
			fieldLabel:'所属模块',
			maxLength:32,
			anchor:'100%',
			xtype:'treepicker',
			displayField:'text',
			anchor:'40%',
			id:'functioninfoTreePanel',
			hiddenName:'xt_menuinfo_id',
			name:'xt_menuinfo_id',
			minPickerHeight:200,
			maxHeight:200,
			editable:false,
			rootVisible:false,
			store:Ext.create('Ext.data.TreeStore',{
				fields:['id','text'],
				root:{
					text:'一级菜单',
					id:'0',
					expanded:true
				},
				/**此处一定要设置否则全部展开节点无效**/
				autoLoad:false,
				proxy:{
					type:'ajax',
					url:'../xtMenuinfoController/getXtMenuinfoTree',
					reader:{
						type:'json'
					}
				}
			})
		},
		{
			fieldLabel:'前端方法',
			xtype:'textfield',
			name:'xt_functioninfoMethod',
			maxLength:50,
			anchor:'40%'
		},
		{
			fieldLabel:'是否拦截',
	        xtype:'radiogroup',
	        columns:[80,80],
	        items:[
	               {boxLabel:'是',inputValue:'1',name:'xt_functioninfoType'},
	               {boxLabel:'否',inputValue:'0',checked:true,name:'xt_functioninfoType'}
	              ]
		},
		{
			fieldLabel:'数据权限',
			xtype:'radiogroup',
	        columns:[80,80],
	        items:[{boxLabel:'是',inputValue:'0',name:'xt_functioninfoIsAuthority'},
	               {boxLabel:'否',inputValue:'1',checked:true,name:'xt_functioninfoIsAuthority'}
	              ]
		},
		{
			fieldLabel:'是否可用',
			xtype:'radiogroup',
	        columns:[80,80],
	        items:[{boxLabel:'是',inputValue:'0',checked:true,name:'xt_functioninfoStatus'},
	               {boxLabel:'否',inputValue:'1',name:'xt_functioninfoStatus'}
	              ]
		}
		]
	});
}
