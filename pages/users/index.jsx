import { useState, useEffect } from 'react';

import { Link, Spinner } from 'components';
import { Layout } from 'components/users';
import { userService } from 'services';


function Index() {
    const [users, setUsers] = useState(null);
    useEffect(() => {
        userService.getAll().then(x => setUsers(x.result.users));
    }, []);

    function deleteUser(_id) {
        setUsers(users.map(x => {
            if (x._id === _id) { x.isDeleting = true; }
            return x;
        }));
        userService.delete(_id).then(() => {
            setUsers(users => users.filter(x => x._id !== _id));
        });
    }

    return (
        <Layout>
            <h1>Users</h1>
            {/* <Link href="/users/add" className="btn btn-sm btn-success mb-2">Add User</Link> */}
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th style={{ width: '30%' }}>First Name</th>
                        <th style={{ width: '30%' }}>Last Name</th>
                        <th style={{ width: '30%' }}>Email</th>
                        <th style={{ width: '10%' }}></th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.map(user =>
                        <tr key={user._id}>
                            <td>{user.first_name}</td>
                            <td>{user.last_name}</td>
                            <td>{user.email}</td>
                            <td style={{ whiteSpace: 'nowrap' }}>
                                <Link href={`/users/edit/${user._id}`} className="btn btn-sm btn-primary mr-1">View</Link>
                                {/* <button onClick={() => deleteUser(user._id)} className="btn btn-sm btn-danger btn-delete-user" disabled={user.isDeleting}>
                                    {user.isDeleting 
                                        ? <span className="spinner-border spinner-border-sm"></span>
                                        : <span>Delete</span>
                                    }
                                </button> */}
                            </td>
                        </tr>
                    )}
                    {!users &&
                        <tr>
                            <td colSpan="4">
                                <Spinner />
                            </td>
                        </tr>
                    }
                    {users && !users.length &&
                        <tr>
                            <td colSpan="4" className="text-center">
                                <div className="p-2">No Users To Display</div>
                            </td>
                        </tr>
                    }
                </tbody>
            </table>
        </Layout>
    );
}

export default Index;

