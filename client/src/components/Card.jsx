import { Link } from "react-router-dom";

function Card({ p, categories }) {
console.log(p)
  return (
    <div key={p.id} className="container mt-4 mb-4">
      <div className="card text-center">
        <img src={p.imgUrl} className="card-img-top" alt="..." />
        <div className="card-body">
          <h5 className="card-title">{p.name}</h5>
          <p className="card-text text-truncate">{p.description}</p>
          <p className="card-text">
            Category : {categories.find((category) => category.id === p.CategoryId)?.name}
          </p>
          <p className="card-text">Stock : {p.stock}</p>
          <p className="card-text">
            Price :{" "}
            {p.price?.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
              minumumFractionDigits: 0,
              maximumFractionDigits: 0,
            })}
          </p>
          <Link to={`./detail/${p.id}`}>
            <button className="btn btn-primary">Detail</button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Card;