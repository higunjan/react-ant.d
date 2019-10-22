import React, { Component } from 'react';
import { Table, Divider, Button, message } from 'antd';
import { Link } from 'react-router-dom';
import {RxHR} from "@akanass/rx-http-request";
import devUrl from '../../../environment';
import moment from 'moment';
import { push } from 'connected-react-router'
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux'


class MeetingListing extends Component {

    columns = [
        {
            title: 'Start Time',
            dataIndex: 'start_time',
            key: 'start_time',
            // render: text => <a href="javascript:;">{text}</a>,
        },
        {
            title: 'Topic',
            dataIndex: 'topic',
            key: 'topic',
        },
        {
            title: 'Meeting ID',
            dataIndex: 'meeting_id',
            key: 'meeting_id',
        }
    ];
    constructor(props) {
        super(props);
        this.state = {
            bindData: []
        };
        let data = [];
        RxHR.get(devUrl+'/fetch-meeting').subscribe(
            (response) => {
                let body = response.body;
                if (response.response.statusCode === 200) {
                    if(body && typeof body == "string"){
                        body = JSON.parse(body);
                    }
                    if(body.status){
                        let apiData = body.data;
                        apiData.forEach((el, ind) => {
                            data.push({
                                key: el._id,
                                start_time: moment(el.date).format('DD-MM-YYYY'),
                                meeting_id: el.unique_id,
                                topic: el.name,
                            })
                        })
                        this.setState({
                            bindData: data
                        })
                    } else {
                        message.error(body.message);
                    }
                } else {
                    message.error(body.message);
                }
            },
            (err) => console.error(err) // Show error in console
        );

    }
    render() {
        return (
            <div className="content-wrapper">
                <div className="button-section">
                    <Link to='/dashboard/meetings/add'>
                        <Button type="primary">Schedule A New Meeting</Button>
                    </Link>
                </div>
                <Table columns={this.columns} dataSource={this.state.bindData} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            console.log("TEST", record.key);
                            this.props.history.push('/dashboard/meetings/view?id='+record.key);
                        },
                        // onDoubleClick: event => { }, // double click row
                        // onContextMenu: event => { }, // right button click row
                        // onMouseEnter: event => { }, // mouse enter row
                        // onMouseLeave: event => { }, // mouse leave row
                    };
                }} />
            </div>
        );
    }
}


export default MeetingListing
