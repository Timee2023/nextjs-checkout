import { NextPage } from 'next';
import { useSession } from 'next-auth/react';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    Breadcrumb,
    Button,
    Dropdown,
    DropdownButton,
    Form,
    InputGroup,
} from 'react-bootstrap';
import Layout from '../../components/Layout';
import Cart from '../../components/Cart';
import NavAdmin from '../../components/NavAdmin';
import DataTable from '../../components/DataTable';
import Spinner from '../../components/Spinner';

const CustomersPage: NextPage = () => {
    const router = useRouter();
    const [customers, setCustomers] = useState(false);
    const [searchParameter, setSearchParameter] = useState('id');
    const [searchTerm, setSearchTerm] = useState('');
    const [searchParameterPlaceholder, setSearchParameterPlaceholder] =
        useState('Customer ID');
    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        getCustomers();
    }, [router.isReady]);

    function getCustomers() {
        fetch('/api/customers', {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setCustomers(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    function searchCustomers() {
        fetch('/api/customers/search', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: searchTerm,
                searchParameter: searchParameter,
            }),
        })
            .then(function (response) {
                return response.json();
            })
            .then(function (data) {
                setCustomers(data);
            })
            .catch(function (err) {
                // There was an error
                console.log('Payload error:' + err);
            });
    }

    // Check for user session
    const { status } = useSession({
        required: true,
        onUnauthenticated() {
            window.location.href = '/api/auth/signin';
        },
    });

    if (status === 'loading') {
        return <Spinner loading={true} />;
    }

    // Check for customers
    if (!customers) {
        return <></>;
    }

    const columns = [
        {
            name: 'id',
            title: 'Customer ID',
            link: '/admin/customer/',
        },
        {
            name: 'created_at',
            title: 'Date',
            format: 'date',
        },
        {
            name: 'email',
            title: 'Email',
        },
        {
            name: 'firstName',
            title: 'First Name',
        },
        {
            name: 'lastName',
            title: 'Last Name',
        },
        {
            name: 'suburb',
            title: 'Suburb',
        },
    ];

    return (
        <Layout title="nextjs-checkout | Customers">
            <Cart>
                <NavAdmin />
                <h2>Customers</h2>
                <Breadcrumb>
                    <Breadcrumb.Item href="/admin/dashboard">
                        Home
                    </Breadcrumb.Item>
                    <Breadcrumb.Item active>Customers</Breadcrumb.Item>
                </Breadcrumb>
                <InputGroup className="mb-3">
                    <DropdownButton
                        title={searchParameterPlaceholder}
                        variant="outline-secondary"
                    >
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('id');
                                setSearchParameterPlaceholder('Customer ID');
                            }}
                        >
                            Customer ID
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('customerEmail');
                                setSearchParameterPlaceholder('Customer Email');
                            }}
                        >
                            Customer Email
                        </Dropdown.Item>
                        <Dropdown.Item
                            onClick={() => {
                                setSearchParameter('customerLastName');
                                setSearchParameterPlaceholder(
                                    'Customer Surname',
                                );
                            }}
                        >
                            Customer Surname
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        aria-label={searchParameterPlaceholder}
                        onChange={event => {
                            setSearchTerm(event.target.value);
                        }}
                        placeholder={searchParameterPlaceholder}
                        value={searchTerm}
                    />
                    <Button
                        onClick={() => {
                            searchCustomers();
                        }}
                        variant="outline-success"
                    >
                        Filter
                    </Button>
                    <Button
                        onClick={() => {
                            getCustomers();
                            setSearchParameter('id');
                            setSearchTerm('');
                        }}
                        variant="outline-danger"
                    >
                        X
                    </Button>
                </InputGroup>
                <DataTable columns={columns} data={customers} />
            </Cart>
        </Layout>
    );
};

export default CustomersPage;
