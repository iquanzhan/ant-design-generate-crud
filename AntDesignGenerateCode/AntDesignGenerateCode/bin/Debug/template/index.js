
import React, { PureComponent, Suspense } from 'react';
import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageLoading from '@/components/PageLoading';
import { Icon, Badge, Popconfirm, Divider, message, Modal } from 'antd';
import { connect } from 'dva';

import SearchTable from '@/components/SearchTable';
import AddBank from './Add#{tableNameUpper}';
import ProductToolbar from '@/components/ProductToolbar';
import ProductModal from '@/components/ProductModal';
import BaseTable from '@/components/ProductTable/Base';
import BaseForm from "@/components/ProductForm";

import Details from './Details';


const modalLayout = {
    style: { height: 'calc(40vh)', overflowY: 'auto', overflowX: 'hidden' }
}

@connect(({ #{tableName} }) => ({
    #{tableName}
}))
export default class Index extends PureComponent {

    state = {
        list: {
            pageNum: 1,
            pageSize: 10,
            total: 0,
            list: []
        },
        record: {},
        showModal: false
    }


    componentDidMount() {
        this.initList();
    }
    

    //用户选中的数据
    checkItems = [];


    formList = [
        #{descript}
    ]

    editButtons = {
        modal: {
            title: "编辑#{tableNameChinese}",
            width: '70%',
            style: { paddingTop: 0 }
        }
    };

    columns = [
        #{columns_fileld}
        {
            title: '操作', dataIndex: 'operate', key: 'x', width: 180, render: (text, record) =>
                <div>
                    <a onClick={() => this.editShow(record)}>编辑</a>
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

    onSelectItem = (data) => {
        let array = data.map((item) => {
            return item.ownerId;
        });

        this.checkItems = array;
    }

    //region editModal相关
    editClose = () => {
        this.setState({
            showModal: false
        })
    }

    editShow = (record) => {
        this.setState({
            showModal: true,
            record
        })
    }

    //endregion

    //设置当前选中的数据
    onGetRecord(records) {
        this.setState({
            record: records
        })
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



    onAddClose = () => {
        this.initList();
        this.addChild.close();
    }

    onEditClose = () => {
        this.initList();
        this.setState({
            showModal: false
        })
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





    //停用#{tableNameChinese}
    handleDelete = (key) => {

        const that = this;
        const { dispatch } = this.props;
        dispatch({
            type: '#{tableName}/delete#{tableNameUpper}',
            payload: { bankOid: key }
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

    //启用数据
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
            }
            else {
                message.error("数据启用异常");
            }

        }).catch((err => {
            message.error(JSON.stringify(err));
        }))
    }



    filterParams = {};

    // 查询表单
    handleFilterSubmit = (filterParams) => {
        const dispatch = this.props.dispatch;

        for (var name in filterParams) {
            if (filterParams[name] == '-1') {
                delete filterParams[name];
            }
        }

        this.filterParams = filterParams;

        //加载记录列表
        this.initList();
    };

    render() {

        const insertModal = {
            modal: {
                title: "新增#{tableNameChinese}",
                width: '65%',
                style: { paddingTop: 0, paddingBottom: 5 },
            }
        };

        return (
            <GridContent>
                <Suspense fallback={<PageLoading />}>
                    <div style={{ background: '#fff' }}>
                        <PageHeaderWrapper style={{ marginTop: 20, marginLeft: 15, border: 'none' }}>

                            <div style={{ background: '#fff' }}>
                                <BaseForm onCancel={() => { this.filterParams = {}; this.initList(); }} formList={this.formList} filterSubmit={this.handleFilterSubmit} rightButtons={this.rightButtons} leftButtons={<div>
                                    <ProductModal {...insertModal.modal} onRef={(r) => { this.addChild = r }} buttons={[{ modalType: 'open', title: '新增', style: { marginBottom: 0, marginRight: 6, marginLeft: 5 }, type: 'primary', icon: 'plus' }]}>
                                        <Add#{tableNameUpper} onClose={this.onAddClose} {...modalLayout} />
                                    </ProductModal></div>} />

                                <BaseTable
                                    columns={this.columns}
                                    dataSource={this.state.list.list}
                                    rowKeyField={"bankOid"}
                                    tablePagination={{ total: this.state.list.total, pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize }}
                                    onPageChange={this.onPageChange}
                                    onShowSizeChange={this.onShowSizeChange}
                                    onRef={(r) => { this.addChild = r }}
                                    onSelectItem={this.onSelectItem}
                                />
                            </div>

                            <Modal
                                {...this.editButtons.modal}
                                visible={this.state.showModal}
                                onCancel={() => {
                                    this.editClose()
                                }}
                                footer={null}
                                bodyStyle={{ paddingBottom: 10 }}
                                onGetRecord={() => this.onGetRecord(record)}
                                maskClosable={false}
                                destroyOnClose
                            >
                                <Add#{tableNameUpper} {...modalLayout} isUpdate={true} onClose={this.onEditClose} record={this.state.record} />
                            </Modal>

                        </PageHeaderWrapper>
                    </div>
                </Suspense>
            </GridContent>
        );
    }
}