import React, { useEffect, useState } from 'react'
import axios from 'axios';

function Home() {

    const [data, setData] = useState([]);
    useEffect(() => {
        axios.get('http://3.18.220.84:8081/')
            .then(res => console.log(res))
            .catch(err => console.log(err));
    })

    return (
        <div className='d-flex justify-content-center align-items-center bg-dark'>
            <div className='bg-white rounded w-50'>
                <h2>My CRUD App</h2>
                <table className='table'>
                    <thread>
                        <tr>
                            <th>Name</th>
                            <th>Phone</th>
                            <th>Email</th>
                            <th>Action</th>
                        </tr>
                    </thread>
                    <tbody>

                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default Home