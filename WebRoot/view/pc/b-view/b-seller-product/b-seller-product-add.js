var bSellerProductWinAdd;
var bSellerProductFormAdd;
function addBSellerProduct(){
	initBSellerProductFormAdd();
	bSellerProductWinAdd = Ext.create('Ext.Window',{
		layout:'fit',
		width:800,
		height:400,
		maximizable:true,
		minimizable:true,
		animateTarget:document.body,
		plain:true,
		modal:true,
		headerPosition:'left',
		title:'添加信息',
		listeners:{
			minimize:function(win,opts){
				win.collapse();
			}
		},
		items:bSellerProductFormAdd,
		buttons:[{
			text:'保存',
			itemId:'save',
			handler:function(button){
				submitForm(bSellerProductFormAdd,'../bSellerProductController/addBSellerProduct',grid,bSellerProductWinAdd,false,true);
			}
		},{
			text:'关闭',
			itemId:'close',
			handler:function(button){
				button.up('window').close();
			}
		}]
	});
	bSellerProductWinAdd.show();
	Ext.getCmp('b_seller_id_').setValue($('#b_seller_id').val());
}
function initBSellerProductFormAdd(){
	bSellerProductFormAdd = Ext.create('Ext.FormPanel',{
		xtype:'form',
		waitMsgTarget:true,
		defaultType:'textfield',
		fieldDefaults:{
			labelWidth:70,
			labelAlign:'left',
			flex:1
		},
		items:[
		{
			fieldLabel:'卖家编号',
			xtype:'textfield',
			name:'b_seller_id',
			id:'b_seller_id_',
			maxLength:32,
			hidden:true,
			anchor:'100%'
		},
		{
			xtype:"fieldcontainer",
			fieldLabel:'选择商品',
			anchor:'80%',
			items:[{
				name:'b_product_id',
				xtype:"combo",
				store:b_productList, 
				pageSize:10, 
	            emptyText:'请选择',  
	            mode:'local',  
	            triggerAction:'all',  
	            valueField:'b_product_id',  
	            displayField:'b_product_name',  
	            editable:false, 
				allowBlank:false,
				width:400,
				maxLength:32
			}
			]
		},
		{
			xtype:"fieldcontainer",
			fieldLabel:'状&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;态',
			items:[{
				name:'b_seller_product_status',
				xtype:"combo",
	            store:[["0","已关联"],["1","已取消"]],
	            emptyText:"请选择",
	            mode:"local",
	            value:'0',
	            triggerAction:"all",
	            editable:false,
				hiddenName:'b_seller_product_status',
				allowBlank:false,
				anchor:'25%'
				}
			]
		},
		{
			xtype:"fieldcontainer",
			fieldLabel:'基&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价',
			anchor:'40%',
			layout:'hbox',
		    items:[
		        {
					xtype:'numberfield',
					value:'0',
					name:'base_price'
				},
		        {
		            xtype:"displayfield",
		            value:"元/单位"
		        }
		    ]
		},
		{
			xtype:"fieldcontainer",
			fieldLabel:'建议价格',
			anchor:'40%',
			layout:'hbox',
		    items:[
		        {
					xtype:'numberfield',
					value:'0',
					name:'suggested_price',
					anchor:'25%'
				},
		        {
		            xtype:"displayfield",
		            value:"元/单位"
		        }
		    ]
		},
		{
			xtype:"fieldcontainer",
			fieldLabel:'原&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价',
			anchor:'40%',
			layout:'hbox',
		    items:[
		        {
					xtype:'numberfield',
					value:'0',
					name:'original_price',
					anchor:'25%'
				},
		        {
		            xtype:"displayfield",
		            value:"元/单位"
		        }
		    ]
		}
		]
	});
}
