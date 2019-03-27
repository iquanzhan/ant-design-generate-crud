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
				#{descript}
			]
        }];

        return (
            <div style={this.props.style}>
                <DescriptionInfo content={content} />
            </div>
        );
    }
}