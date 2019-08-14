import React, { Component } from 'react';
import { Divider, Modal, Card, Button, Popconfirm, Icon, message, Col, Badge } from 'antd';
import { connect } from 'dva';

import BaseForm from "@/components/ProductForm";
import BaseTable from '@/components/ProductTable/Base';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import TreeShow from '@/components/TreeShow';

import Details from './Details';
import Edit#{tableNameUpper} from './Edit#{tableNameUpper}';
import { Row } from 'antd/es/grid';


const statusMap = ['error', 'success'];
const status = ['已停用', '正常'];

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
        editModal: false,
        //左侧树信息
        treeData: [{
            title: '根字典',
            key: '0'
        }],
        //树选中的节点
        treeSelectedKey: [],
    }

    componentDidMount() {
        //获取所有字典-不分级
        this.initDicData();

        this.initList();
    }

    initDicData = () => {
        const that = this;
        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/getAll#{tableNameUpper}',
            payload: {}
        }).then(res => {
            const response = this.props.#{tableName}.getAll#{tableNameUpper};
            if (response && response.code == 0) {
                let map = this.handleTree(response.resultData);
                let tempTree = [{
                    title: '根字典',
                    key: '0',
                    children: map
                }];

                that.setState({
                    treeData: tempTree
                });
            }
        })
    }

    //处理字典树的字段转换为控件要求的格式
    handleTree = (data) => {
        return data && data.map(item => {
            if (item.children && item.children.length > 0) {
                return { key: item.dict_oid, title: item.dict_name, children: this.handleTree(item.children) };;
            }
            return { key: item.dict_oid, title: item.dict_name };
        });
    }


    //加载表格数据
    initList = (selectKeys) => {
        if (!selectKeys || selectKeys.length <= 0) {
            selectKeys = ['0'];
        }
        this.setState({
            loading: true
        })

        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/get#{tableNameUpper}',
            payload: { parentOid: selectKeys[0], pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize }
        }).then(res => {
            const response = this.props.#{tableName}.get#{tableNameUpper}Status;
            this.setState({
                loading: false
            })
            if (response && response.code == 0) {
                this.setState({
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

        this.initList(this.state.treeSelectedKey);
    }

    //当改变页码时
    onPageChange = (page) => {
        const { list } = this.state;
        list.pageNum = page
        this.setState({
            list
        });
        this.initList(this.state.treeSelectedKey);
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
        this.initList(this.state.treeSelectedKey);
    };
    //停用#{tableNameChinese}
    handleDelete = (key) => {

        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/disable#{tableNameUpper}',
            payload: key
        }).then(() => {
            const response = this.props.#{tableName}.disable#{tableNameUpper}Status;

            if (response && response.code == 0) {
                message.success(response.msg);
                this.initList(this.state.treeSelectedKey);
            }
            else {
                message.error(response ? response.msg : '网络请求异常');
            }

        })
    }

    //启用#{tableNameChinese}
    handleOpen = (key) => {

        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/enable#{tableNameUpper}',
            payload: key
        }).then(() => {
            const response = this.props.#{tableName}.enable#{tableNameUpper}Status;

            if (response && response.code === 0) {
                message.success(response.msg);
                this.initList(this.state.treeSelectedKey);
            }
            else {
                message.error(response ? response.msg : '网络请求异常');
            }

        })
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
        #{columns_fileld},
        {
            title: '操作', fixed: 'right', dataIndex: 'operate', key: 'x', width: 200, render: (text, record) =>
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
                            modalTitle: "编辑#{tableNameChinese}"
                        })
                    }}>编辑</a>
                    <Divider type="vertical" />
                    {record.delete_status == 1 ?
                        (<Popconfirm title="确定停用本条数据？请谨慎操作！" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} onConfirm={() => this.handleDelete(record.#{primaryKey})}>
                            <a href="javascript:;">停用</a>
                        </Popconfirm>) :
                        (<Popconfirm title="确定启用本条数据？" icon={<Icon type="question-circle-o" style={{ color: 'red' }} />} onConfirm={() => this.handleOpen(record.#{primaryKey})}>
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
                    <div style={{ background: '#fff', paddingTop: 20 }}>
                        {/* <BaseForm
                            style={{ marginBottom: 24, marginTop: 10 }}
                            onCancel={() => { this.filterParams = {}; this.initList(); }}
                            formList={formList}
                            hideOpen={true}
                        filterSubmit={this.handleFilterSubmit} /> */}

                        <Row gutter={32}>
                            <Col span={4} >
                                <h3>#{tableNameChinese}</h3>
                                <TreeShow
                                    defaultSelectedKeys={this.state.treeSelectedKey}
                                    onSelect={(keys) => {
                                        this.setState({
                                            treeSelectedKey: keys
                                        })
                                        this.initList(keys);
                                    }}
                                    menuData={this.state.treeData}
                                />
                            </Col>
                            <Col span={20}>
                                <div style={{ marginBottom: 16 }}>
                                    <Button type={"primary"} icon="plus" style={{ marginRight: 12 }} onClick={() => {
                                        let { treeSelectedKey } = this.state;

                                        if (!treeSelectedKey || treeSelectedKey.length <= 0) {
                                            message.info("请先选择树中的父节点");
                                            return;
                                        }
                                        this.setState({
                                            visible: true,
                                            record: null,
                                            isUpdate: false,
                                            modalTitle: "新增#{tableNameChinese}"
                                        })
                                    }}>添加</Button>
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
                                    checkType={null}
                                    childrenColumnName={null}
                                />
                                <Modal
                                    title="#{tableNameChinese}详细信息"
                                    width={680}
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
                                    destroyOnClose
                                >
                                    <Details record={this.state.record} {...modalLayout} />
                                </Modal>
                                <Modal
                                    title={this.state.modalTitle}
                                    visible={this.state.visible}
                                    width={680}
                                    onOk={this.handleOk}
                                    onCancel={() => {
                                        this.baseTbale.clearSelection();
                                        this.setState({ visible: false });
                                        this.checkItems = null;
                                    }}
                                    maskClosable={false}
                                    destroyOnClose
                                    closable={false}
                                    style={{ top: 100 }}
                                >
                                    <Edit#{tableNameUpper}
                                        onRef={(r) => { this.edit#{tableNameUpper} = r }}
                                        record={this.state.record}
                                        isUpdate={this.state.isUpdate}
                                        treeSelectedKey={this.state.treeSelectedKey}
                                        refresh={() => {
                                            this.hiddenModal();

                                            this.initDicData();
                                            this.initList(this.state.treeSelectedKey);

                                            this.baseTbale.clearSelection();
                                        }}
                                    />
                                </Modal>
                            </Col>
                        </Row>



                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }

}
