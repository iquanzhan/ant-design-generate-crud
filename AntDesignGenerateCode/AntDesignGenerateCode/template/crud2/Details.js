import React, { PureComponent } from 'react';
import { connect } from 'dva';
import DescriptionInfo from '@/components/DescriptionEditInfo';

@connect(({ product }) => ({
    product
}))
export default class Index extends PureComponent {

    render() {
        const record = this.props.record || {};
        const content = [{
            title: '基础信息',
            col: 3,
            list: [
                {
                    title: '产品名称',
                    value: record.product_name
                },
                {
                    title: '产品名称（英文）',
                    value: record.product_name_en
                },
                {
                    title: '批准文号（批准号）',
                    value: record.approvals_no
                },
                {
                    title: '注册人',
                    value: record.register
                },
                {
                    title: '注册人英文',
                    value: record.register_en
                },
                {
                    title: '注册地址',
                    value: record.register_addr
                },
                {
                    title: '注册地址英文',
                    value: record.register_addr_en
                },
                {
                    title: '生产企业',
                    value: record.enterprise
                },
                {
                    title: '生产企业英文',
                    value: record.enterprise_en
                },
                {
                    title: '生产国（地区）',
                    value: record.country
                },
                {
                    title: '备注',
                    value: record.note_info
                }
            ]
        }];

        return (
            <div style={this.props.style}>
                <DescriptionInfo content={content} />
            </div>
        );
    }
}