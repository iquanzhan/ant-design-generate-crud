import React, { PureComponent } from 'react';
import DescriptionInfo from '@/components/DescriptionInfo';

export default class Index extends PureComponent {

    getOptionChinese = (list, key) => {
        for (let i = 0; i < list.length; i++) {
            if (list[i].id == key) {
                return list[i].name;
            }
        }
        return "";
    }

    render() {
        const record = this.props.record;
        const content = [{
            title: '基础信息',
            col: 3,
            list: [
				{
                title: 附件id,
                value: record.bankOid
            },
			{
                title: 业主id,
                value: record.ownerOid
            },
			{
                title: 业主姓名,
                value: record.ownerName
            },
			{
                title: 收款户名,
                value: record.bankUser
            },
			{
                title: 银行卡号,
                value: record.bankCard
            },
			{
                title: 所属银行名称,
                value: record.bankName
            },
			{
                title: 收款银行名称,
                value: record.bankPay_name
            },
			{
                title: 更新人id,
                value: record.updateEmployee
            },
			{
                title: 更新时间,
                value: record.updateTime
            },
			{
                title: 公共客商编号,
                value: record.customerCode
            },
			{
                title: 是否停用,
                value: record.isDelete
            },
			
			]
        }];

        return (
            <div style={this.props.style}>
                <DescriptionInfo content={content} />
            </div>
        );
    }
}