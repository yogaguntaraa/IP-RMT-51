import { useEffect, useState } from "react";
import instance from "../api/axios";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2"

function PublicDetail() {
    const [products, setProducts] = useState({});
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState("");

    const params = useParams();

    useEffect(() => {
        setIsLoading(true);


        async function fetchData() {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    instance.get(`/pub/products/${params.id}`),
                    instance.get("/pub/categories"),
                ]);
                console.log(categoriesResponse.data.category)
                setProducts(productsResponse.data.product);
                setCategories(categoriesResponse.data.category);
            } catch (error) {
                if (error.response) {
                    setError(error.response.data.message);
                } else {
                    setError("Something went wrong");
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [params.id]);

    const handlePayment = async () => {
        const { data } = await instance.get(`/pub/payment/midtrans/${params.id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        })

        window.snap.pay(data.transactionToken, {
            onSuccess: async function (result) {
                console.log(result);
                await instance.patch("/pub/payment/midtrans/approve", {
                    orderId: data.orderId
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
            },
        })
    }

    return (

        <main className="mt-5">
            {error && <p>{error}</p>}
            {isLoading ? (
                <p>Loading...</p>
            ) : (
                <div className="card mb-3">
                    <div className="row g-0">
                        <div className="col-md-4">
                            <img
                                src={products.imgUrl}
                                className="img-fluid rounded-start"
                                alt="..."
                            />
                        </div>
                        <div className="col-md-8">
                            <div className="card-body">
                                <h5 className="card-title">{products.name}</h5>
                                <p className="card-text">{products.description}</p>
                                <p className="card-text">
                                    <small className="text-body-secondary">
                                        Category :{" "}
                                        {
                                            categories.find((category) => category.id === products.CategoryId)
                                                .name
                                        }
                                    </small>
                                </p>
                                <p className="card-text">
                                    <small className="text-body-secondary">
                                        Stock : {products.stock}
                                    </small>
                                </p>
                                <p className="card-text">
                                    <small className="text-body-secondary">
                                        Price :{" "}
                                        {products.price?.toLocaleString("id-ID", {
                                            style: "currency",
                                            currency: "IDR",
                                            minumumFractionDigits: 0,
                                            maximumFractionDigits: 0,
                                        })}
                                    </small>
                                </p>
                                <br />
                                <button onClick={handlePayment} className=" col-3 container-fluid btn btn-success">
                                    <img src="/shopping-cart.svg" alt="" />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </main>
    );
}

export default PublicDetail;
