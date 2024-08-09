function Pagination({ paginationOption, currentPage, setCurrentPage }) {

  const { totalPage } = paginationOption;

  const handleChangePage = (page) => {
    if (page < 1 || page > totalPage) return;
    setCurrentPage(page);
  };
console.log(totalPage)
  const pageNumbers = () => {
    let numbers = [];
    for (let i = 1; i <= totalPage; i++) {
      numbers.push(
        <li className="page-item" key={i}>
          <button
            className={
              "page-link " +
              (currentPage === i ? "fw-semibold link-underline-primary" : "")
            }
            onClick={() => handleChangePage(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    return numbers;
  };

  return (
    <ul className="pagination">
      <li className="page-item">
        <button
          className="page-link"
          onClick={() => handleChangePage(currentPage - 1)}
        >
          Previous
        </button>
      </li>
      {pageNumbers()}
      <li className="page-item">
        <button
          className="page-link"
          onClick={() => handleChangePage(currentPage + 1)}
        >
          Next
        </button>
      </li>
    </ul>
  );
}

export default Pagination;
