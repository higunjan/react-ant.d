import React, { Component } from 'react';
import { Form, Layout, Menu, Icon } from 'antd';
import ReactDom from 'react-dom';
import {
    BrowserRouter as Router,
    Link,
    Route // for later
} from 'react-router-dom';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { requestDashboardDetails } from '../../modules/dashboard';
import './dashboard-component.scss';
import VidolyLogo from '../../assets/images/user-logo.jpg'
import MeetingsListing from '../meetings/meetings-listing/meetings-listing-component';
import WrappedMeetingDetail from '../meetings/meeting-details/meeting-details-component';
import ViewMeetingDetail from '../meetings/view-meeting-details/view-meeting-details-component';

const { Header, Content, Sider } = Layout;

class Dashboard extends Component {

    componentDidMount() {
        // push('./meetings');
        if(this.props.history){
            this.props.history.push('/dashboard/meetings');
        }
    }

    render() {
        return (
            <Layout>
                <Header className="header">
                    <div className="logo">
                        <img alt="App Logo" src={VidolyLogo} />
                    </div>
                </Header>
                <Layout>
                    <Router>
                        <Sider width={200} style={{ background: '#fff' }}>
                            <Menu  defaultSelectedKeys={['2']} mode="inline">
                                <Menu.Item key="1">
                                    <Icon type="pie-chart" />
                                    <span>Profile</span>
                                </Menu.Item>
                                <Menu.Item key="2">
                                    <Link to='/dashboard/meetings'>
                                        <Icon type="desktop" />
                                        <span>Meetings</span>
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        </Sider>
                        <Content>
                            <Route exact path='/dashboard/meetings' component={MeetingsListing} />
                            <Route path='/dashboard/meetings/add' component={WrappedMeetingDetail} />
                            <Route path='/dashboard/meetings/edit' component={WrappedMeetingDetail} />
                            <Route path='/dashboard/meetings/view' component={ViewMeetingDetail} />
                        </Content>
                    </Router>
                </Layout>
            </Layout>
        );
    }
}


const WrappedDashboard = Form.create()(Dashboard);
ReactDom.render(<WrappedDashboard />, document.getElementById('root'));

const mapStateToProps = ({ dashboard }) => ({
    meeting_name: dashboard.meeting_name,
    meeting_subject: dashboard.meeting_subject,
    meeting_date: dashboard.meeting_date,
    meeting_time: dashboard.meeting_time,
    meeting_id: dashboard.meeting_id
})

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            requestDashboardDetails
        },
        dispatch
    )

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(WrappedDashboard)
