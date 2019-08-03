import React, { Component } from 'react';
import { connect } from 'dva';
import { message } from 'antd';
import BaseForm from "@/components/BaseForm";


@connect(({ #{tableName} }) => ({
    #{tableName}
}))
class index extends Component {

  state = {
    loading: true
  }

  componentDidMount() {
    this.props.onRef && this.props.onRef(this);
  }

  filterSubmit = (values) => {
    const { dispatch } = this.props;

    const { isUpdate, record } = this.props;
    if (isUpdate) {
      values.#{primaryKey} = record.#{primaryKey};
    }
    dispatch({
      type: ''#{tableName}/add#{tableNameUpper}'',
      payload: values
    }).then(() => {
      const response = this.props.#{tableName}.addStatus;
      
      if (response && response.code == 0) {
        if (isUpdate) {
          message.success("#{tableNameChinese}修改成功");
        }
        else {
          message.success("#{tableNameChinese}添加成功");
        }
        this.props.refresh();
      }
    })
  }

  render() {
    const record = this.props.record || {};

    const formList = [
      #{descript}
    ];

    return (
      <div style={{paddingLeft:32,paddingRight:32}}>
        <BaseForm
          onRef={(r) => { this.form = r }}
          style={this.props.style}
          formList={formList}
          filterSubmit={this.filterSubmit}
          showOk={false}
          showCancel={false}
          gutter={16}
          layout={"Grid"}
        />
      </div>
    );
  }
}

export default index;