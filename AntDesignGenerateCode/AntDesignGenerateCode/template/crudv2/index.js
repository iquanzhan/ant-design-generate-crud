import React, { Component } from 'react';
import { Divider, Modal, Card, Button, Popconfirm, Icon,message} from 'antd';
import { connect } from 'dva';

import BaseForm from "@/components/ProductForm";
import BaseTable from '@/components/ProductTable/Base';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import Details from './Details';
import Edit#{tableNameUpper} from './Edit#{tableNameUpper}';


const statusMap = ['default', 'processing', 'success', 'error'];
const status = ['关闭', '运行中', '已上线', '异常'];
      /*filters: [
        {
          text: status[0],
          value: 0,
        },
        {
          text: status[1],
          value: 1,
        },
        {
          text: status[2],
          value: 2,
        },
        {
          text: status[3],
          value: 3,
        },
      ],
	  onFilter: (value, record) => record.delete_status == value,
      render(val) {
        return <Badge status={statusMap[val]} text={status[val]} />;
      },*/

const modalLayout = {
    style: { height: '337px', overflowY: 'auto', overflowX: 'hidden' }
}

@connect(({ #{tableName} }) => ({
    #{tableName}
}))
export default class index extends Component {

    state = {
        list: {
            pageNum: 1,
            pageSize: 10,
            total: 0,
            list: []
        },
        loading: false,
        record: {},
        detailsModal: false,
        editModal: false
    }

    componentDidMount() {
        this.initList();
    }

    //加载表格数据
    initList = () => {
        const that = this;
        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/get#{tableNameUpper}',
            payload: { ...this.filterParams, pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize }
        }).then(res => {
            const response = this.props.#{tableName}.get#{tableNameUpper}Status;

            if (response && response.code == 0) {
                that.setState({
                    list: response.resultData
                });
            }
        })
    }

    //选中数据
    onSelectItem = (data) => {
        this.checkItems = data;
    }

    //当改变每页显示数量时
    onShowSizeChange = (current, size) => {
        const { list } = this.state;
        list.pageNum = current;
        list.pageSize = size;

        this.setState({
            list
        });

        this.initList();
    }

    //当改变页码时
    onPageChange = (page) => {
        const { list } = this.state;
        list.pageNum = page
        this.setState({
            list
        });
        this.initList();
    }

    filterParams = {};

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        for (var name in filterParams) {
            if (filterParams[name] == '-1') {
                delete filterParams[name];
            }
        }

        this.filterParams = filterParams;

        //加载记录列表
        this.initList();
    };
	//停用#{tableNameChinese}
    handleDelete = (key) => {

        const that = this;
        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/delete#{tableNameUpper}',
            payload: { #{primaryKey}: key }
        }).then(() => {
            const response = this.props.#{tableName}.deleteStatus;
            let responses = JSON.parse(response);

            if (responses.code === 0) {
                message.success("停用成功");
                that.initList();
            }
            else {
                message.error(response ? response.msg : '网络请求异常');
            }

        })
    }

    //启用#{tableNameChinese}
    handleOpen = (key) => {

        const that = this;
        const { dispatch } = this.props;

        let filterParams = { #{primaryKey}: key, isDelete: 0 };

        //修改数据
        dispatch({
            type: '#{tableName}/edit#{tableNameUpper}',
            payload: filterParams
        }).then(() => {

            const response = this.props.#{tableName}.editStatus

            if (response && response.code === 0) {
                message.success("数据启用成功");
                this.initList();
				//重置table的选择
                 this.baseTbale.clearSelection();
            }
            else {
                message.error("数据启用异常");
            }

        }).catch((err => {
            message.error(JSON.stringify(err));
        }))
    }


	//联系人的添加Modal处理
	handleOk = () => {
		this.edit#{tableNameUpper}.form.handleFilterSubmit();
	}

	//隐藏编辑列表
	hiddenModal = () => {
		this.setState({
			visible: false,
			editVisible: false,
		});
	}


    columns = [
        #{columns_fileld}
        {
            title: '操作', dataIndex: 'operate', key: 'x', width: 180, render: (text, record) =>
                <div>
                    <a onClick={() => {
                        this.setState({
                            detailsModal: true,
                            record: record
                        })
                    }}>详细信息</a>
                    <Divider type="vertical" />
                    
                    <a onClick={() => {
                        this.setState({
                            visible: true,
                            record: record,
                            isUpdate: true,
                            modalTitle: "编辑#{tableNameChinese}信息"
                        })
                    }}>编辑</a>
                    <Divider type="vertical" />
                    {record.isDelete == 0 ?
                        (<Popconfirm title="确定停用本条数据？请谨慎操作！" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} onConfirm={() => this.handleDelete(record.bankOid)}>
                            <a href="javascript:;">停用</a>
                        </Popconfirm>) :
                        (<Popconfirm title="确定启用本条数据？" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} onConfirm={() => this.handleOpen(record.bankOid)}>
                            <a href="javascript:;">启用</a>
                        </Popconfirm>)}
                </div>,
        }];
    render() {
        const formList = [
            #{descript}
        ];

        return (
            <PageHeaderWrapper
                style={{ backgroundColor: '#FFF' }}
                title={"#{tableNameChinese}"}
            >
                <Card
                    border={true}
                >
                    <div style={{ background: '#fff' }}>
                        <BaseForm
                            style={{ marginBottom: 24, marginTop: 10 }}
                            onCancel={() => { this.filterParams = {}; this.initList(); }}
                            formList={formList}
                            hideOpen={true}
                            filterSubmit={this.handleFilterSubmit} />

							<div style={{ marginBottom: 16 }}>
                            <Button type={"primary"} icon="plus" style={{ marginRight: 12 }} onClick={() => {
                                this.setState({
                                    visible: true,
                                    record: null,
                                    isUpdate: false,
                                    modalTitle: "新增#{tableNameChinese}信息"
                                })
                            }}>添加</Button>
                            <Button icon="edit" style={{ marginRight: 12 }} onClick={() => {
                                if (!this.checkItems) {
                                    message.info("请先选择#{tableNameChinese}");
                                    return;
                                }

                                this.setState({
                                    visible: true,
                                    record: this.checkItems,
                                    isUpdate: true,
                                    modalTitle: "编辑#{tableNameChinese}"
                                })
                            }}>编辑</Button>
                            <Button icon="delete" onClick={() => {
                                if (!this.checkItems) {
                                    message.info("请先选择#{tableNameChinese}");
                                    return;
                                }

                                const that = this;
                                //确认框
                                Modal.confirm({
                                    title: '您确定要删除此#{tableNameChinese}吗?',
                                    onOk() {
                                        that.handleDelete(that.checkItems);
                                    },
                                    onCancel() { },
                                });

                            }}>删除</Button>
                        </div>
                        <BaseTable
							onRef={r => this.baseTbale = r}
                            loading={this.state.loading}
                            columns={this.columns}
                            dataSource={this.state.list.list}
                            enableNumber={false}
                            tablePagination={{ total: this.state.list.total, pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize }}
                            onPageChange={this.onPageChange}
                            onShowSizeChange={this.onShowSizeChange}
                            onSelectItem={this.onSelectItem}
                            checkType={"radio"}
                            scroll={{ x: 2300 }}
                        />
                        <Modal
                            title="#{tableNameChinese}详细信息"
                            width='70%'
                            style={{ top: 100, padding: 0 }}
                            visible={this.state.detailsModal}
                            onCancel={() => {
                                this.setState({
                                    detailsModal: false
                                })
                            }}
                            footer={null}
                            bodyStyle={{ paddingBottom: 10 }}
                            maskClosable={false}
							closable={true}
                            destroyOnClose
                        >
                            <Details record={this.state.record} {...modalLayout} />
                        </Modal>
						<Modal
						  title={this.state.modalTitle}
						  visible={this.state.visible}
						  width='800px'
						  onOk={this.handleOk}
						  onCancel={() => {
							this.baseTbale.clearSelection();
							this.setState({ visible: false });
							this.checkItems = null;
						  }}
						  maskClosable={false}
						  destroyOnClose
						  closable={true}
						  style={{ top: 50 }}
						>
						  <Edit#{tableNameUpper}
							onRef={(r) => { this.edit#{tableNameUpper} = r }}
							record={this.state.record}
							isUpdate={this.state.isUpdate}
							refresh={() => {
							  this.hiddenModal();
							  this.initList();
							  this.baseTbale.clearSelection();
							}}
						  />
						</Modal>
                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }

}
