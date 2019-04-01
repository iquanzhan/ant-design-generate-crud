
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
        }
    }


    componentDidMount() {
        this.initList();
    }
    

    formList = [
        #{descript}
    ]


    columns = [
        #{columns_fileld}
        ];


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

        return (
            <GridContent>
                <Suspense fallback={<PageLoading />}>
                    <div style={{ background: '#fff' }}>
                        <PageHeaderWrapper style={{ marginTop: 20, marginLeft: 15, border: 'none' }}>

                            <div style={{ background: '#fff' }}>
                                <BaseForm onCancel={() => { this.filterParams = {}; this.initList(); }} formList={this.formList} filterSubmit={this.handleFilterSubmit} />

                                <BaseTable
                                    columns={this.columns}
                                    dataSource={this.state.list.list}
                                    rowKeyField={"#{primaryKey}"}
                                    tablePagination={{ total: this.state.list.total, pageNum: this.state.list.pageNum, pageSize: this.state.list.pageSize }}
                                    onPageChange={this.onPageChange}
                                    onShowSizeChange={this.onShowSizeChange}
                                    onRef={(r) => { this.addChild = r }}
                                />
                            </div>
                        </PageHeaderWrapper>
                    </div>
                </Suspense>
            </GridContent>
        );
    }
}