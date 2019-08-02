import React, { Component } from 'react';
import { Divider, Modal, Button, Steps } from 'antd';
import PropTypes from 'prop-types';
import BaseForm from "@/components/BaseForm";
import EditStep from "@/components/EditStep";

const { Step } = Steps;

const formItemLayout = {
    labelCol: {
        md: { span: 6 },
        lg: { span: 6 }
    },
    wrapperCol: {
        md: { span: 18 },
        lg: { span: 18 }
    }
};

const formItemLayout2 = {
    labelCol: {
        md: { span: 7 },
        lg: { span: 7 }
    },
    wrapperCol: {
        md: { span: 17 },
        lg: { span: 17 }
    }
}


class index extends Component {

    componentDidMount() {
        this.props.onRef && this.props.onRef(this);
    }

    render() {
        const record = this.props.record || {};

        const basciForm = [
            {
                type: 'input',
                label: '产品名称',
                field: 'product_name',
                placeholder: '请填写产品名称',
                message: '请填写产品名称',
                initialValue: record.product_name,
                md: 12,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '产品名称(英文)',
                field: 'product_name_en',
                placeholder: '请填写产品名称（英文）',
                message: '请填写产品名称（英文）',
                md: 12,
                initialValue: record.product_name_en,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '汉语拼音',
                field: 'product_pinyin',
                placeholder: '请填写汉语拼音',
                message: '请填写汉语拼音',
                md: 12,
                initialValue: record.product_pinyin,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '产品类型',
                field: 'product_type',
                placeholder: '请填写产品类型',
                message: '请填写产品类型',
                sm: 12,
                initialValue: record.product_type,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '生产企业',
                field: 'enterprise_name',
                placeholder: '请填写生产企业',
                message: '请填写生产企业',
                md: 12,
                initialValue: record.enterprise_name,
                ...formItemLayout2,
            },
            {
                type: 'input',
                label: '生产企业(英文)',
                field: 'enterprise_name_en',
                placeholder: '请填写生产企业（英文）',
                message: '请填写生产企业（英文）',
                md: 12,
                initialValue: record.enterprise_name_en,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '生产企业地址',
                field: 'enterprise_address',
                placeholder: '请填写生产企业地址',
                message: '请填写生产企业地址',
                sm: 12,
                initialValue: record.enterprise_address,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '生产企业地址（英文）',
                field: 'enterprise_address_en',
                placeholder: '请填写生产企业地址（英文）',
                message: '请填写生产企业地址（英文）',
                sm: 12,
                initialValue: record.enterprise_address_en,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '生产国',
                field: 'product_country',
                placeholder: '请填写生产国',
                message: '请填写生产国',
                sm: 12,
                initialValue: record.product_country,
                ...formItemLayout2
            },
            {
                type: 'input',
                label: '第二生产国',
                field: 'product_country_two',
                placeholder: '请填写第二生产国',
                message: '请填写第二生产国',
                sm: 12,
                initialValue: record.product_country_two,
                ...formItemLayout2
            }
        ];

        const basicForm2 = [{
            type: 'input',
            label: '省/市',
            field: 'product_province',
            placeholder: '请填写省/市',
            message: '请填写省/市',
            sm: 12,
            initialValue: record.product_province,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '申报单位',
            field: 'regist_unit_name',
            placeholder: '请填写申报单位',
            message: '请填写申报单位',
            sm: 12,
            initialValue: record.regist_unit_name,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '申报单位（英文）',
            field: 'regist_unit_name_en',
            placeholder: '请填写申报单位（英文）',
            message: '请填写申报单位（英文）',
            sm: 12,
            initialValue: record.regist_unit_name_en,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '申报单位地址',
            field: 'regist_unit_address',
            placeholder: '请填写申报单位地址',
            message: '请填写申报单位地址',
            sm: 12,
            initialValue: record.regist_unit_address,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '境内申报机构名称',
            field: 'local_unit_name',
            placeholder: '请填写境内申报机构名称',
            message: '请填写境内申报机构名称',
            sm: 12,
            initialValue: record.local_unit_name,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '境内申报机构地址',
            field: 'local_unit_address',
            placeholder: '请填写境内申报机构地址',
            message: '请填写境内申报机构地址',
            sm: 12,
            initialValue: record.local_unit_address,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '境内申报机构联系人',
            field: 'local_unit_people',
            placeholder: '请填写境内申报机构联系人',
            message: '请填写境内申报机构联系人',
            sm: 12,
            initialValue: record.local_unit_people,
            ...formItemLayout2
        },
        {
            type: 'input',
            label: '境内申报机构联系电话',
            field: 'local_unit_phone',
            placeholder: '请填写境内申报机构联系电话',
            message: '请填写境内申报机构联系电话',
            sm: 12,
            initialValue: record.local_unit_phone,
            ...formItemLayout2
        }];
        

        return (
            <div style={{ background: '#fff' }}>
                <EditStep
                    onRef={(r) => this.editStep = r}
                    steps={["基本信息", "生产工艺", "项目指标", "联系人"]}
                    title={"编辑产品信息"}
                    stepsForm={[
                        {
                            type: 'form',
                            content: basciForm,
                            style: {},
                            field: 'basic'
                        },
                        {
                            type: 'form',
                            content: basicForm2,
                            style: {},
                            field: 'basic'
                        }
                    ]}
                />
            </div>
        )
    }
}
export default index;
