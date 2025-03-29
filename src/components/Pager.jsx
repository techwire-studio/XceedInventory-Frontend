import React from "react";
import ReactPaginate from "react-paginate";

const Pager = ({ perPage, total, onChange }) => {
	const links = Math.ceil(total / perPage);
	return (
		<ReactPaginate
			pageCount={links}
			onPageChange={(ev) => onChange(ev.selected + 1)}
			className="pagination pagination-sm"
			pageClassName="page-item"
			pageLinkClassName="page-link"
			previousClassName="page-item"
			nextClassName="page-item"
			previousLinkClassName="page-link"
			nextLinkClassName="page-link"
			activeClassName="page-item active"
		/>
	);
};

export default Pager;
