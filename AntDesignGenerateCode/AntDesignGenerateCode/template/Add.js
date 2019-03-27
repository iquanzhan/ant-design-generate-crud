import React, { PureComponent, Suspense } from 'react';
import router from 'umi/router';

import PageHeaderWrapper from '@/components/PageHeaderWrapper';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import PageLoading from '@/components/PageLoading';
import BaseForm from "@/components/BaseForm";
import { connect } from 'dva';
import { message } from 'antd';



const formItemLayout = {
    labelCol: {
        xs: { span: 24 },
        sm: { span: 10 },
        md: { span: 7 },
        lg: { span: 7 }
    },
    wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
        md: { span: 14 },
        lg: { span: 17 }
    }
};

@connect(({ #{tableName} }) => ({
    #{tableName}
}))
export default class Index extends PureComponent {

    handleFilterSubmit = (filterParams) => {

        const { onClose, isUpdate, dispatch, record } = this.props;
        if (isUpdate) {

            filterParams.#{primaryKey} = record.#{primaryKey};

            //修改数据
            dispatch({
                type: '#{tableName}/edit#{tableNameUpper}',
                payload: filterParams
            }).then(() => {

                const response = this.props.#{tableName}.editStatus;

                if (response && response.code === 0) {
                    message.success("数据修改成功");
                    onClose && onClose();
                }
                else {
                    message.error("数据保存异常");
                }

            }).catch((err => {
                message.error(JSON.stringify(err));
            }))
        }
        else {
            //保存
            dispatch({
                type: '#{tableName}/add#{tableNameUpper}',
                payload: filterParams
            }).then(() => {
                const response = this.props.#{tableName}.addStatus

                if (response && response.code === 0) {
                    message.success("数据添加成功");
                    onClose && onClose();
                }
                else {
                    message.error("数据保存失败");
                }

            }).catch((err => {
                message.error(JSON.stringify(err));
            }))
        }

    };

    cancel = () => {
        const onClose = this.props.onClose;
        onClose && onClose();
    }


    render() {
        const size = this.props.size;
        const record = this.props.record || {};

        const formList = [{
            layoutType: 'card',
            list: [
                #{descript}
            ]
        }];

        return (
            <GridContent>
                <Suspense fallback={<PageLoading />}>
                    <BaseForm style={this.props.style} formList={formList} size={size} filterSubmit={this.handleFilterSubmit} cancel={this.cancel} />
                </Suspense>
            </GridContent>
        );
    }
}