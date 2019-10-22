import React, { Component } from 'react'
import ReactDom from 'react-dom';
import { Card, Avatar, Form, Icon, Input, Button, message } from 'antd';
import RCG from 'react-captcha-generator';
import {RxHR} from "@akanass/rx-http-request";

import { push } from 'connected-react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import {
  increment,
  incrementAsync,
  decrement,
  decrementAsync
} from '../../../modules/counter';

import './login-component.scss';
import AvtarSrc from '../../../assets/images/user-logo.jpg';

import devUrl from '../../../environment';

const FormItem = Form.Item;
let state = {};

class Login extends Component {

    constructor(props) {
        super(props)
        this.state = {
            redirect: false
        }
    }
    handleSubmit = (e) => {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                    const options = {
                        body: {
                            phone: values.phone,
                            password: values.password
                        },
                        json: true // Automatically stringifies the body to JSON
                    };
                    this.props.otpPage();
                    // RxHR.post(devUrl+'/login', options).subscribe(
                    //     (data) => {
                    //         let body = data.body;
                    //         if (data.response.statusCode === 200) {
                    //             if(body.status){
                    //                 message.success("OTP send on your register mobile and email.");
                    //                 localStorage.setItem("userId", body.data._id);
                    //                 this.setState({
                    //                     userId: body.data._id
                    //                 });
                    //                 state = this.state;
                    //                 this.props.otpPage();
                    //             } else {
                    //                 message.error(body.message);
                    //             }
                    //         } else {
                    //             message.error(body.message);
                    //         }
                    //     },
                    //     (err) => console.error(err) // Show error in console
                    // );
            }
        });
    }
    
    render() {
        const { getFieldDecorator } = this.props.form;

        return (
            <div className="login-container">
                <Card bordered={false} className="card-login">
                    <a href="/" id="logo">Login Demo</a>
                    <Avatar size={72} icon="user" className="avatar-user" src={AvtarSrc} />
                    <Form onSubmit={this.handleSubmit} className="login-form">
                        <FormItem>
                            {getFieldDecorator('phone', {
                                rules: [{ required: true, message: 'Please input your phone!' }],
                            })(
                                <Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} placeholder="Phone or Email" />
                            )}
                        </FormItem>
                        <FormItem>
                            {getFieldDecorator('password', {
                                rules: [{ required: true, message: 'Please input your Password!' }],
                            })(
                                <Input prefix={<Icon type="lock" style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
                            )}
                        </FormItem>
                        <FormItem>
                            <Button type="primary" htmlType="submit" className="login-form-button">Log in</Button>
                        </FormItem>
                    </Form>
                </Card>
            </div>
        );
    }
}

const WrappedLogin = Form.create()(Login);
ReactDom.render(<WrappedLogin />, document.getElementById('root'));


const mapStateToProps = ({ counter }) => ({
  count: counter.count,
  isIncrementing: counter.isIncrementing,
  isDecrementing: counter.isDecrementing
})

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      increment,
      incrementAsync,
      decrement,
      decrementAsync,
      otpPage: () => push({
                        pathname: '/dashboard',
                        state: state
                    })
    },
    dispatch
  )

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(WrappedLogin)
