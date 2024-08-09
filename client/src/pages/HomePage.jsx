import { useEffect, useState } from "react";
import instance from "../api/axios";
import Card from "../components/Card";
import Swal from "sweetalert2";
import Pagination from "../components/Pagination";

function HomePage() {
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10
    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("");
    const [paginationOption, setPaginationOption] = useState({
        totalData: 0,
        totalPage: 1,
        dataPerPage: 0,
      });

    const columnSort = [
        { id: 1, name: "name" },
        { id: 2, name: "stock" },
        { id: 3, name: "price" },
    ];

    useEffect(() => {
        setIsLoading(true);

        async function fetchData() {
            try {
                const [productsResponse, categoriesResponse] = await Promise.all([
                    instance.get("/pub/products", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }, {
                        params: {
                            page: {
                                number: currentPage,
                                size: pageSize,
                            },
                            search,
                            filter,
                            sort,
                        },
                    }),
                    instance.get("/pub/categories", {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }),
                ]);

                let { totalData, totalPage, dataPerPage } = productsResponse.data
                // console.log(productsResponse.data)
                setProducts(productsResponse.data.data);
                setCategories(categoriesResponse.data.category);
                setPaginationOption(() => ({ totalData, totalPage, dataPerPage }));
            } catch (err) {
                if (err.response) {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: err.response.data.message,
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: "Oops...",
                        text: `Something went wrong`,
                    });
                }
            } finally {
                setIsLoading(false);
            }
        }

        fetchData();
    }, [currentPage, pageSize, search, filter, sort]);
    return (
        <main style={{backgroundColor: "#DCDCDC"}}>
            <br />
            <div className="container">
                <form className="row g-3">
                    <div className="col-md-6">
                        <label htmlFor="inputEmail4" className="form-label fw-semibold">
                            SetPage
                        </label>
                        <input
                            type="number"
                            className="form-control"
                            id="inputEmail4"
                            value={pageSize}
                            onChange={(e) => setPageSize(e.target.value)}
                        />

                        <label htmlFor="inputEmail4" className="form-label fw-semibold">
                            Filter
                        </label>
                        <select
                            className="form-select"
                            aria-label="Default select example"
                            defaultValue=""
                            value={filter}
                            onChange={(e) => setFilter(e.target.value)}
                        >
                            <option value="" disabled>
                                Filter by Category
                            </option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="inputEmail4" className="form-label fw-semibold">
                            Sort
                        </label>
                        <div className="input-group">
                            <select
                                className="form-select"
                                aria-label="Default select example"
                                defaultValue=""
                                value={sort}
                                onChange={(e) => setSort(e.target.value)}
                            >
                                <option value="" disabled>
                                    Sort by Column
                                </option>
                                {columnSort.map((column) => (
                                    <option key={column.id} value={column.name}>
                                        {column.name}
                                    </option>
                                ))}
                            </select>
                            <button
                                onClick={() => {
                                    if (sort) {
                                        setSort(sort.replace("-", ""));
                                    }
                                }}
                                className="btn btn-outline-secondary"
                                type="button"
                            >
                                ASC
                            </button>
                            <button
                                onClick={() => {
                                    if (sort && !sort.startsWith("-")) {
                                        setSort("-" + sort);
                                    }
                                }}
                                className="btn btn-outline-secondary"
                                type="button"
                            >
                                DESC
                            </button>
                        </div>
                    </div>
                    <div className="col-12 d-flex">
                        <input
                            className="form-control me-2"
                            type="search"
                            placeholder="Search"
                            aria-label="Search"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </form>
            </div>
            {/* <h1 className=" mt-4 fw-bold">List Products</h1> */}

            <div className="container mt-4">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
                    <div className="row row-cols-3 g-3">
                        {products.map((p) => (
                            <Card key={p.id} p={p} categories={categories} />
                        ))}
                    </div>
                )}
            </div>
            <div className="w-full d-flex justify-content-center mt-3">
                <Pagination
                    paginationOption={paginationOption}
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </main>
    );
}

export default HomePage;