import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Card, Form, Input, Button, DatePicker, TimePicker, Modal, Select, message } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {RxHR} from "@akanass/rx-http-request";
import { push } from 'connected-react-router'

import moment from 'moment';

import TimezonePicker from 'react-timezone';
import './meeting-details-component.scss'
import devUrl from '../../../environment';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;
let currentUser = undefined;
class MeetingDetail extends Component {
    
    constructor(props) {
        super(props)
        this.state = {
            isInvilteModalVisible: false,
            children: [],
            response: undefined
        }
        this.showModal = this.showModal.bind(this)
        this.handleOk = this.handleOk.bind(this)
        this.handleCancel = this.handleCancel.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)

        for (let i = 10; i < 36; i++) {
            this.state.children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
        }
        currentUser = localStorage.getItem("userId");
        if(!currentUser){
            if(this.props.history){
                this.props.history.push('/login');
            }
            return;
        }
    }

    handleChange = (value) => {
        console.log(`selected ${value}`);
    }
    
    componentDidMount(){
        let viewpage = window.location.search;
        if(viewpage){
            let ids = viewpage.split("=");
            if(ids[0] == '?id' && ids[1]){
                this.setState({
                    meetingId: ids[1]
                })
                RxHR.get(devUrl+'/fetch-meeting?id='+ids[1]).subscribe(
                    (data) => {
                        let body = data.body;
                        if(body && typeof body == "string"){
                            body = JSON.parse(body);
                        }
                        if (data.response.statusCode === 200) {
                            if(body.status){
                                let response = body.data[0];
                                this.setState({
                                    response: body.data[0]
                                })
                                this.props.form.setFieldsValue({
                                  id: response.unique_id,
                                  subject: response.name,
                                  description: response.subject,
                                  date: moment(response.date),
                                  time: moment(response.time, 'HH:mm'),
                                  duration: moment(response.duration, 'HH:mm'),
                                });
                                message.success(body.message);
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
        }
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        
        return (
            <div className="meeting-details-container">
                <Card bordered={false} className="card">
                    <label className="heading">Schedule A Meeting</label>
                    <Form onSubmit={this.handleSubmit} className="meeting-form">
                        <FormItem>
                            {getFieldDecorator('id', {
                                rules: [{ required: true }], initialValue: Date.now()
                            })(
                                <Input placeholder="Meeting ID" disabled/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('subject', {
                                rules: [{ required: true, message: 'Meeting Subject' }],
                            })(
                                <Input placeholder="Meeting Subject" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('description', {
                                rules: [{required: false}],
                            })(
                                <TextArea
                                    placeholder="Meeting Descriptions"
                                    autosize={{ minRows: 3, maxRows: 6 }}
                                />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('date', {
                                rules: [{ required: true }],
                            })(
                                <DatePicker placeholder="Select Meeting Date"/>
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('time', {
                                rules: [{ required: true }],
                            })(
                                <TimePicker use12Hours format="h:mm A" placeholder="Time" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('duration', {
                                rules: [{required: true}],
                            })(
                                <TimePicker format='HH:mm' placeholder="Duration" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="meeting-form-button">Save</Button>
                        </FormItem>
                    </Form>
                    <Modal
                        title="Invite"
                        visible={this.state.isInvilteModalVisible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <p>Invite people in the meeting.</p>
                        <Select
                            mode="multiple"
                            style={{ width: '100%' }}
                            placeholder="Please select"
                            defaultValue={[]}
                            onChange={this.handleChange}
                        >
                            {this.state.children}
                        </Select>
                    </Modal>
                </Card>
            </div>
        );
    }

    showModal = () => {
        this.setState({
            isInvilteModalVisible: true
        });
    }
    handleOk = e => {
        this.setState({
            isInvilteModalVisible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            isInvilteModalVisible: false,
        });
    };

    handleSubmit = e => {
        e.preventDefault();
        // this.showModal();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const options = {
                    body: {
                        name: values.subject,
                        subject: values.description,
                        date: (values.date).toISOString(),
                        time: (values.time).format('HH:mm a'),
                        duration: (values.duration).format('HH:mm'),
                        unique_id: values.id,
                        user_id: currentUser
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                console.log(options);
                RxHR.post(devUrl+'/schedule-meeting', options).subscribe(
                    (data) => {
                        let body = data.body;
                        if (data.response.statusCode === 200) {
                            if(body.status){
                                message.success(body.message);
                                this.props.history.push('/dashboard/meetings');
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
        });
    };


}

const WrappedMeetingDetail = Form.create()(MeetingDetail);
ReactDom.render(<WrappedMeetingDetail />, document.getElementById('root'));


const mapStateToProps = ({ counter }) => ({
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
        },
        dispatch
    )

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedMeetingDetail)
