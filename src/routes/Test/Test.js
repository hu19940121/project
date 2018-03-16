import React, { PureComponent } from 'react';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';
import { Spin,List,Table,Row, Col, Card, Form, Input, Select, Icon, Button, Dropdown, Menu, InputNumber, DatePicker, Modal, message, Badge, Divider ,Radio} from 'antd';
import { connect } from 'dva';
import styles from './Test.less';



// const columns = [ {
//     title: '品种标识',
//     dataIndex: 'no', //对应列名
//   },
//   {
//     title: '证券类型',
//     dataIndex: 'symbol',
//   },
//   {
//     title: '货币',
//     dataIndex: 'currency',
//   },
//   {
//     title: '交易模式',
//     dataIndex: 'trade_mode',
//   },
//   {
//     title: '中文名',
//     dataIndex: 'cn_name',
//   },
//   {
//     title: '交易所标识',
//     dataIndex: 'sec_type',
//   },
//   {
//     title: '交易所中文名',
//     dataIndex: 'sn_name',
//   }, {
//   title: '操作',
//   key: 'action',
//   render: (text, record) => (
//     <span>
//       <a>编辑</a>
//       <Divider type="vertical" />
//       <a style={{color:"red"}}>删除</a>
//       <Divider type="vertical" />
//     </span>
//   ),
// }];

// const data = [{
//   key: '1',
//   name: 'John Brown',
//   age: 32,
//   address: 'New York No. 1 Lake Park',
// }, {
//   key: '2',
//   name: 'Jim Green',
//   age: 42,
//   address: 'London No. 1 Lake Park',
// }, {
//   key: '3',
//   name: 'Joe Black',
//   age: 32,
//   address: 'Sidney No. 1 Lake Park',
// }]

const FormItem = Form.Item;

//类似生成一个组件
const CollectionCreateForm = Form.create()(
  (props) => {
    const { visible, onCancel, onCreate, form } = props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        visible={visible}
        title="Create a new collection"
        okText="Create"
        onCancel={onCancel}
        onOk={onCreate}
      >
        <Form layout="vertical">
          <FormItem label="品种标识">
            {getFieldDecorator('sign', {
              rules: [{ required: true, message: 'Please input the title of collection!' }],
            })(
              <Input />
            )}
          </FormItem>
          <FormItem label="证券类型">
            {getFieldDecorator('zqType')(<Input  />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
);

const confirm = Modal.confirm;  //确认框







//组件和model链接	
@connect(({ rule,loading}) => ({
  rule,
  loading:loading.models.rule,
}))







class Test extends PureComponent{
	constructor(props){
		super(props)

		this.delClick=this.delClick.bind(this)
		
	}
	
	componentDidMount() {
		//初始化数据
		this.props.dispatch({
		  type: 'rule/fetch',
		});
	}

	//显示增加一条编辑框
	showModal = () => {
	   this.setState({ visible: true });
	}

	//取消新增
	handleCancel = () => {
	   this.setState({ visible: false });
	}

	//新增记录
	handleCreate = () => {
	   const form = this.form;
	   form.validateFields((err, values) => {
	     if (err) {
	       return;
	     }
	     console.log('Received values of form: ', values);
	     let params={
			sign:values.sign,
			zqType:values.zqType,
	     }
	     console.log(values)
	     this.props.dispatch({
	       type: 'rule/add',
	       payload:params,
	       //成功后执行此函数
	       callback: () => {
	         console.log('add success')
	         message.success('添加成功');
	       },
	     });
	     this.setState({
	       modalVisible: false,
	     });
	     form.resetFields();
	     this.setState({ visible: false });
	   });
	}

	//do not know
	saveFormRef = (form) => {
	   this.form = form;
	}



	//删除一条
	delClick(text){
		var that=this;
		confirm({
		   title: '是否删除',
		   onOk() {
		     that.props.dispatch({
		     	type:'rule/remove',
		     	payload:{
		     		 no: text.no,
		     	},
				callback: () => {
				  console.log('add success')
				  message.success('删除成功');
				},
		     })
		   },
		   onCancel() {
		     console.log('Cancel');
		   },
		 });
		// console.log(this.props.rule.data.list[index].no)
		console.log(text.no)
		
	}

	//选中触发的事件
	onSelectChange = (selectedRowKeys) => {
	  console.log('selectedRowKeys changed: ', selectedRowKeys);
	  this.setState({ selectedRowKeys });
	}


	//设置state
	state = {
		visible: false,
		columns: [ {
			title: '品种标识',
		    dataIndex: 'sign', //对应列名
		},
		{
			title: '证券类型',
			dataIndex: 'zqType',
		},
		{
			title: '货币',
			dataIndex: 'currency',
		},
		{
			title: '交易模式',
			dataIndex: 'trade_mode',
		},
		{
			title: '中文名',
			dataIndex: 'cn_name',
		},
		{
			title: '交易所标识',
			dataIndex: 'sec_type',
		},
		{
			title: '交易所中文名',
			dataIndex: 'sn_name',
		}, {
			title: '操作',
			key: 'action',
			render: (text, record,index) => (
				<span>
				<a>编辑</a>
				<Divider type="vertical" />
				<a onClick={this.delClick.bind(this,text)}style={{color:"red"}}>删除</a>
				<Divider type="vertical" />
				</span>
				),
		}],
	   selectedRowKeys: [], // Check here to configure the default column
	   loading: true,
	};
	// start = () => {
	//   this.setState({ loading: true });
	//   // ajax request after empty completing
	//   setTimeout(() => {
	//     this.setState({
	//       selectedRowKeys: [],
	//       loading: false,
	//     });
	//   }, 1000);
	// }





	
	render(){
		console.log(this.props)
		const {selectedRowKeys ,columns} = this.state;
		const {loading}=this.props
		const rowSelection = {
		     selectedRowKeys,
		     onChange: this.onSelectChange,
		 };
		const hasSelected = selectedRowKeys.length > 0;

		const menu = (
		  <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
		    <Menu.Item key="remove">删除</Menu.Item>
		    <Menu.Item key="approval">批量审批</Menu.Item>
		  </Menu>
		);

		let data =this.props.rule.data.list
		console.log(data)
		return (
			<div className={styles.test}>
				<PageHeaderLayout title="查询表格">
					<div style={{ marginBottom: 16 }}>
						<Button type="primary" onClick={this.showModal}>
						新增合约品种
						</Button>
						{
						    hasSelected && (
						    <span style={{marginLeft:10}}>
						      <Button>批量操作</Button>
						      <Dropdown overlay={menu}>
						        <Button style={{marginLeft:10}}> 
						          更多操作 <Icon type="down" />
						        </Button>
						      </Dropdown>
						    </span>
						  )
						}
						<CollectionCreateForm
						          ref={this.saveFormRef}
						          visible={this.state.visible}
						          onCancel={this.handleCancel}
						          onCreate={this.handleCreate}
						/>

						<span style={{ marginLeft: 8 }}>
						{hasSelected ? `Selected ${selectedRowKeys.length} items` : ''}
						</span>
					</div>
					<Table loading={loading} rowSelection={rowSelection} columns={columns} dataSource={data} />
				</PageHeaderLayout>
			</div>
			

			)
	}

}


export default Test