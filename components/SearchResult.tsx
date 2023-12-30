/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useCart } from 'react-use-cart';
import { toast } from 'react-toastify';
import { currency } from '../lib/helpers';

const SearchResult = () => {
    const router = useRouter();
    const { addItem } = useCart();
    const [searchTerm, setSearchTerm] = useState<any>();
    const [searchResults, setSearchResults] = useState<any>();

    useEffect(() => {
        if (!router.isReady) {
            return;
        }

        searchProducts();
    }, [router.isReady]);

    function searchProducts() {
        const searchQuery = router.query.keyword;
        setSearchTerm(searchQuery);
        fetch('/api/search', {
            method: 'POST',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchTerm: searchQuery,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    toast(data.error, {
                        hideProgressBar: false,
                        autoClose: 2000,
                        type: 'error',
                    });
                    setSearchResults([]);
                    return;
                }
                setSearchResults(data);
            })
            .catch(err => {
                console.log('Payload error:' + err);
            });
    }

    if (!searchResults) {
        return <></>;
    }

    const mainImage = (product) => {
        const imgProps = {
            alt: 'product image',
            className: 'card-img-top',
            style: {
                width: '100%',
                height: '100%',
            },
        };

        if (product.images.length === 0) {
            return (
                <Link href={`/product/${product.permalink}`}>
                    <div>
                        <img {...imgProps} />
                    </div>
                </Link>
            );
        }

        return (
            <Link href={`/product/${product.permalink}`}>
                <div>
                    <img
                        {...imgProps}
                        alt={product.images[0].alt}
                        src={product.images[0].url}
                    />
                </div>
            </Link>
        );
    };

    return (
        <>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                <h5>
                    Showing {searchResults.length} results for &apos;
                    {searchTerm}&apos;
                </h5>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 g-3">
                {searchResults.map(product => (
                    <div className="col" key={product.id}>
                        <div className="card product-card">
                            {mainImage(product)}
                            <div className="card-body">
                                <div className="card-text">
                                    <Link
                                        className="link-secondary"
                                        href={`/product/${product.permalink}`}
                                    >
                                        <h2 className="h4">{product.name}</h2>
                                    </Link>
                                    <span className="h6 text-danger">
                                        {currency(product.price / 100)}
                                    </span>
                                    <p>{product.summary}</p>
                                    <div className="d-flex justify-content-between">
                                        <div className="btn-group flex-fill">
                                            <button
                                                className="btn btn-dark"
                                                onClick={() => {
                                                    addItem(product);
                                                    toast('Cart updated', {
                                                        hideProgressBar: false,
                                                        autoClose: 2000,
                                                        type: 'success',
                                                    });
                                                }}
                                            >
                                                Add to cart
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );
};

export default SearchResult;
