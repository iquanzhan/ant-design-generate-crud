import React, { Component } from 'react';

import { Divider, Modal, Card } from 'antd';
import { connect } from 'dva';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';

import Details from './Details';
import EditProduct from './EditProduct';
import BaseTable from '@/components/ProductTable/Base';
import BaseForm from "@/components/ProductForm";


const modalLayout = {
    style: { height: 'calc(80.3vh)', overflowY: 'auto', overflowX: 'hidden' }
}

@connect(({ approvals }) => ({
    approvals
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
        this.setState({
            loading: true
        });
        const { dispatch, type } = this.props;
        dispatch({
            type: 'approvals/getApprovals',
            payload: { ...this.filterParams, pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize, tableType: type }
        }).then(res => {
            const response = this.props.approvals.getApprovalsStatus;
            this.setState({
                loading: false
            })
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

    columns = [
        {
            title: '产品名称',
            dataIndex: 'product_name',
            width: 150
        },
        {
            title: '产品名称（英文）',
            dataIndex: 'product_name_en',
            width: 180
        },
        {
            title: '批准文号（批准号）',
            dataIndex: 'approvals_no',
            width: 220
        },
        {
            title: '注册人',
            dataIndex: 'register',
            width: 230
        },
        {
            title: '注册人英文',
            dataIndex: 'register_en',
            width: 230
        },
        {
            title: '注册地址',
            dataIndex: 'register_addr',
            width: 250
        },
        {
            title: '注册地址英文',
            dataIndex: 'register_addr_en',
            width: 200
        },
        {
            title: '生产企业',
            dataIndex: 'enterprise',
            width: 230
        },
        {
            title: '生产企业英文',
            dataIndex: 'enterprise_en',
            width: 230
        },
        {
            title: '备注',
            dataIndex: 'note_info'
        },
        {
            title: '操作', dataIndex: 'operate', key: 'x', render: (text, record) =>
                <div>
                    <a onClick={() => {
                        this.setState({
                            editModal: true,
                            record
                        })
                        this.editProduct.editStep.setState({
                            updateModalVisible: true
                        })
                    }}>编辑</a>
                    <Divider type="vertical" />
                    <a onClick={() => {
                        this.setState({
                            detailsModal: true,
                            record
                        })
                    }}>详细信息</a>

                </div>,
            fixed: 'right',
            width: 130
        }
    ];
    render() {
        const formList = [
            {
                type: 'select',
                label: '类型',
                field: 'tableType',
                placeholder: '请选择产品类型',
                list: [
                    { id: '1', name: "产品信息变更" },
                    { id: '2', name: "技术转让" },
                    { id: '3', name: "批件再注册" },
                    { id: '4', name: "证书补发" }
                ],
                width: 200
            },
            {
                type: 'input',
                label: '产品名称',
                field: 'product_name',
                placeholder: '请输入产品名称',
                width: 200
            },
            {
                type: 'input',
                label: '生产企业',
                field: 'product_name',
                placeholder: '请输入生产企业',
                width: 200
            }, {
                type: 'input',
                label: '申报单位',
                field: 'regist_unit_name',
                placeholder: '请输入申报单位',
                width: 200
            },
        ];

        return (
            <PageHeaderWrapper
                style={{ backgroundColor: '#FFF' }}
                title={"历史批件"}
            >
                <Card
                    border={true}
                >
                    <div style={{ background: '#fff' }}>
                        <BaseForm
                            style={{ marginBottom: 16, marginTop: 10, marginLeft: 10 }}
                            onCancel={() => { this.filterParams = {}; this.initList(); }}
                            formList={formList}
                            hideOpen={true}
                            filterSubmit={this.handleFilterSubmit} />

                        <BaseTable
                            loading={this.state.loading}
                            columns={this.columns}
                            dataSource={this.state.list.list}
                            enableNumber={false}
                            tablePagination={{ total: this.state.list.total, pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize }}
                            onPageChange={this.onPageChange}
                            onShowSizeChange={this.onShowSizeChange}
                            onSelectItem={this.onSelectItem}
                            checkType={null}
                            scroll={{ x: 2300 }}
                        />
                        <Modal
                            title="批件详细信息"
                            width='70%'
                            style={{ top: 20, padding: 0 }}
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

                        <EditProduct onRef={r => this.editProduct = r} record={this.state.record} />
                    </div>
                </Card>
            </PageHeaderWrapper>
        )
    }

}
