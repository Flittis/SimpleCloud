import React, { useContext, useState, useEffect } from 'react'

import { Context } from '../../../index.js'
import { observer } from 'mobx-react-lite'
import { Icon } from 'flitui';
import { users } from '../../Icons/index.js';

let Dashboard = ({ setLoading, setErr }) => {
    const { Service } = useContext(Context);

    const [data, setData] = useState({})

    useEffect(() => {
        setLoading(true);

        async function fetchData() {
            

            setLoading(false);
        }

        fetchData();
    }, [Service, setLoading])

    return (
        <div className='app__content-wrapper' id='dashboard'>
            <column className='dashboard__left'>
                <column className='app__content-meta'>
                    <h2 className='app__meta-title'>Dashboard</h2>
                    <h5 className='app__meta-subtitle'>9 April 2022 • 14:00</h5>
                </column>

                <column className='app__content-data'>
                    <block className='data__block-primary'>
                        <h3>Server</h3>

                        <row className='data__block-row'>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>Hostname</h5>
                                <h4 className='block-data'>simplecloud.com</h4>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>Network</h5>
                                <h4 className='block-data'>51.83.187.184</h4>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>System</h5>
                                <h4 className='block-data'>Ubuntu 20.04</h4>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>Uptime</h5>
                                <h4 className='block-data'>30 days</h4>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>Server time</h5>
                                <h4 className='block-data'>9 April 2022 14:00</h4>
                            </block>
                        </row>
                    </block>

                    <block className='data__block-primary'>
                        <h3>Resources</h3>

                        <row className='data__block-row'>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>CPU</h5>
                                <h4 className='block-data'>Intel 2.29GHz</h4>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>CPU1</h5>
                                <h4 className='block-data'>30%</h4>
                                <div className='block-progress' style={{ height: '30%' }}/>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>RAM</h5>
                                <h4 className='block-data'>1.0 / 2.0 GB</h4>
                                <div className='block-progress' style={{ height: '50%' }}/>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>Disk</h5>
                                <h4 className='block-data'>5.2 / 30.0 GB</h4>
                                <div className='block-progress' style={{ height: '20%' }}/>
                            </block>
                            <block className='data__block-secondary'>
                                <h5 className='block-title'>Processes</h5>
                                <h4 className='block-data'>180</h4>
                            </block>
                        </row>
                    </block>
                </column>
            </column>

            <column className='dashboard__right'>
                <column className='app__content-meta'>
                    <h2 className='app__meta-title'>Analytics</h2>
                    <h5 className='app__meta-subtitle' id='analytics_range'>last 7 days</h5>
                </column>

                <column className='app__content-data'>
                    <block className='data__block-primary'>
                        <row>
                            <Icon className='block-icon' use='#icon_users'/>
                            <h5 className='block-title'>Users</h5>
                        </row>

                        <h3 className='block-data'> 5,000 </h3>
                    </block>
                    
                    <block className='data__block-primary'>
                        <row>
                            <Icon className='block-icon' use='#icon_users'/>
                            <h5 className='block-title'>Total Users</h5>
                        </row>

                        <h3 className='block-data'> 120,000 </h3>
                    </block>
                    <block className='data__block-primary'>
                        <row>
                            <Icon className='block-icon' use='#icon_files'/>
                            <h5 className='block-title'>Files</h5>
                        </row>

                        <h3 className='block-data'> 7,500 </h3>
                    </block>

                    <block className='data__block-primary'>
                        <row>
                            <Icon className='block-icon' use='#icon_files'/>
                            <h5 className='block-title'>Total Files</h5>
                        </row>

                        <h3 className='block-data'> 500,000 </h3>
                    </block>
                    <block className='data__block-primary'>
                        <row>
                            <Icon className='block-icon' use='#icon_requests'/>
                            <h5 className='block-title'>Requests</h5>
                        </row>

                        <h3 className='block-data'> 750,000 </h3>
                    </block>

                    <block className='data__block-primary'>
                        <row>
                            <Icon className='block-icon' use='#icon_requests'/>
                            <h5 className='block-title'>Total Requests</h5>
                        </row>

                        <h3 className='block-data'> 7,500,000 </h3>
                    </block>
                </column>
            </column>
        </div>
    )
}

export default observer(Dashboard);
