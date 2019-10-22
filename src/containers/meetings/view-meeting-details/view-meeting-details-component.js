import React, { Component } from 'react';
import ReactDom from 'react-dom';
import { Card, Modal, Select, Button, message, Divider, Tag, Form, Input, Icon } from 'antd';
import { bindActionCreators } from 'redux'
import { connect } from 'react-redux';
import {RxHR} from "@akanass/rx-http-request";
import devUrl from '../../../environment';
import './view-meeting-details-component.scss';
// import outlookIcon from '../../../assets/images/outlook.png';
import moment from 'moment';
import AddToCalendar from 'react-add-to-calendar';
const documentURL = "http://admin.vidoly.us:8000/";
const recordingURL = "http://vconf.vidoly.us:8000/recording/";


const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

class ViewMeetingDetail extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isInvilteModalVisible: false,
            isDocumentModalVisible: false,
            documentRow: '<tr><td colspan="3">No Record Found.</td></tr>',
            response: {},
            meetingId: ""
        }
        this.showModal = this.showModal.bind(this);
        this.handleOk = this.handleOk.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
    }

    componentWillMount() {
        if(this.props.location && this.props.location.state){
            this.setState(this.props.location.state);
        }
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
                                let responseBody = body.data[0];

                                this.setState({
                                    response: responseBody
                                })
                                message.success(body.message);
                                this.setState({
                                    event: {
                                        title: responseBody.name,
                                        description: `Admin is inviting you to a scheduled Vidoly meeting.Join Vidoly Meeting: ${window.location.origin+'/join/'+this.state.response.unique_id}. Password for joining: ${this.state.response.join_psw}`,
                                        location: 'Audio or Video Call',
                                        startTime: moment(responseBody.date).toISOString()
                                    }
                                });
                                this.setState({
                                    items: [
                                       { outlook: 'Outlook' },
                                       { google: 'Google' }
                                    ]
                                });
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

        let documentArr = [];
        
        if(this.state.response.documents && this.state.response.documents.length){
            this.state.response.documents.forEach(ele => {
                documentArr.push(<tr>
                            <td>
                                <a href={documentURL+ele} target="_blank">View Document</a>
                            </td>
                            <td>Document</td>
                        </tr>
                    );
            })
            this.state.response.recording.forEach(ele => {
                documentArr.push(<tr>
                            <td>
                                <a href={recordingURL+ele} target="_blank">View Recording</a>
                            </td>
                            <td>Recording</td>
                        </tr>
                    );
            })
        }

        return (
            <div className="view-meeting-details-container">
                <Card bordered={false} className="card">
                    <label className="heading">Meeting Details</label>
                    <div className="row">
                        <label className="lbl">Meeting ID : </label>
                        <label className="lbl_value">{this.state.response.unique_id}</label>
                    </div>
                    <div className="row">
                        <label className="lbl">Subject : </label>
                        <label className="lbl_value">{this.state.response.name}</label>
                    </div>
                    <div className="row">
                        <label className="lbl">Descriptions : </label>
                        <label className="lbl_value">{this.state.response.subject}</label>
                    </div>
                    <Divider type="horizontal" />
                    <div className="row">
                        <label className="lbl">Date : </label>
                        <label className="lbl_value">{this.state.response.date}</label>
                    </div>
                    <div className="row">
                        <label className="lbl">Time :</label>
                        <label className="lbl_value">{this.state.response.time}</label>
                    </div>
                    <div className="row">
                        <label className="lbl">Duration :</label>
                        <label className="lbl_value">{this.state.response.duration} Hours</label>
                    </div>
                    <Divider type="horizontal" />
                    <div className="row meeting">
                        <label className="lbl">Meeting URL :</label>
                        <label className="lbl_value meeting-url">
                            <a href={window.location.origin+'\/join/'+this.state.response.unique_id} target="_blank">{window.location.origin+'\/join/'+this.state.response.unique_id}</a>
                        </label>
                        <div className="outlook">
                            <AddToCalendar
                               event={this.state.event}
                               buttonLabel="Add To Calender"
                               buttonClassOpen='react-add-to-calendar__button--light'
                               buttonWrapperClass='react-add-to-calendar__wrapper'
                               displayItemIcons='true'
                               listItems={this.state.items} />
                        </div>
                    </div>
                    <div className="row">
                        <label className="lbl">Joining Password :</label>
                        <label className="lbl_value">{this.state.response.join_psw}</label>
                    </div>
                    <div>
                        <Button className="button" type="primary" onClick={this.showDocuments}>View Documents</Button>
                        <Button className="button" type="primary" onClick={this.showModal}>Invite Into Meeting</Button>
                        <Button className="button" type="primary" onClick={this.editMeeting}>Edit</Button>
                        <Button className="button" type="danger" onClick={this.deleteMeeting}>Delete</Button>
                    </div>
                    <Modal
                        title="Invite"
                        visible={this.state ? this.state.isInvilteModalVisible : false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <p>Invite people in the meeting.</p>
                        <Form onSubmit={this.modalForm} className="meeting-form">
                            <FormItem>
                                {getFieldDecorator('emails', {
                                    rules: [{ required: true, message: 'Meeting Subject' }],
                                })(
                                    <Input placeholder="Email Address" />
                                )}
                            </FormItem>
                            <FormItem>
                                <Button type="primary" htmlType="submit" className="meeting-form-button">Send Invitation</Button>
                            </FormItem>
                        </Form>
                    </Modal>

                    <Modal
                        title="Documents"
                        visible={this.state ? this.state.isDocumentModalVisible : false}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                    >
                        <div className="container">
                            <p>Documents shared in meeting.</p>
                            <table class="table table-striped document-show">
                                <thead>
                                  <tr>
                                    <th>Documents</th>
                                    <th>Type</th>
                                  </tr>
                                </thead>
                                <tbody>
                                    {documentArr}
                                </tbody>
                              </table>
                          </div>
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

    showDocuments = () => {
        this.setState({
            isDocumentModalVisible: true
        });
    }

    handleOk = e => {
        this.setState({
            isInvilteModalVisible: false,
            isDocumentModalVisible: false,
        });
    };

    handleCancel = e => {
        this.setState({
            isInvilteModalVisible: false,
            isDocumentModalVisible: false,
        });
    };

    modalForm = (e) => {
        e.preventDefault();
        // this.showModal();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                console.log("email ID:::", values)
                let emails = values.emails.split(",");

                const options = {
                    body: {
                        participant: emails,
                        _id: this.state.meetingId
                    },
                    json: true // Automatically stringifies the body to JSON
                };
                
                RxHR.post(devUrl+'/send-invitation', options).subscribe(
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
    }

    editMeeting = () => {
        let meetingId = this.state.meetingId;
        if(meetingId){
            this.props.history.push('/dashboard/meetings/edit?id='+meetingId);
        }
    }

    deleteMeeting = () => {
        let meetingId = this.state.meetingId;
        if(meetingId){
            const options = {
                body: {
                    _id: this.state.meetingId
                },
                json: true // Automatically stringifies the body to JSON
            };
            
            RxHR.post(devUrl+'/delete-meeting', options).subscribe(
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
    }


}

const WrappedViewMeetingDetail = Form.create()(ViewMeetingDetail);
ReactDom.render(<WrappedViewMeetingDetail />, document.getElementById('root'));


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
)(WrappedViewMeetingDetail)
