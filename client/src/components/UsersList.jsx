import React, { Component } from 'react';
import axios from 'axios'
import FilesList from './FilesList.jsx';
import classNames from 'classnames';

class UsersList extends Component {
    constructor(props){
        super(props);
        this.state = {
            users: [],
            currentUser: '',
        }
    }

    componentDidMount(){
        axios.get('http://localhost:3010/api/browse/users/list')
            .then(res => {
                const users = res.data; 
                console.log(res.data);
                this.setState({ users });
            });
    }

    render() {
        const currentUser = this.props.currentUser;
        const getFiles = this.props.getFiles;

        return (
            <div>
                <div className='br_main br_ulist'>
                    <h1>UsersList</h1>
                    <ul className='br_itemsBar'>
                        {this.state.users.map((user, i) =>
                        <li 
                            className={classNames(
                                'br_item', 
                                {active: user.username === this.props.currentUser},
                            )} 
                            onClick={() => getFiles(user.username)}
                            key={i}>{user.username}
                        </li>)}
                    </ul>
                </div>
            </div>
        );
    }
}

export default UsersList
