import React, { PureComponent } from 'react';
import DescriptionInfo from '@/components/DescriptionInfo';


export default class Index extends PureComponent {

     render() {
        const {record} = this.props;
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
}